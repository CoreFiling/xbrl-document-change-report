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
import { Store } from 'redux';
import { Provider } from 'react-redux';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { apps, profiles } from '../../stories/util';
import { State } from '../state';
import AppContainer from './app-container';

const etc: State = {
  global: {
    user: {sub: 'uuid-of-user', email: 'b@example.com'},
    apps: apps('Pass/Fail Validator'),
    profiles: profiles('Profile'),
    phase: 'startup',
  },
  filing: {
  },
};
const funcs: Store<State> = {
  getState: () => etc,
  dispatch: action('dispatch') as any,
  subscribe: action('subscribe') as any,
  replaceReducer: action('replaceReducer') as any,
};

storiesOf('App layout', module)
  .add('Form', () => <Provider store={{
      ...funcs,
      getState: () => ({...etc,  phase: 'form'}),
    }}>
      <AppContainer/>
    </Provider>,
  );
