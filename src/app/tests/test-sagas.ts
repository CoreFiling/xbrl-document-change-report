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

import {} from 'jasmine';
import { delay } from 'redux-saga';
import { all, call, put } from 'redux-saga/effects';

import { startupInfoReceivedAction, startupInfoFailedAction,
  processingStartAction, uploadStartedAction, uploadFailedAction,
  processingStartedAction, processingFailedAction, issuesAction, tablesReceivedAction, tableRenderPageAction } from '../actions';
import {
  profilesApi,
  uploadApi,
  tablesApi,
  validationServiceIssuesApi as vsiapi,
  tableRenderingServiceFilingsVersionsApi as trsfvapi,
} from '../apis';
import { apiFetchJson } from '../api-fetch';
import { JobParams,  } from '../models';
import { startupInfoSaga, processingStartSaga } from '../sagas';
import { exampleUser, exampleApps, exampleProfiles, exampleFiling, exampleComparisonSummary, exampleTableMetadata } from './model-examples';
import { DiffTableMetadata } from '@cfl/table-diff-service';
import { TableMetadata } from '@cfl/table-rendering-service';

describe('startupInfoSaga', () => {
  it('calls APIs in parallel and dispatches profiles', () => {
    const saga = startupInfoSaga();

    expect(saga.next().value).toEqual(all([
      call(apiFetchJson, '/api/user'),
      call([profilesApi, profilesApi.getProfiles]),
      call(apiFetchJson, '/api/apps'),
    ]));
    expect(saga.next([exampleUser, exampleProfiles, exampleApps]).value)
      .toEqual(put(startupInfoReceivedAction(exampleUser, exampleApps, exampleProfiles)));
  });

  it('is sad if no profiles', () => {
    const saga = startupInfoSaga();

    saga.next();
    expect(saga.next([{}, [], {}]).value)
    .toEqual(put(startupInfoFailedAction(jasmine.stringMatching(/No profiles/) as any)));
  });

  it('is sad if error fetching profiles', () => {
    const saga = startupInfoSaga();

    saga.next();
    expect(saga.throw && saga.throw({status: 403, statusText: 'LOLWAT'}).value)
    .toEqual(put(startupInfoFailedAction(jasmine.stringMatching(/LOLWAT/) as any)));
  });
});

