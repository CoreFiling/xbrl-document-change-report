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
import { ReactNode } from 'react';
import TableViewer, { Pager, ZAxisNavigation } from '@cfl/table-viewer';
import { Option, TableMetadata, Cell } from '@cfl/table-rendering-service';

import DiffifiedQueryableTablePage from '../models/queryable-table-page-impl';

import './table.less';
import { DiffCell } from '@cfl/table-diff-service';

interface DiffifiedCellProps {
  cell: Cell;
  diffCell: DiffCell;
  selected: boolean;
  highlightedIssue: number | undefined;
  onClick?: () => void;
}

function DiffifiedCell({cell, diffCell}: DiffifiedCellProps): ReactNode {
  return <ul className={classNames('app-Cell', `app-Cell-${diffCell.diffStatus}`)}>
    {diffCell.facts.map(f => {
      const fromFact = f.from && cell.facts.find(x => x.id === f.from!.sourceId);
      const toFact = f.to && cell.facts.find(x => x.id === f.to!.sourceId);
      return <li className={classNames('app-Cell-fact', `app-Cell-fact${diffCell.diffStatus}`)}>
        {f.diffStatus === 'NOP' && <span className='app-Cell-fact-nop'>{toFact!.stringValue}</span>}
        {f.diffStatus !== 'NOP' && fromFact && <span className='app-Cell-fact-from'>{fromFact.stringValue}</span>}
        {f.diffStatus !== 'NOP' && toFact && <span className='app-Cell-fact-to'>{toFact.stringValue}</span>}
      </li>;
    })}
  </ul>;
}

export interface TableProps {
  metadata?: TableMetadata;  // The table we want to show, or undefined if not got any tables.
  zOptions?: Option[][];
  table?: DiffifiedQueryableTablePage;
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
            renderDataCell={({x, y, ...rest}) => DiffifiedCell({...rest, diffCell: table.getCellDiff(x, y)})}
            data={table}
            autoWidth
          />
        </div>
      </div>}
    </div>
  );
}
