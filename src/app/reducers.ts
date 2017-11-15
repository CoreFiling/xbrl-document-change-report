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
 * Reducers (in the Redux sense).
 */
import { Action, combineReducers } from 'redux';

import {
  STARTUP_INFO_RECEIVED, StartupInfoReceivedAction, STARTUP_INFO_FAILED, FailedAction,
  UPLOAD_STARTED, UPLOAD_FAILED,
  CHECKING_STARTED, FAILED,
  CHECKING_RECEIVED, CheckingReceivedAction,
  RESULTS_DISMISS,
  TABLES_RECEIVED, TableRenderingRequestedAction,
  TABLE_RENDERING_RECEIVED, TableRenderingReceivedAction, TablesReceivedAction, TABLE_RENDERING_REQUESTED,
} from './actions';
import { GlobalState, FilingState } from './state';

export function globalReducer(state: GlobalState | undefined, action: Action): GlobalState {
  if (!state) {
    return {phase: 'startup'};
  }

  switch (action.type) {
    case STARTUP_INFO_FAILED: {
      const { message } = action as FailedAction;
      return { ...state, phase: 'startup-failed', message };
    }
    case STARTUP_INFO_RECEIVED: {
      const { user, apps, profiles } = action as StartupInfoReceivedAction;
      return { ...state, phase: 'form', user, apps, profiles };
    }
    case UPLOAD_STARTED:
      return { ...state, phase: 'uploading'};
    case UPLOAD_FAILED: {
      const { message } = action as FailedAction;
      return { ...state, phase: 'uploading-failed', message };
    }
    case CHECKING_STARTED:
      return { ...state, phase: 'checking' };
    case FAILED: {
      const { message } = action as FailedAction;
      return { ...state, phase: 'failed', message };
    }
    case CHECKING_RECEIVED: {
      return { ...state, phase: 'results'};
    }
    case RESULTS_DISMISS:
      return { ...state, phase: 'form', message: undefined };
    default:
      return state;
  }
}

export function filingReducer(state: FilingState | undefined, action: Action): FilingState {
  if (!state) {
    return {};
  }

  switch (action.type) {
    case UPLOAD_STARTED:
    case UPLOAD_FAILED:
    case CHECKING_STARTED:
    case RESULTS_DISMISS:
    return {};
    case FAILED:
      return { status: 'FATAL_ERROR' };
    case CHECKING_RECEIVED: {
      const { filingVersionId, status } = action as CheckingReceivedAction;
      return { ...state, filingVersionId, status };
    }
    case TABLES_RECEIVED: {
      const { tables } = action as TablesReceivedAction;
      return { ...state, tables, selectedTable: tables.length > 0 ? tables[0] : undefined, zOptions: [] };
    }
    case TABLE_RENDERING_REQUESTED: {
      const { table } = action as TableRenderingRequestedAction;
      return { ...state, selectedTable: table, zOptions: [], tableRendering: undefined };
    }
    case TABLE_RENDERING_RECEIVED: {
      const { zOptions, tableRendering } = action as TableRenderingReceivedAction;
      return { ...state, zOptions, tableRendering };
    }
    default:
      return state;
  }
}

const reducers = combineReducers({global: globalReducer, filing: filingReducer});

export default reducers;
