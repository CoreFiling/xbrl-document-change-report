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

import DiffifiedQueryableTablePage from '../models/queryable-table-page-impl';
import Table from './table';
import Button from './button';
import TableSelector from './table-selector';

import './results.less';

export interface ResultsProps {
  tables: TableMetadata[];
  metadata?: TableMetadata;
  zOptions?: Option[][];
  renderError?: string;
  table?: DiffifiedQueryableTablePage;
  onChangePage?: (x: number, y: number, z: number) => void;
  onChangeTable?: (table: TableMetadata) => void;
  onResultsDismiss?: () => void;
}

export default class Results extends React.Component<ResultsProps> {
  render(): JSX.Element {
    const {
      renderError, tables, metadata, zOptions, table,
      onChangePage, onChangeTable, onResultsDismiss,
    } = this.props;
    return (
      <section className='app-Results-resultView'>
        <header className='app-Results-resultHeading'>
          {tables.length > 0 &&
            <TableSelector className='app-Results-tableSelector' tables={tables} selectedTable={metadata} onChangeTable={onChangeTable}/>
          }
          {tables.length === 0 &&
            <div>No changes.</div>
          }
          <Button primary className='app-Results-resultReset' onClick={onResultsDismiss}>Upload</Button>
        </header>
        {renderError && <div className='app-Results-error'>{renderError}</div>}
        <Table metadata={metadata} zOptions={zOptions} table={table}
                  onChangePage={onChangePage} onChangeTable={onChangeTable}/>
      </section>
    );
  }
}
