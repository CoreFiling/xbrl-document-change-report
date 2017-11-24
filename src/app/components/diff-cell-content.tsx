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
import { DiffCell } from '@cfl/table-diff-service';
import { Cell } from '@cfl/table-rendering-service';

import DiffifiedQueryableTablePage from '../models/queryable-table-page-impl';

import './table.less';

import './diff-cell-content.less';

interface DiffCellContentProps {
  cell?: Cell;
  diffCell?: DiffCell;
}

export default function DiffCellContent({cell, diffCell}: DiffCellContentProps): JSX.Element {
  if (!diffCell || !cell) {
    return <span></span>;
  }
  return <ul className={classNames('app-DiffCellContent', `app-DiffCellContent-${diffCell.diffStatus}`)}>
    {diffCell.facts.map((f, i) => {
      const fromFact = f.from && cell.facts.find(x => x.id === f.from!.id);
      const toFact = f.to && cell.facts.find(x => x.id === f.to!.id);
      let summarification: string | undefined;
      switch (f.diffStatus) {
        case 'NOP':
          break;
        case 'ADD':
          summarification = `Added ${toFact ? toFact.stringValue : ''}`;
          break;
        case 'DEL':
          summarification = `Deleted ${fromFact ? fromFact.stringValue : ''}`;
          break;
        default:
          summarification = 'Changed' + (fromFact ? ` ${fromFact.stringValue}` : '') + (toFact ? ` to ${toFact.stringValue}` : '');
      }
      return <li key={i}
        className={classNames('app-DiffCellContent-fact', `app-DiffCellContent-fact${f.diffStatus}`)}
        title={summarification}
      >
        {(fromFact || toFact)
        ? <span className='app-DiffCellContent-value'>{toFact ? toFact.stringValue : fromFact!.stringValue}</span>
        : <span className='app-DiffCellContent-noValue'>Recorded</span>}
      </li>;
    })}
  </ul>;
}

// These numbers correspond to constants in the style sheet.
const FACT_HT = 20;
const CELL_PAD = 5;
const SEPARATOR_HT = CELL_PAD + 1 + CELL_PAD;

export const calculateRowHeight = (table1: DiffifiedQueryableTablePage, y: number) => {
  // We don't render all the facts in the cell, only those from one of the two documents being diffed,
  // so we have to provide a custom cell height.
  const factCount = Math.max(...table1.getDiffRow(y).map(d => d.facts.length));
  return CELL_PAD + factCount * FACT_HT + (factCount - 1) * SEPARATOR_HT + CELL_PAD;
};
