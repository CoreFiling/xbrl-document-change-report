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

import { TableMetadata } from '@cfl/table-rendering-service';

import Button from './button';
import TableSelector from './table-selector';

import './results.less';

export interface ResultsProps {
  tables?: TableMetadata[];
  content: JSX.Element;
  metadata?: TableMetadata;
  onChangeTable?: (table: TableMetadata) => void;
  onResultsDismiss?: () => void;
}

export default class Results extends React.Component<ResultsProps> {
  render(): JSX.Element {
    const {
      tables, content, metadata, onChangeTable, onResultsDismiss,
    } = this.props;
    return (
      <section className='app-Results-resultView'>
        <header className='app-Results-resultHeading'>
          <TableSelector
            className='app-Results-tableSelector' tables={tables || []} selectedTable={metadata} onChangeTable={onChangeTable}/>
          <Button primary className='app-Results-resultReset' onClick={onResultsDismiss}>Upload</Button>
        </header>
        {content}
      </section>
    );
  }
}
