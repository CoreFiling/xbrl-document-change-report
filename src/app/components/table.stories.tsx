/*
 *  Copyright 2017 CoreFiling S.A.R.L.
 *
 *  Licensed under the Apache License, Version 2.0 (the 'License');
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an 'AS IS' BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { TableChunk, Fact } from '@cfl/table-rendering-service';
import { DiffTableChunk, DiffFact, DiffCell, FactMappingSourceEnum } from '@cfl/table-diff-service';

import QueryableTablePageImpl from '../models/queryable-table-page-impl';
import Table from './table';

type DiffStatus = 'NOP' | 'ADD' | 'DEL' | 'CHG';
const DIFF_STATUSES: DiffStatus[] = ['NOP', 'ADD', 'DEL', 'CHG'];

function getDiffStatus(x: number, y: number, z: number): DiffStatus {
  return DIFF_STATUSES[(x + y + z) % 4];
}

/**
 * Given a normal table chunk, return one representing a comparison table.
 */
function mungeTableChunk(chunk: TableChunk): TableChunk {
  const { z, data } = chunk;
  let nextId = Math.max(...data.map(col => Math.max(...col.map(cell => cell ? Math.max(...cell.facts.map(fact => fact.id)) : -1))));
  function getId(): number {
    return ++nextId;
  }
  return {
    ...chunk,
    data: data.map((col, x) => col.map((cell, y) => {
      const diffStatus = getDiffStatus(x, y, z);
      let facts: Fact[];
      const issues: number[] = cell ? cell.issues : [];
      if (diffStatus === 'NOP') {
        return cell;
      } else if (!cell) {
        facts = [{stringValue: '42', id: getId()}];
      } else {
        facts = cell.facts;
      }
      if (diffStatus === 'CHG') {
        const newFacts = [...facts, ...facts.map(() => ({stringValue: '69', id: getId()}))];
        return { issues, facts: newFacts };
      }
      return { issues, facts };
    })),
  };
}

function makeDiffChunk(chunk: TableChunk): DiffTableChunk {
  const { x, y, z, data } = chunk;
  let nextId = 1000;
  function getId(): number {
    return ++nextId;
  }
  return {
    x, y, z,
    data: data.map((col, dx) => col.map((cell, dy) => {
      const diffStatus = getDiffStatus(dx, dy, z);
      let facts: DiffFact[];
      switch (diffStatus) {
        case 'NOP':
          if (cell) {
            facts = cell.facts.map(f => ({
              diffStatus,
              from: {id: getId(), sourceId: f.id, source: 'FROM' as FactMappingSourceEnum},
              to: {id: getId(), sourceId: f.id, source: 'TO' as FactMappingSourceEnum},
            }));
          } else {
            facts = [];
          }
          break;
        case 'ADD':
          facts = cell.facts.map(f => ({
            diffStatus,
            to: {id: getId(), sourceId: f.id, source: 'TO' as FactMappingSourceEnum},
          }));
          break;
        case 'ADD':
          facts = cell.facts.map(f => ({
            diffStatus,
            from: {id: getId(), sourceId: f.id, source: 'FROM' as FactMappingSourceEnum},
          }));
          break;
        case 'CHG':
          {
            const fs = cell.facts;
            const diffFactCount = fs.length / 2;
            facts = cell.facts.slice(0, diffFactCount).map((f1, j) => {
              const f2 = fs[diffFactCount + j];
              return {
                diffStatus,
                from: {id: getId(), sourceId: f1.id, source: 'FROM' as FactMappingSourceEnum},
                to: {id: getId(), sourceId: f2.id, source: 'TO' as FactMappingSourceEnum},
              };
            });
          }
          break;
        default:
          // Should not happen.
          facts = [];
          break;
      }
      const diffCell: DiffCell = { diffStatus, facts };
      return diffCell;
    })),
  };
}

storiesOf('Table', module)
  .add('Semi-real diff table', () => {
    const { tables, zOptions, tableChunk } = require('../../stories/table-a.json');
    const mungedTableChunk = mungeTableChunk(tableChunk);
    const diffChunk = makeDiffChunk(mungedTableChunk);
    const table = new QueryableTablePageImpl(tables[0], mungedTableChunk, diffChunk);
    return (
      <Table
        metadata={tables[0]}
        zOptions={zOptions}
        table={table}
        onChangePage={action('onChangePage')}
        onChangeTable={action('onChangeTable')}
      />
    );
  });
