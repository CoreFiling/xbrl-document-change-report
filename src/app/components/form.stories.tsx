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

import { Form, FormItem, FormActionList, FormAction } from './form';

storiesOf('Form items', module)
  .addDecorator(story => <Form onSubmit={action('onSubmit')} style={{width: '400px'}}>{story()}</Form>)
  .add('Enabled button', () => <FormActionList><FormAction primary enabled>Fold</FormAction></FormActionList>)
  .add('Disabled button', () => <FormActionList><FormAction primary>Spindle</FormAction></FormActionList>)
  .add('Other button', () => <FormActionList><FormAction enabled>Mutilate</FormAction><FormAction>Escape</FormAction></FormActionList>)
  .add('Select', () => <FormItem>
      <label>Flavour</label>
      <select><option>Strawberry</option><option>Sump</option></select>
    </FormItem>);
