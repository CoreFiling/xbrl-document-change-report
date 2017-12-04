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
import { SimpleSelect } from 'react-selectize';

import { TableMetadata } from '@cfl/table-rendering-service';

interface TableSelectorProps {
  tables: TableMetadata[];
  selectedTable?: TableMetadata;
  className?: string;

  onChangeTable?: (table: TableMetadata) => void; // nullable for testing.
}

export default function TableSelector({ tables, selectedTable, onChangeTable, className }: TableSelectorProps): JSX.Element {
  tables.sort((a, b) => a.name.localeCompare(b.name));
  const options = tables.map(table => ({label: table.name, value: table}));
  const selectedOption = selectedTable && options.find(x => x.value === selectedTable) || undefined;

  return (
    <SimpleSelect
      disabled={options.length <= 1}
      value={selectedOption}
      options={options}
      uid={option => option.value.id}
      className={classNames('app-Table-tableSelect', className)}
      hideResetButton
      onValueChange={option => option && onChangeTable && onChangeTable(option.value)}
    >
    </SimpleSelect>
  );
}
