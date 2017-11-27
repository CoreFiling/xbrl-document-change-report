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

/**
 * Actions are used to pass info from the UI back to the state and sagas.
 */
import { Action } from 'redux';
import { Profile } from '@cfl/table-diff-service';
import { Option, TableMetadata } from '@cfl/table-rendering-service';

import { App, TableRenderingWindow, User, Issue, JobParams } from './models';
import DiffifiedQueryableTablePage from './models/queryable-table-page-impl';

// Actions for acquiring the list of profiles needed by the form.

export const STARTUP_INFO_RECEIVED = 'STARTUP_INFO_RECEIVED';
export const STARTUP_INFO_FAILED = 'STARTUP_INFO_FAILED';

export interface StartupInfoReceivedAction extends Action {
  user: User;
  apps: App[];
  profiles: Profile[];
}

export function startupInfoReceivedAction(user: User, apps: App[], profiles: Profile[]): StartupInfoReceivedAction {
  return {type: STARTUP_INFO_RECEIVED, user, apps, profiles};
}

export interface FailedAction extends Action {
  message?: string;
}

export function startupInfoFailedAction(message: string): FailedAction {
  return {type: STARTUP_INFO_FAILED, message};
}

// Actions for performing the checking operation itself.

export const PROCESSING_START = 'PROCESSING_START';  // Sent by UI to request checking.
export const UPLOAD_STARTED = 'UPLOAD_STARTED';  // from saga when upload begins
export const UPLOAD_FAILED = 'UPLOAD_FAILED';  // From saga if upload fails.
export const PROCESSING_STARTED = 'PROCESSING_STARTED';  // From saga when file is uploaded and processing begins
export const PROCESSING_FAILED = 'PROCESSING_FAILED';
export const ISSUES = 'ISSUES'; // Processing has occurred, there may be issues.

// We could have PROCESSING_COMPLETE
// but wse take TABLES_RECEIVED as indicating processing is complete.

export interface ProcessingAction extends Action {
  params: JobParams;
}

export function processingStartAction(params: JobParams): ProcessingAction {
  return {type: PROCESSING_START, params};
}

export function uploadStartedAction(params: JobParams): ProcessingAction {
  return {type: UPLOAD_STARTED, params};
}

export function uploadFailedAction(message?: string): FailedAction {
  return {type: UPLOAD_FAILED, message};
}

export function processingStartedAction(): Action {
  return {type: PROCESSING_STARTED};
}

export function processingFailedAction(message: string): FailedAction {
  return {type: PROCESSING_FAILED, message};
}

export interface IssuesAction extends Action {
  comparisonId: string;
  issues: Issue[];
}

export function issuesAction(comparisonId: string, issues: Issue[]): IssuesAction {
  return {type: ISSUES, comparisonId, issues};
}

// Action sent when user tires of the results.

export const RESULTS_DISMISS = 'RESULTS_DISMISS';

export function resultsDismissAction(): FailedAction {
  return {type: RESULTS_DISMISS};
}

// Action sent when metadata for all tables is received.

export const TABLES_RECEIVED = 'TABLES_RECEIVED';

export interface TablesReceivedAction extends Action {
  tables: TableMetadata[];
}

export function tablesReceivedAction(tables: TableMetadata[]): TablesReceivedAction {
  return {type: TABLES_RECEIVED, tables};
}

// Action sent when a table is selected.

export const TABLE_RENDERING_REQUESTED = 'TABLE_RENDERING_REQUESTED';

export interface TableRenderingRequestedAction extends Action {
  table: TableMetadata;
  window: TableRenderingWindow;
}

export function tableRenderingRequested(table: TableMetadata, window: TableRenderingWindow): TableRenderingRequestedAction {
  return {type: TABLE_RENDERING_REQUESTED, table, window};
}

// Action when a table fails to render.

export const TABLE_RENDERING_FAILED = 'TABLE_RENDERING_FAILED';

export function tableRenderingFailedAction(message: string): FailedAction {
  return {type: TABLE_RENDERING_FAILED, message};
}

// Action sent when table's rendering is received.

export const TABLE_RENDERING_RECEIVED = 'TABLE_RENDERING_RECEIVED';

export interface TableRenderingReceivedAction extends Action {
  zOptions: Option[][];
  tableRendering: DiffifiedQueryableTablePage;
}

export function tableRenderingReceivedAction(zOptions: Option[][], tableRendering: DiffifiedQueryableTablePage)
: TableRenderingReceivedAction {
  return {type: TABLE_RENDERING_RECEIVED, zOptions, tableRendering};
}

// Action for navigating the table.

export const TABLE_RENDER_PAGE = 'TABLE_RENDER_PAGE';

export interface TableRenderPageAction extends Action {
  table: TableMetadata;
  x: number;
  y: number;
  z: number;
}

export function tableRenderPageAction(table: TableMetadata, x: number, y: number, z: number): TableRenderPageAction {
  return {type: TABLE_RENDER_PAGE, table, x, y, z};
}
