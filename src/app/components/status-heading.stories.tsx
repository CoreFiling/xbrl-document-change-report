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

import StatusHeading from './status-heading';

storiesOf('ChangeResult', module)
  .addDecorator(story => <div className='app-Results' style={{backgroundColor: '#FFF', boxShadow: 'rgba(0, 17, 51, 0.25) 5px 10px 50px'}}>
    <div className='app-Results-resultHeading'>
      {story()}
    </div>
  </div>)
  .add('OK', () => <StatusHeading status='OK'/>)
  .add('WARNING', () => <StatusHeading status='WARNING'/>)
  .add('ERROR', () => <StatusHeading status='ERROR'/>)
  .add('FATAL_ERROR', () => <StatusHeading status='FATAL_ERROR'/>);
