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
  * Create fake instances of models, for use in stories.
  */

import { Profile, DiffCell, FactMappingSourceEnum, DiffFact, DiffTableChunk } from '@cfl/table-diff-service';
import { TableChunk, Fact, TableMetadata, Option, Cell } from '@cfl/table-rendering-service';

import { App } from '../app/models';
import DiffifiedQueryableTablePage from '../app/models/queryable-table-page-impl';

function idFromLabel(label: string): string {
  let hash = 0;
  for (let i = 0; i < label.length; i++) {
    const chr = label.charCodeAt(i);
    hash  = (((hash << 5) - hash) + chr) & 0x7FFFFFFF; // tslint:disable-line:no-bitwise
  }
  return `id_${hash.toString(16)}`;
}

export function profile(label: string): Profile {
  return {
    id: idFromLabel(label),
    name: label,
  };
}

export function profiles(...labels: string[]): Profile[] {
  return labels.map(x => profile(x));
}

export const app = (name: string): App => {
  const id = name.toLowerCase().replace(/[^a-z]+/g, '-');
  return {
    id,
    name,
    href: `/${id}/`,
  };
};

export const apps = (...names: string[]): App[] => names.map(name => app(name));

//
// Functions for haclking together a fake diff-table result.
//

type DiffStatus = 'NOP' | 'ADD' | 'DEL' | 'CHG';
const DIFF_STATUSES: DiffStatus[] = ['NOP', 'ADD', 'DEL', 'CHG'];

function getDiffStatus(x: number, y: number, z: number): DiffStatus {
  return DIFF_STATUSES[(x + y + z) % 4];
}

/**
 * Given a normal table chunk, return one representing a comparison table.
 */
export function mungeTableChunk(chunk: TableChunk): TableChunk {
  const { z, data } = chunk;
  let nextId = Math.max(...data.map(col => Math.max(...col.map(cell => cell ? Math.max(...cell.facts.map(fact => fact.id)) : -1))));
  function getId(): number {
    return ++nextId;
  }
  return {
    ...chunk,
    data: data.map((col, x) => col.map((cell, y) => mungeCell(cell, getDiffStatus(x, y, z), getId))),
  };
}

export function mungeCell(cell: Cell, diffStatus: DiffStatus, getId: () => number): Cell {
  let facts: Fact[];
  const issues: number[] = cell ? cell.issues : [];
  if (diffStatus === 'NOP') {
    return cell;
  } else if (!cell || cell.facts.length === 0) {
    facts = [{stringValue: 'VALUE', id: getId()}];
  } else {
    facts = cell.facts;
  }
  if (diffStatus === 'CHG') {
    const newFacts = [...facts, ...facts.map(() => ({stringValue: 'NEW VALUE', id: getId()}))];
    return { issues, facts: newFacts };
  }
  return { issues, facts };
}

export function makeDiffChunk(chunk: TableChunk): DiffTableChunk {
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
              from: {sourceId: getId(), id: f.id, source: 'FROM' as FactMappingSourceEnum},
              to: {sourceId: getId(), id: f.id, source: 'TO' as FactMappingSourceEnum},
            }));
          } else {
            facts = [];
          }
          break;
        case 'ADD':
          facts = cell.facts.map(f => ({
            diffStatus,
            to: {sourceId: getId(), id: f.id, source: 'TO' as FactMappingSourceEnum},
          }));
          break;
        case 'DEL':
          facts = cell.facts.map(f => ({
            diffStatus,
            from: {sourceId: getId(), id: f.id, source: 'FROM' as FactMappingSourceEnum},
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
                from: {sourceId: getId(), id: f1.id, source: 'FROM' as FactMappingSourceEnum},
                to: {sourceId: getId(), id: f2.id, source: 'TO' as FactMappingSourceEnum},
              };
            });
            console.log('GCGK', diffFactCount, cell.facts, facts);
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

export function exampleTableWithDiffStuff(): { metadata: TableMetadata, zOptions: Option[][], table: DiffifiedQueryableTablePage } {
  const { tables, zOptions, tableChunk } = require('./table-a.json');
  const mungedTableChunk = mungeTableChunk(tableChunk);
  const diffChunk = makeDiffChunk(mungedTableChunk);
  const table = new DiffifiedQueryableTablePage(tables[0], mungedTableChunk, diffChunk);
  return { metadata: tables[0], zOptions, table };
}
