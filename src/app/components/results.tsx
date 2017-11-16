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

import * as React from 'react';

import { Option, TableMetadata } from '@cfl/table-rendering-service';
import { QueryableTablePage } from '@cfl/table-viewer';

import Table from './table';
import Button from './button';
import TableSelector from './table-selector';
import { ValidationStatus } from '../models';

import './results.less';
import StatusHeading from './status-heading';

export interface ResultsProps {
  error?: string;
  status?: ValidationStatus;
  tables?: TableMetadata[];
  metadata?: TableMetadata;
  zOptions?: Option[][];
  table?: QueryableTablePage;
  onChangePage?: (x: number, y: number, z: number) => void;
  onChangeTable?: (table: TableMetadata) => void;
  onResultsDismiss?: () => void;
}

export default class Results extends React.Component<ResultsProps> {
  render(): JSX.Element {
    const {
      error, status, tables, metadata, zOptions, table,
      onChangePage, onChangeTable, onResultsDismiss,
    } = this.props;
    return (
      <section className='app-Results-resultView'>
        <header className='app-Results-resultHeading'>
          {(error || !tables || tables.length === 0) && <StatusHeading status={status} error={error}/>}
          {!error && tables && tables.length > 1 && onChangeTable &&
            <TableSelector className='app-Results-tableSelector' tables={tables} onChangeTable={onChangeTable}/>
          }
          <Button primary className='app-Results-resultReset' onClick={onResultsDismiss}>Upload</Button>
        </header>
        {status
        && <Table status={status} metadata={metadata} zOptions={zOptions} table={table}
                  onChangePage={onChangePage} onChangeTable={onChangeTable}/>}
      </section>
    );
  }
}
