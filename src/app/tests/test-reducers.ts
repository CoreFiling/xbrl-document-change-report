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
import { startupInfoReceivedAction,
  uploadStartedAction, uploadFailedAction,
  checkingStartedAction, checkingReceivedAction, failedAction,
  tablesReceivedAction, tableRenderingRequested, tableRenderingReceivedAction,
  resultsDismissAction } from '../actions';
import { ValidationParams } from '../models';
import { globalReducer, filingReducer } from '../reducers';
import { GlobalState, FilingState } from '../state';
import { exampleQueryableTablePage, exampleTableMetadata,
  exampleTableRenderingWindow, exampleZOption } from './model-examples';

const params: ValidationParams = {
  profile: 'CRD V 1.69.42',
  files: [
    new File(['hello'], 'accounts-final-rev4.xbrl'),
    new File(['hello'], 'accounts-final-rev5.xbrl'),
  ],
};

describe('globalReducer', () => {

  const initial: GlobalState = globalReducer(undefined, {type: '????'});

  it('is initially in the form', () => {
    expect(initial.phase).toBe('startup');
  });

  it('remembers profiles', () => {
    const user = {sub: 'uuid-of-user', name: 'Uttara Todorov', email: 'ut@example.com', preferred_username: 'ut'};
    const apps = [{id: 'app', name: 'App', href: '/app/'}];
    const profiles = [{id: 'profilename', name: 'Profile Label'}];
    const after = globalReducer(initial, startupInfoReceivedAction(user, apps, profiles));

    expect(after.user).toEqual(user);
    expect(after.apps).toEqual(apps);
    expect(after.profiles).toEqual(profiles);
  });

  it('switches to results as soon as checking requested', () => {
    const after = globalReducer(initial, uploadStartedAction(params));

    expect(after.phase).toBe('uploading');
  });

  it('switches to results as soon as checking requested', () => {
    const after = globalReducer(initial, uploadFailedAction('LOLWAT'));

    expect(after.phase).toBe('uploading-failed');
  });

  it('switches to results as soon as checking requested', () => {
    const after = globalReducer(initial, checkingStartedAction());

    expect(after.phase).toBe('checking');
  });

  it('remembers validation status', () => {
    const after = globalReducer(initial, checkingReceivedAction('12345678', 'OK'));

    expect(after.phase).toBe('results');
  });

  it('treats failing to get status after checking started as fatal error', () => {
    const after = globalReducer(initial, failedAction('LOLWAT'));

    expect(after.phase).toBe('failed');
  });

  it('is ready for a new game after user dismisses results', () => {
    const before = globalReducer(initial, checkingReceivedAction('12345678', 'OK'));

    const after = globalReducer(before, resultsDismissAction());

    expect(after.phase).toBe('form');
  });

  it('is ready for a new game after user dismisses error', () => {
    const before = globalReducer(initial, failedAction('LOLWAT'));

    const after = globalReducer(before, resultsDismissAction());

    expect(after.phase).toBe('form');
    expect(after.message).toBeUndefined();
  });
});

describe('filingReducer', () => {

  const initial: FilingState = filingReducer(undefined, {type: '????'});
  const full: FilingState = {
    status: 'FATAL_ERROR',
    selectedTable: exampleTableMetadata,
    tableRendering: exampleQueryableTablePage,
    tables: [exampleTableMetadata],
    zOptions: [[exampleZOption]],
  };

  it('is initially in the form', () => {
    expect(initial).toEqual({});
  });

  it('clears filing state when starting an upload', () => {
    const after = filingReducer(full, uploadStartedAction(params));
    expect(after).toEqual({});
  });

  it('clears all filing state when dismissing results', () => {
    const after = filingReducer(full, resultsDismissAction());
    expect(after).toEqual({});
  });

  it('remembers status', () => {
    const after = filingReducer(initial, checkingReceivedAction('12345678', 'ERROR'));
    expect(after.status).toEqual('ERROR');
  });

  it('remembers tables and selects the first table by default', () => {
    const tables = [exampleTableMetadata];
    const after = filingReducer(initial, tablesReceivedAction(tables));
    expect(after.tables).toEqual(tables);
  });

  it('clears table options when the table changes', () => {
    const after = filingReducer(full, tableRenderingRequested(exampleTableMetadata, exampleTableRenderingWindow));
    expect(after.selectedTable).toEqual(exampleTableMetadata);
    expect(after.zOptions).toEqual([]);
    expect(after.tableRendering).toBeUndefined();
  });

  it('remembers table rendering', () => {
    const zOptions = {} as any;
    const tableRendering = {} as any;
    const after = filingReducer(full, tableRenderingReceivedAction(zOptions, tableRendering));
    expect(after.tableRendering).toEqual(tableRendering);
  });

});
