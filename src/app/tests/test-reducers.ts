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
  processingStartedAction, processingFailedAction, issuesAction, tableRenderingFailedAction,
  tablesReceivedAction, tableRenderingRequested, tableRenderingReceivedAction,
  resultsDismissAction } from '../actions';
import { JobParams } from '../models';
import { globalReducer, filingReducer } from '../reducers';
import { GlobalState, FilingState } from '../state';
import { exampleQueryableTablePage, exampleTableMetadata,
  exampleTableRenderingWindow, exampleZOption } from './model-examples';

const params: JobParams = {
  profile: 'CRD V 1.69.42',
  file1: new File(['hello'], 'accounts-final-rev4.xbrl'),
  file2: new File(['hello'], 'accounts-final-rev5.xbrl'),
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
    const after = globalReducer(initial, processingStartedAction());

    expect(after.phase).toBe('processing');
  });

  it('remembers validation status', () => {
    const after = globalReducer(initial, tablesReceivedAction([exampleTableMetadata]));

    expect(after.phase).toBe('results');
  });

  it('treats failing to get status after checking started as fatal error', () => {
    const after = globalReducer(initial, processingFailedAction('LOLWAT'));

    expect(after.phase).toBe('processing-failed');
  });

  it('transitions to issues phase when issues received', () => {
    const after = globalReducer(initial, issuesAction('my-comparison-id', []));

    expect(after.phase).toBe('issues');
  });

  it('transitions to results phase with error when table rendering fails', () => {
    const after = globalReducer(initial, tableRenderingFailedAction('Network error.'));

    expect(after.phase).toBe('results');
    expect(after.message).toBe('Network error.');
  });

  it('is ready for a new game after user dismisses results', () => {
    const before = globalReducer(initial, tablesReceivedAction([exampleTableMetadata]));

    const after = globalReducer(before, resultsDismissAction());

    expect(after.phase).toBe('form');
  });

  it('is ready for a new game after user dismisses error', () => {
    const before = globalReducer(initial, processingFailedAction('LOLWAT'));

    const after = globalReducer(before, resultsDismissAction());

    expect(after.phase).toBe('form');
    expect(after.message).toBeUndefined();
  });
});

describe('filingReducer', () => {

  const initial: FilingState = filingReducer(undefined, {type: '????'});
  const full: FilingState = {
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

  it('remembers issues when issues received', () => {
    const after = filingReducer(initial, issuesAction('my-comparison-id', [{ severity: 'OK' }]));

    expect(after.issues).toEqual([{ severity: 'OK' }]);
  });

  it('clears all filing state when dismissing results', () => {
    const after = filingReducer(full, resultsDismissAction());
    expect(after).toEqual({});
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

  it('maintains state when table rendering fails', () => {
    const after = filingReducer(full, tableRenderingFailedAction('Network error.'));

    expect(after).toEqual(full);
  });

});
