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
  checkingStartAction, uploadStartedAction, uploadFailedAction,
  checkingStartedAction, failedAction } from '../actions';
import { apiFetchJson } from '../api-fetch';
import { ValidationParams,  } from '../models';
import { startupInfoSaga, checkingStartSaga } from '../sagas';
import { exampleUser, exampleApps, exampleCategory, exampleFiling, exampleFilingVersion } from './model-examples';

describe('startupInfoSaga', () => {
  it('calls APIs in parallel and dispatches profiles', () => {
    const saga = startupInfoSaga();

    expect(saga.next().value).toEqual(all([
      call(apiFetchJson, '/api/user'),
      call(apiFetchJson, '/api/document-service/v1/categories/validation'),
      call(apiFetchJson, '/api/apps'),
    ]));
    expect(saga.next([exampleUser, exampleCategory, exampleApps]).value)
      .toEqual(put(startupInfoReceivedAction(exampleUser, exampleApps, exampleCategory.profiles)));
  });

  it('is sad if no profiles', () => {
    const saga = startupInfoSaga();

    saga.next();
    expect(saga.next([{}, {}]).value)
    .toEqual(put(startupInfoFailedAction(jasmine.stringMatching(/No profiles/) as any)));
  });

  it('is sad if error fetching profiles', () => {
    const saga = startupInfoSaga();

    saga.next();
    expect(saga.throw && saga.throw({status: 403, statusText: 'LOLWAT'}).value)
    .toEqual(put(startupInfoFailedAction(jasmine.stringMatching(/LOLWAT/) as any)));
  });
});

describe('checkingStartSaga', () => {
  const files = [
    new File(['Hello, world!'], 'a-file.txt', {type: 'text/plain'}),
    new File(['hello world'], 'another-file.txt', {type: 'text/plain'}),
  ];
  const params: ValidationParams = {
    profile: 'uiid-of-profile',
    files,
  };

  it('dispatches UPLOAD_COMPLETE and CHECKING_RECEIVED if all goes well', () => {
    const saga = checkingStartSaga(checkingStartAction(params));

    expect(saga.next().value).toEqual(put(uploadStartedAction(params)));
    const formData = new FormData();
    formData.append('validationProfile', 'uuid-of-profile');
    formData.append('name', 'a-file.txt');
    formData.append('file', files[0], 'a-file.txt');
    formData.append('file', files[1], 'another-file.txt');
    // Does not set dataSet (so server will use the default dataset).
    expect(saga.next().value).toEqual(call(apiFetchJson, '/api/document-service/v1/filings/', {
      method: 'POST',
      body: formData,  // This test is less strict than it looks because all formData object compare equal.
    }));
    expect(saga.next(exampleFiling).value).toEqual(put(checkingStartedAction()));

    // Then poll for updates after 1 second.
    expect(saga.next().value).toEqual(call(delay, 1000));
    expect(saga.next().value).toEqual(call(apiFetchJson, '/api/document-service/v1/filing-versions/f09be954-1895-4954-b333-6c9c89b833f1'));
    expect(saga.next({...exampleFilingVersion, status: 'RUNNING'}).value).toEqual(call(delay, 1000));
    expect(saga.next().value).toEqual(call(apiFetchJson, '/api/document-service/v1/filing-versions/f09be954-1895-4954-b333-6c9c89b833f1'));
    // Gets filing-version results, move on to fetching tables.
    expect(saga.next({...exampleFilingVersion, status: 'DONE'}).value).toEqual(call(
      apiFetchJson,
      '/api/table-rendering-service/v1/filing-versions/f09be954-1895-4954-b333-6c9c89b833f1/tables/'));
  });

  it('dispatches FAILED if initial upload fails', () => {
    const saga = checkingStartSaga(checkingStartAction(params));

    saga.next(); saga.next();  // First few steps as above.

    expect(saga.throw && saga.throw(new Error('LOLWAT')).value)
    .toEqual(put(uploadFailedAction(jasmine.stringMatching(/LOLWAT/) as any)));
  });

  it('dispatches FAILED if polling fails', () => {
    const saga = checkingStartSaga(checkingStartAction(params));

    saga.next(); saga.next(); saga.next(exampleFiling); saga.next();  // First few steps as above.

    expect(saga.throw && saga.throw(new Error('LOLWAT')).value).toEqual(put(failedAction('LOLWAT')));
  });

  it('dispatches FAILED if polling fails with response', () => {
    const saga = checkingStartSaga(checkingStartAction(params));

    saga.next(); saga.next(); saga.next(exampleFiling); saga.next();  // First few steps as above.

    expect(saga.throw && saga.throw({status: 400, statusText: 'Nope.'}).value)
    .toEqual(put(failedAction(jasmine.stringMatching(/Nope./) as any)));
  });
});