describe('processingStartSaga', () => {

  const file1 = new File(['Hello, world!'], 'a-file.txt', {type: 'text/plain'});
  const file2 = new File(['hello world'], 'another-file.txt', {type: 'text/plain'});
  const params: JobParams = {
    profile: 'uiid-of-profile',
    file1,
    file2,
  };

  it('dispatches PROCESSING_STARTED and does not dispatch TABLES_RECEIVED if there are fatal errors', () => {
    const saga = processingStartSaga(processingStartAction(params));

    expect(saga.next().value).toEqual(put(uploadStartedAction(params)));
    const formData = new FormData();
    // dataSet omitted on the assumption iot defaults to user’s only permitrted dataset.
    formData.append('validationProfile', 'uuid-of-profile');
    formData.append('name', 'a-file.txt');
    formData.append('originalFiling', file1, 'a-file.txt');
    formData.append('newFiling', file2, 'another-file.txt');
    expect(saga.next().value).toEqual(call(apiFetchJson, '/api/table-diff-service/v1/comparisons/', {
      method: 'POST',
      body: formData,  // This test is less strict than it looks because all formData object compare equal.
    }));
    expect(saga.next(exampleFiling).value).toEqual(put(processingStartedAction()));

    // Then poll for updates after 1 second.
    expect(saga.next().value).toEqual(call(delay, 1000));
    expect(saga.next().value).toEqual(call([uploadApi, uploadApi.getComparison], {comparisonId: '8723b794-3261-4cd3-b946-b683c19fb99c'}));
    expect(saga.next({...exampleComparisonSummary, status: 'RUNNING'}).value).toEqual(call(delay, 1000));
    expect(saga.next().value).toEqual(call([uploadApi, uploadApi.getComparison], {comparisonId: '8723b794-3261-4cd3-b946-b683c19fb99c'}));
    expect(saga.next({...exampleComparisonSummary, status: 'DONE'}).value)
               .toEqual(call([vsiapi, vsiapi.getIssues], {filingVersionId: '8723b794-3261-4cd3-b946-b683c19fb99c'}));
    // Gets filing-version results, move on to fetching tables.
    expect(saga.next([{validationMessage: {severity: 'FATAL_ERROR'} }]).value)
               .toEqual(put(issuesAction('8723b794-3261-4cd3-b946-b683c19fb99c', [{severity: 'FATAL_ERROR'}])));
    expect(saga.next().done).toBeTruthy();
  });

  it('dispatches PROCESSING_STARTED and TABLES_RECEIVED if all goes well', () => {
    const saga = processingStartSaga(processingStartAction(params));

    expect(saga.next().value).toEqual(put(uploadStartedAction(params)));
    const formData = new FormData();
    // dataSet omitted on the assumption iot defaults to user’s only permitrted dataset.
    formData.append('validationProfile', 'uuid-of-profile');
    formData.append('name', 'a-file.txt');
    formData.append('originalFiling', file1, 'a-file.txt');
    formData.append('newFiling', file2, 'another-file.txt');
    expect(saga.next().value).toEqual(call(apiFetchJson, '/api/table-diff-service/v1/comparisons/', {
      method: 'POST',
      body: formData,  // This test is less strict than it looks because all formData object compare equal.
    }));
    expect(saga.next(exampleFiling).value).toEqual(put(processingStartedAction()));

    // Then poll for updates after 1 second.
    expect(saga.next().value).toEqual(call(delay, 1000));
    expect(saga.next().value).toEqual(call([uploadApi, uploadApi.getComparison], {comparisonId: '8723b794-3261-4cd3-b946-b683c19fb99c'}));
    expect(saga.next({...exampleComparisonSummary, status: 'RUNNING'}).value).toEqual(call(delay, 1000));
    expect(saga.next().value).toEqual(call([uploadApi, uploadApi.getComparison], {comparisonId: '8723b794-3261-4cd3-b946-b683c19fb99c'}));
    expect(saga.next({...exampleComparisonSummary, status: 'DONE'}).value)
               .toEqual(call([vsiapi, vsiapi.getIssues], {filingVersionId: '8723b794-3261-4cd3-b946-b683c19fb99c'}));
    // Gets filing-version results, move on to fetching tables.
    expect(saga.next([{validationMessage: {severity: 'ERROR'} }]).value)
               .toEqual(put(issuesAction('8723b794-3261-4cd3-b946-b683c19fb99c', [{severity: 'ERROR'}])));
    expect(saga.next().value).toEqual(
      all([
        call([trsfvapi, trsfvapi.getTables], {filingVersionId: '8723b794-3261-4cd3-b946-b683c19fb99c'}),
        call([tablesApi, tablesApi.getTables], {comparisonId: '8723b794-3261-4cd3-b946-b683c19fb99c'}),
      ]));

    // When we get table metadata, we want the non-changed tables filtered out.
    const tables: TableMetadata[] = [
      {...exampleTableMetadata, id: 'foo'},
      {...exampleTableMetadata, id: 'bar'},
      {...exampleTableMetadata, id: 'baz'},
      {...exampleTableMetadata, id: 'quux'},
      {...exampleTableMetadata, id: 'quux2'},
    ];
    const diffTables: DiffTableMetadata[] = [
      {id: 'foo', diffStatus: 'NOP'},
      {id: 'quux2', diffStatus: 'DEL'},
      {id: 'quux', diffStatus: 'ADD'},
      {id: 'bar', diffStatus: 'CHG'},
      {id: 'baz', diffStatus: 'NOP'},
    ];
    const expectedTables = [tables[1], tables[3], tables[4]];
    expect(saga.next([tables, diffTables]).value).toEqual(put(tablesReceivedAction(expectedTables)));
    expect(saga.next().value).toEqual(put(tableRenderPageAction({...exampleTableMetadata, id: 'bar' }, 0, 0, 0)));
    expect(saga.next().done).toBeTruthy();
  });

  it('dispatches FAILED if initial upload fails', () => {
    const saga = processingStartSaga(processingStartAction(params));

    saga.next(); saga.next();  // First few steps as above.

    expect(saga.throw && saga.throw(new Error('LOLWAT')).value)
    .toEqual(put(uploadFailedAction(jasmine.stringMatching(/LOLWAT/) as any)));
  });

  it('dispatches FAILED if polling fails', () => {
    const saga = processingStartSaga(processingStartAction(params));

    saga.next(); saga.next(); saga.next(exampleFiling); saga.next();  // First few steps as above.

    expect(saga.throw && saga.throw(new Error('LOLWAT')).value).toEqual(put(processingFailedAction('LOLWAT')));
  });

  it('dispatches FAILED if polling fails with response', () => {
    const saga = processingStartSaga(processingStartAction(params));

    saga.next(); saga.next(); saga.next(exampleFiling); saga.next();  // First few steps as above.

    expect(saga.throw && saga.throw({status: 400, statusText: 'Nope.'}).value)
    .toEqual(put(processingFailedAction(jasmine.stringMatching(/Nope./) as any)));
  });
});
