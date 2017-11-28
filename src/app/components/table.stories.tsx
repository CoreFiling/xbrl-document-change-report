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

import Table from './table';
import { exampleTableWithDiffStuff } from '../../stories/util';

storiesOf('Table', module)
  .addDecorator(story => <div style={{
    margin: 'auto',
    padding: '40px 0',
    color: 'rgba(0, 0, 0, 0.85)',
    background: 'repeating-linear-gradient(-45deg, #F7F7F7 0, #F7F7F7 10px, #FFF 10px, #FFF 20px)',
  }}>{story()}</div>)
  .add('Loading table', () => {
    const { metadata, zOptions } = exampleTableWithDiffStuff();
    return (
      <Table
        metadata={metadata}
        zOptions={zOptions}
        onChangePage={action('onChangePage')}
        onChangeTable={action('onChangeTable')}
      />
    );
  })
  .add('Faked up table with diffs', () => {
    const { metadata, zOptions, table } = exampleTableWithDiffStuff();
    return (
      <Table
        metadata={metadata}
        zOptions={zOptions}
        table={table}
        onChangePage={action('onChangePage')}
        onChangeTable={action('onChangeTable')}
      />
    );
  });
