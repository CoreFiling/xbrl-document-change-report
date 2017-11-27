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

import * as classNames from 'classnames';
import * as React from 'react';
import { Profile } from '@cfl/table-diff-service';
import { Option, TableMetadata } from '@cfl/table-rendering-service';

import { JobParams, Issue } from '../models';
import DiffifiedQueryableTablePage from '../models/queryable-table-page-impl';
import { Phase } from '../state';
import ContactDetails from './contact-details';
import Results from './results';
import ChangeForm from './change-form';

import './app.less';

export interface AppProps {
  phase?: Phase;
  profiles?: Profile[];
  error?: string;
  onSubmit?: (params: JobParams) => void;
  onResultsDismiss?: () => void;
  issues?: Issue[];
  tables?: TableMetadata[];
  metadata?: TableMetadata;
  zOptions?: Option[][];
  table?: DiffifiedQueryableTablePage;
  onChangePage?: (x: number, y: number, z: number) => void;
  onChangeTable?: (table: TableMetadata) => void;
}

export default function App(props: AppProps): JSX.Element {
  const { phase, profiles, error, tables, issues, metadata, zOptions, table,
    onSubmit, onResultsDismiss, onChangePage, onChangeTable } = props;

  let innards: JSX.Element | undefined = undefined;
  switch (phase) {
    case 'startup':
    case 'startup-failed':
    case 'uploading-failed':
    case 'form':
      innards = <div className='app-App-formHolder'>
        <ChangeForm profiles={profiles} error={error} onSubmit={phase === 'form' ? onSubmit : undefined}/>
        <ContactDetails className='app-App-formContact'/>
      </div>;
      break;
    case 'uploading':
    case 'processing':
    case 'issues':
      innards = <div className='app-App-loadingOverlay'>
        {issues && issues.some(i => i.severity === 'FATAL_ERROR')
          ? <div>Your uploads were invalid.</div>
          : <div className='app-App-loading'>Processing&thinsp;…</div>}
      </div>;
      break;
    case 'processing-failed':
      innards = <div className='app-App-resultHolder'>
        <div className='app-App-loading'>{error}</div>
      </div>;
      break;
    case 'results':
      innards = <div className='app-App-resultHolder'>
        <Results
          tables={tables!}
          metadata={metadata}
          zOptions={zOptions}
          renderError={error}
          table={table}
          onChangePage={onChangePage}
          onChangeTable={onChangeTable}
          onResultsDismiss={onResultsDismiss}
        />
        <ContactDetails className='app-App-resultContact'/>
      </div>;
      break;
    default:
      innards = <b>Forgot the case {phase}!?</b>;
      break;
  }

  return <div className={classNames('app-App', `app-App-${phase}`)}>
    {innards}
  </div>;
}
