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
import TableViewer, { Pager, ZAxisNavigation } from '@cfl/table-viewer';
import { QueryableTablePage } from '@cfl/table-viewer';
import { Option, TableMetadata } from '@cfl/table-rendering-service';

import './table.less';

export interface TableProps {
  metadata?: TableMetadata;  // The table we want to show, or undefined if not got any tables.
  zOptions?: Option[][];
  table?: QueryableTablePage;
  onChangePage?: (x: number, y: number, z: number) => void;
  onChangeTable?: (table: TableMetadata) => void;
}
export default function Table(props: TableProps): JSX.Element {
  const { metadata, zOptions, table, onChangePage } = props;
  const withZOptions = zOptions && zOptions.length > 1;
  const tableOffsets = {
    'app-Table-withZOptions': withZOptions,
    'app-Table-withPager': table && table.hasMultiplePages,
  };
  return (
    <div className={'app-Table'}>
      {withZOptions && zOptions && table && metadata && <div className='app-Table-nav'>
        <ZAxisNavigation
          breakdowns={metadata.z.breakdowns}
          options={zOptions}
          selected={table.zHeaders}
          onSelect={z => onChangePage && onChangePage(table.x, table.y, z)}
        />
      </div>}
      {table && table.hasMultiplePages && <div className='app-Table-pager'>
        <Pager
          pages={table.pageCoordinates}
          x={table.x}
          y={table.y}
          onSelect={(x, y) => onChangePage && onChangePage(x, y, table.z)}
        />
      </div>}
      {!table && metadata && <div className={classNames('app-Table-loading', tableOffsets)} />}
      {!table && !metadata && <div className={'app-Table-noTable'} />}
      {table && <div className={classNames('app-Table-table', tableOffsets)}>
        <div className={classNames('app-Table-table-inner', tableOffsets)}>
          <TableViewer
            data={table}
            autoWidth
          />
        </div>
      </div>}
    </div>
  );
}
