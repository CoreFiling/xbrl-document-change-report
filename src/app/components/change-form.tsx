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
import { Component, Props } from 'react';
import { Profile } from '@cfl/table-diff-service';

import { JobParams, paramsAreComplete } from '../models';
import { Form, FormItem, FormActionList, FormAction } from './form';
import FileInput from './file-input';

import './change-form.less';

export interface ChangeFormProps extends Props<ChangeForm> {
  profiles?: Profile[];
  error?: string;

  onSubmit?: (params: JobParams) => void;
}

interface ChangeFormState {
  params: Partial<JobParams>;
}

export default class ChangeForm extends Component<ChangeFormProps, ChangeFormState> {
  constructor(props: ChangeFormProps) {
    super(props);

    const { profiles } = props;

    this.state = {
      params: {
        profile: profiles && profiles.length > 0 ? profiles[0].id : undefined,
      },
    };
  }

  componentWillReceiveProps(nextProps: ChangeFormProps): void {
    if (nextProps.profiles && nextProps.profiles.length && !this.state.params.profile) {
      this.setState({params: {...this.state.params, profile: nextProps.profiles[0].id}});
    }
  }

  render(): JSX.Element {
    const { profiles, error, onSubmit } = this.props;
    const { params } = this.state;

    if (!profiles) {
      return <div  className='app-ChangeForm-loading'>
          <span>{error || 'Loading\u2009…'}</span>
        </div>;
    }

    return <Form className='app-ChangeForm' onSubmit={() => this.onSubmit()}>
      <FormItem>
        {
          error
          ? <div className='app-ChangeForm-dropzone app-ChangeForm-errorDropzone'>
              <span  className='app-ChangeForm-error'>{error}</span>
            </div>
          : <div className='app-ChangeForm-twoFiles'>
            <FileInput label='Drop old file here' file={params.file1} onChange={file => this.onChange({file1: file})}/>
            <FileInput label='Drop new file here' file={params.file2} onChange={file => this.onChange({file2: file})}/>
          </div>
        }
      </FormItem>
      <FormItem>
        <select
          id='profile-pickr'
          disabled={!onSubmit}
          required
          defaultValue=''
          onChange={e => this.onChange({profile: e.currentTarget.value})}>
          <option key='' value='' disabled hidden>Select Validation Profile</option>
          {profiles.map(({id, name}) => <option key={id} value={id}>{name}</option>)}
        </select>
      </FormItem>
      <FormActionList>
        <FormAction enabled={onSubmit && paramsAreComplete(params)} primary>Compare</FormAction>
      </FormActionList>
    </Form>;
  }

  onChange(delta: Partial<JobParams>): void {
    this.setState({params: {...this.state.params, ...delta}});
  }

  onSubmit(): void {
    const { onSubmit } = this.props;
    const { params } = this.state;
    if (onSubmit && paramsAreComplete(params)) {
      onSubmit(params);
      this.setState({params: {...params, file1: undefined, file2: undefined}});
    }
  }
}
