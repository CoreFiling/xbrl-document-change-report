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

import { apps } from '../../stories/util';
import AppBar from './app-bar';

const sub = 'uuid-of-user';

storiesOf('AppBar', module)
  .addDecorator(story => <div style={{height: '400px', backgroundColor: '#DDD'}}>{story()}</div>)
  .add('Loading', () => <AppBar path='/xbrl-document-change-report/'/>)
  .add('User with email only', () => <AppBar path='/xbrl-document-change-report/'
    apps={apps('XBRL Document Change Report')}
    user={{sub, email: 'b@example.com'}}/>)
  .add('User with name', () => <AppBar path='/xbrl-document-change-report/'
    apps={apps('XBRL Document Change Report')}
    user={{sub, name: 'Tamandani Pleško', email: 'tp@example.com'}}/>)
  .add('Multiple apps', () => <AppBar path='/xbrl-document-change-report/'
    apps={apps('XBRL Document Change Report', 'Beacon', 'Full Beam', 'Manage Account')}
    user={{sub, email: 'tp@example.com'}}/>);
