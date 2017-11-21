/*
 *  Copyright 2017 CoreFiling S.A.R.L.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import { delay, Effect } from 'redux-saga';
import { all, call, put, takeEvery } from 'redux-saga/effects';
import { Profile, ComparisonSummary } from '@cfl/table-diff-service';

import {
  PROCESSING_START,
  ProcessingAction,
  failedAction,
  processingStartedAction,
  startupInfoFailedAction,
  startupInfoReceivedAction,
  TABLE_RENDER_PAGE,
  tableRenderingReceivedAction,
  tableRenderingRequested,
  TableRenderPageAction,
  tableRenderPageAction,
  tablesReceivedAction,
  uploadFailedAction,
  uploadStartedAction,
} from './actions';
import { profilesApi, uploadApi } from './apis';
import { apiFetchJson } from './api-fetch';
import { App, User } from './models';
import QueryableTablePageImpl, { TABLE_WINDOW_HEIGHT } from './models/queryable-table-page-impl';
import {
  APPS,
  TABLE_DIFF_SERVICE_COMPARISONS,
  tableRenderingServiceRender,
  tableRenderingServiceTables,
  tableRenderingServiceZOptions,
  USER,
} from './urls';

const POLL_MILLIS = 1000;

/**
 * Fetch the information needed at startup. If this fails we cannot show the app.
 */
export function* startupInfoSaga(): IterableIterator<Effect> {
  try {
    const [user, profiles, apps]: [User, [Profile], App[]] = yield all([
      call(apiFetchJson, USER),
      call([profilesApi, profilesApi.getProfiles]),
      call(apiFetchJson, APPS),
    ]);
    if (!profiles || profiles.length === 0) {
      yield put(startupInfoFailedAction('Startup failed (No profiles)'));
      return;
    }
    yield put(startupInfoReceivedAction(user, apps, profiles));
  } catch (res) {
    yield put(startupInfoFailedAction(`Startup failed (${res.message || res.statusText || res.status}).`));
  }
}

/**
 * Start checking one filing. Triggered by `checkingSaga`. Exported for testing.
 */
export function* processingStartSaga(action: ProcessingAction): IterableIterator<Effect> {
  const { params } = action;
  yield put(uploadStartedAction(params));

  // Create the filing by uploading the file to the Document Service.
  const { profile, file1, file2 } = params;
  const formData = new FormData();
  formData.append('originalFiling', file1, file1.name);
  formData.append('newFiling', file2, file2.name);
  formData.append('name', file2.name);
  formData.append('validationProfile', profile);
  const init: RequestInit = {
    method: 'POST',
    body: formData,
  };

  let comparisonSummary: ComparisonSummary;
  try {
    comparisonSummary = yield call(apiFetchJson, TABLE_DIFF_SERVICE_COMPARISONS, init);
  } catch (res) {
    console.log(res);
    yield put(uploadFailedAction(`File error (${res.message || res.statusText || res.status}).`));
    return;
  }
  yield put(processingStartedAction());

  try {
    // Poll for filing completion status.
    while (comparisonSummary.status !== 'DONE') {
      yield call(delay, POLL_MILLIS);
      comparisonSummary = yield call([uploadApi, uploadApi.getComparison], {comparisonId: comparisonSummary.id});
    }

    // Fetch table info
    const tables = yield call(apiFetchJson, tableRenderingServiceTables(comparisonSummary.id));
    yield put(tablesReceivedAction(tables));

    // Select the first table if any are available.
    if (tables.length > 0) {
      yield put(tableRenderPageAction(tables[0], 0, 0, 0));
    }
  } catch (res) {
    yield put(failedAction(res.message || res.statusText || `Status: ${res.status}`));
  }
}

export function* tableRenderingSaga(action: TableRenderPageAction): IterableIterator<Effect> {
  const { table, x, y, z } = action;
  try {
    const width = table.x.sliceCount > 0 && table.x.depth > 0 ? table.x.sliceCount : 1;
    const window = {x, y, z, width, height: TABLE_WINDOW_HEIGHT};
    yield put(tableRenderingRequested(table, window));

    const [ zOptions, tableRendering ] = yield all([
      call(apiFetchJson, tableRenderingServiceZOptions(table.id, 0)),
      call(apiFetchJson, tableRenderingServiceRender(table.id, window)),
    ]);
    yield put(tableRenderingReceivedAction(zOptions, new QueryableTablePageImpl(table, tableRendering)));
  } catch (res) {
    yield put(failedAction(res.message || res.statusText || `Status: ${res.status}`));
  }
}

/**
 * Watch for actions.
 */
export function* checkingSaga(): IterableIterator<Effect> {
  yield all([
    takeEvery(PROCESSING_START, processingStartSaga),
    takeEvery(TABLE_RENDER_PAGE, tableRenderingSaga),
  ]);
}
