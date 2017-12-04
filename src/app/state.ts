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
 * State of the app as a whole.
 */

import { User, App, Issue } from './models';
import { Option, TableMetadata } from '@cfl/table-rendering-service';
import { Profile } from '@cfl/table-diff-service';
import DiffifiedQueryableTablePage from './models/queryable-table-page-impl';

export type Phase = 'startup' | 'startup-failed' | 'form' |
  'uploading' | 'uploading-failed' | 'processing' | 'processing-failed' | 'issues' | 'results';

export interface State {
  global: GlobalState;
  filing: FilingState;
}

export interface GlobalState {
  user?: User;
  apps?: App[];
  profiles?: Profile[];
  phase: Phase;
  message?: string;  // May be defined if in failed phase.
}

export interface FilingState {
  issues?: Issue[]; // Issues from processing. Available in issues/results phases.
  tables?: TableMetadata[];
  selectedTable?: TableMetadata;
  zOptions?: Option[][];
  tableRendering?: DiffifiedQueryableTablePage;
}
