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

import { createHeaderSlice, HeaderSlice, QueryableTablePage } from '@cfl/table-viewer';
import { Cell, Header, TableChunk, TableHeader, TableMetadata } from '@cfl/table-rendering-service';

export const TABLE_WINDOW_HEIGHT = 64;

export default class QueryableTablePageImpl implements QueryableTablePage {
  constructor(
    private readonly metadata: TableMetadata,
    private readonly chunk: TableChunk,
  ) {
    chunk.data = chunk.data.map(colData =>
      colData.map(cell => cell || {
        issues: [],
        facts: [],
      }),
    );
  }

  get key(): string {
    const { metadata, x, y, z } = this;
    return `${metadata.id}(${x},${y},${z})`;
  }

  get x(): number {
    return this.chunk.x;
  }

  get y(): number {
    return this.chunk.y;
  }

  get z(): number {
    return this.chunk.z;
  }

  get zHeaders(): Header[] {
    return this.chunk.zAxis;
  }

  get height(): number {
    return this.chunk.data[0].length;
  }

  get width(): number {
    return this.chunk.data.length;
  }

  get xDepth(): number {
    return this.metadata.x.breakdowns.length;
  }

  get yDepth(): number {
    return this.metadata.y.breakdowns.length;
  }

  getXHeaders(col: number): HeaderSlice[] {
    return createHeaderSlice(this.metadata.x.breakdowns, this.chunk.xAxis[col - this.x]);
  }

  getYHeaders(row: number): HeaderSlice[] {
    return createHeaderSlice(this.metadata.y.breakdowns, this.chunk.yAxis[row - this.y]);
  }

  getRow(y: number): Cell[] {
    const row = y - this.y;
    return this.chunk.data.map(col => col[row]);
  }

  getCell(col: number, row: number): Cell {
    return this.chunk.data[col - this.x][row - this.y];
  }

  get pageCoordinates(): [number[], number[]] {
    return [[0], this.getAxisPageCoordinates(this.metadata.y, TABLE_WINDOW_HEIGHT)];
  }

  get hasMultiplePages(): boolean {
    return this.y > 0 || this.metadata.y.sliceCount > TABLE_WINDOW_HEIGHT;
  }

  getPageCoordinates(x: number, y: number): [number, number] {
    // tslint:disable-next-line:no-unused-expression
    x;
    return [0, Math.floor(y / TABLE_WINDOW_HEIGHT) * TABLE_WINDOW_HEIGHT];
  }

  has(x: number, y: number): boolean {
    // tslint:disable-next-line:no-unused-expression
    x;
    return y >= this.y && y < (this.y + this.height);
  }

  private getAxisPageCoordinates(axis: TableHeader, pageSize: number): number[] {
    const coordinates = [];
    for (let i = 0; i < axis.sliceCount; i += pageSize) {
      coordinates.push(i);
    }
    return coordinates;
  }
}
