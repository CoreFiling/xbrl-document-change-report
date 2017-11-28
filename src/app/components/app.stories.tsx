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
import { basicTableWithMetadata } from '@cfl/table-viewer/lib/test-utils';

import { profiles, exampleTableWithDiffStuff } from '../../stories/util';
import App from './app';

storiesOf('App', module)
  .add('Form', () => {
    return (
      <App
        profiles={profiles('Profile')}
        phase={'form'}
      />
    );
  })
  .add('Uploading', () => {
    return (
      <App
        profiles={profiles('Profile')}
        phase={'uploading'}
      />
    );
  })
  .add('Processing', () => {
    return (
      <App
        profiles={profiles('Profile')}
        phase={'processing'}
      />
    );
  })
  .add('Upload/other non-XBRL failure during processing', () => {
    return (
      <App
        profiles={profiles('Profile')}
        phase={'processing-failed'}
        error='Network error.'
      />
    );
  })
  .add('Non-fatal processing issues', () => {
    return (
      <App
        profiles={profiles('Profile')}
        phase={'issues'}
        issues={[{severity: 'ERROR'}]}
      />
    );
  })
  .add('Fatal processing issues', () => {
    return (
      <App
        profiles={profiles('Profile')}
        phase={'issues'}
        issues={[{severity: 'FATAL_ERROR'}]}
      />
    );
  })
  .add('Result', () => {
    const { table, metadata, zOptions } = exampleTableWithDiffStuff();
    return (
      <App
        profiles={profiles('Profile')}
        phase={'results'}
        tables={[metadata, {name: 'another table', id: 'uuid-of-another-table'} as TableMetadata]}
        metadata={metadata}
        zOptions={zOptions}
        table={table}
        onChangePage={action('onChangePage') as any}
        onChangeTable={action('onChangeTable') as any}
      />
    );
  })
  .add('Result no tables', () => {
    return (
      <App
        profiles={profiles('Profile')}
        phase={'results'}
        tables={[]}
        onChangePage={action('onChangePage') as any}
        onChangeTable={action('onChangeTable') as any}
      />
    );
  })
  .add('Error showing table', () => {
    const { metadata } = exampleTableWithDiffStuff();
    return (
      <App
        profiles={profiles('Profile')}
        phase={'results'}
        tables={[metadata, {name: 'another table', id: 'uuid-of-another-table'} as TableMetadata]}
        metadata={metadata}
        error='Network error.'
        onChangePage={action('onChangePage') as any}
        onChangeTable={action('onChangeTable') as any}
      />
    );
  })
  .add('Change page', () => {
    const { metadata, zOptions } = basicTableWithMetadata();
    return (
      <App
        profiles={profiles('Profile')}
        phase={'results'}
        tables={[metadata]}
        metadata={metadata}
        zOptions={zOptions}
        onChangePage={action('onChangePage') as any}
        onChangeTable={action('onChangeTable') as any}
      />
    );
  });
