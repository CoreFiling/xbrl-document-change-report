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

import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { TableMetadata } from '@cfl/table-rendering-service';

import Results from './results';
import { exampleTableWithDiffStuff } from '../../stories/util';

storiesOf('Results', module)
  .add('Full', () => {
    const { metadata } = exampleTableWithDiffStuff();
    return (
      <Results
        tables={[metadata, {name: 'another table', id: 'uuid-of-another-table'} as TableMetadata]}
        metadata={metadata}
        content={<div>Content...</div>}
        onChangeTable={action('onChangeTable')}
      />
    );
  });
