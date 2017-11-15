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

import { TableMetadata } from '@cfl/table-rendering-service';

interface TableSelectorProps {
  tables: TableMetadata[];
  className?: string;

  onChangeTable: (table: TableMetadata) => void;
}

export default function TableSelector({ tables, onChangeTable, className }: TableSelectorProps): JSX.Element {
  return (
    <select onChange={e => onChangeTable(tables[+e.currentTarget.value])}
        className={classNames('app-Table-tableSelect', className)}>
      {tables.sort((a, b) => a.name.localeCompare(b.name)).map((t, i) => <option key={t.id} value={i}>{t.name}</option>)}
    </select>
  );
}
