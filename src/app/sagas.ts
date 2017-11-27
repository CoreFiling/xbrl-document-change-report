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
import { Profile, ComparisonSummary, DiffTableMetadata } from '@cfl/table-diff-service';

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
import { profilesApi, uploadApi, filingsVersionsApi, tablesApi, diffInfosApi } from './apis';
import { apiFetchJson } from './api-fetch';
import { App, User } from './models';
import DiffifiedQueryableTablePage, { TABLE_WINDOW_HEIGHT } from './models/queryable-table-page-impl';
import { APPS, TABLE_DIFF_SERVICE_COMPARISONS, USER } from './urls';
import { TableMetadata } from '@cfl/table-rendering-service';

const POLL_MILLIS = 1000;

/**
 * Fetch the information needed at startup. If this fails we cannot show the app.
 */
export function* startupInfoSaga(): IterableIterator<Effect> {
  try {
    const [user, profiles, apps]: [User, Profile[], App[]] = yield all([
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
 * Start processing on comparison. Triggered by `mainSaga`. Exported for testing.
 */
export function* processingStartSaga(action: ProcessingAction): IterableIterator<Effect> {
  const { params } = action;
  yield put(uploadStartedAction(params));

  // Create the filing by uploading the file to the Document Service.
  const { profile, file1, file2 } = params;
  const formData = new FormData();
  formData.append('validationProfile', profile);
  formData.append('name', file2.name);
  formData.append('originalFiling', file1, file1.name);
  formData.append('newFiling', file2, file2.name);
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

  const comparisonId = comparisonSummary.id;

  try {
    // Poll for filing completion status.
    while (comparisonSummary.status !== 'DONE') {
      yield call(delay, POLL_MILLIS);
      comparisonSummary = yield call([uploadApi, uploadApi.getComparison], {comparisonId});
    }

    // Fetch table info. (The comparison ID is also a filing version ID so far as the tables API is converned.)
    const [tables, diffTables]: [TableMetadata[], DiffTableMetadata[]] = yield all([
      call([filingsVersionsApi, filingsVersionsApi.getTables], {filingVersionId: comparisonId}),
      call([diffInfosApi, diffInfosApi.getTables], {comparisonId}),
    ]);
    // Drop tables that lack changes.
    const filteredTables = tables.filter(t => {
      const diff = diffTables.find(x => x.id === t.id);
      return !diff || diff.diffStatus !== 'NOP';
    });
    yield put(tablesReceivedAction(filteredTables));

    // Select the first table if any are available.
    if (filteredTables.length > 0) {
      yield put(tableRenderPageAction(filteredTables[0], 0, 0, 0));
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

    const [ zOptions, tableRendering, diffRendering ] = yield all([
      call([tablesApi, tablesApi.getTableZOptions], {tableId: table.id, z: 0}),
      call([tablesApi, tablesApi.renderTable], {tableId: table.id, ...window}),
      call([diffInfosApi, diffInfosApi.renderTable], {tableId: table.id, ...window}),
    ]);
    yield put(tableRenderingReceivedAction(zOptions, new DiffifiedQueryableTablePage(table, tableRendering, diffRendering)));
  } catch (res) {
    yield put(failedAction(res.message || res.statusText || `Status: ${res.status}`));
  }
}

/**
 * Watch for actions.
 */
export function* mainSaga(): IterableIterator<Effect> {
  yield all([
    takeEvery(PROCESSING_START, processingStartSaga),
    takeEvery(TABLE_RENDER_PAGE, tableRenderingSaga),
  ]);
}
