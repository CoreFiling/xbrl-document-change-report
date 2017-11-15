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
import { lShapedTableWithMetadata } from '@cfl/table-viewer/lib/test-utils/l-shaped-headers';

import QueryableTablePageImpl from '../models/queryable-table-page-impl';
import Table from './table';

storiesOf('Table', module)
  .add('Simple pass', () => {
    const { table, metadata, zOptions} = lShapedTableWithMetadata();

    return (
      <Table
        status={'OK'}
        metadata={metadata}
        zOptions={zOptions}
        table={table}
        onChangePage={action('onChangePage')}
        onChangeTable={action('onChangeTable')}
      />
    );
  })
  .add('Simple fail', () => {
    const { table, metadata, zOptions} = lShapedTableWithMetadata();

    return (
      <Table
        status={'ERROR'}
        metadata={metadata}
        zOptions={zOptions}
        table={table}
        onChangePage={action('onChangePage')}
        onChangeTable={action('onChangeTable')}
      />
    );
  })
  .add('Many Z options', () => {
    const { tables, zOptions, tableChunk } = require('../../stories/table-a.json');
    const table = new QueryableTablePageImpl(tables[0], tableChunk);
    return (
      <Table
        status={'OK'}
        metadata={tables[0]}
        zOptions={zOptions}
        table={table}
        onChangePage={action('onChangePage')}
        onChangeTable={action('onChangeTable')}
      />
    );
  });
