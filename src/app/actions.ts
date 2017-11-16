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

import { App, Profile, TableRenderingWindow, User, ValidationParams } from './models';
import { Option, TableMetadata } from '@cfl/table-rendering-service';
import { QueryableTablePage } from '@cfl/table-viewer';

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

export const CHECKING_START = 'CHECKING_START';  // Sent by UI to request checking.
export const UPLOAD_STARTED = 'UPLOAD_STARTED';  // from saga when upload begins
export const CHECKING_STARTED = 'UPLOAD_COMPLETE';  // From saga when file is uploaded and checking begins
export const UPLOAD_FAILED = 'UPLOAD_FAILED';  // From saga if uplaod fails.
export const CHECKING_RECEIVED = 'CHECKING_RECEIVED';  // From saga when results ready at long last.
export const FAILED = 'FAILED';

export interface CheckingAction extends Action {
  params: ValidationParams;
}

export function checkingStartAction(params: ValidationParams): CheckingAction {
  return {type: CHECKING_START, params};
}

export function uploadStartedAction(params: ValidationParams): CheckingAction {
  return {type: UPLOAD_STARTED, params};
}

export function checkingStartedAction(): Action {
  return {type: CHECKING_STARTED};
}

export function uploadFailedAction(message?: string): FailedAction {
  return {type: UPLOAD_FAILED, message};
}

export function failedAction(message: string): FailedAction {
  return {type: FAILED, message};
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

// Action sent when table's rendering is received.

export const TABLE_RENDERING_RECEIVED = 'TABLE_RENDERING_RECEIVED';

export interface TableRenderingReceivedAction extends Action {
  zOptions: Option[][];
  tableRendering: QueryableTablePage;
}

export function tableRenderingReceivedAction(zOptions: Option[][], tableRendering: QueryableTablePage): TableRenderingReceivedAction {
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
