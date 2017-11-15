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
import Dropzone = require('react-dropzone');
import { Component, Props } from 'react';

import { Profile, ValidationParams, paramsAreComplete } from '../models';
import FileReference from './file-reference';
import { Form, FormItem, FormActionList, FormAction } from './form';

import './change-form.less';

export interface ChangeFormProps extends Props<ChangeForm> {
  profiles?: Profile[];
  error?: string;

  onSubmit?: (params: ValidationParams) => void;
}

interface ChangeFormState {
  params: Partial<ValidationParams>;
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

    this.onDropzoneDrop = this.onDropzoneDrop.bind(this);
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
          : <Dropzone
              className='app-ChangeForm-dropzone'
              activeClassName='app-ChangeForm-dropzoneActive'
              multiple={true}
              accept='.xml,.xbrl,.html,.htm,.zip'
              maxSize={5 * 1024 * 1024}
              aria-label='File to validate'
              onDrop={this.onDropzoneDrop}
            >
              <div>
                {params.files && params.files.length > 0
                ? params.files.map((file, i) => <FileReference key={i} className='app-ChangeForm-file'
                    file={file}
                    onRemove={() => this.onFileReferenceRemove(i)}
                  />)
                : <div>
                    <h2 className='app-ChangeForm-heading'>Drop two files here</h2>
                    <div className='app-ChangeForm-prompt'>
                      or <span className='app-ChangeForm-btn'>click to select files</span>
                    </div>
                    <div className='app-ChangeForm-hint'>XBRL, Inline XBRL, or ZIP. 5&thinsp;MB max.</div>
                  </div>}
                </div>
            </Dropzone>
        }
      </FormItem>
      <FormItem>
        <label htmlFor='profile-pickr'>Validation profile</label>
        <select id='profile-pickr' disabled={!onSubmit} onChange={e => this.onChange({profile: e.currentTarget.value})}>
          {profiles.map(({id, name}) => <option key={id} value={id}>{name}</option>)}
        </select>
      </FormItem>
      <FormActionList>
        <FormAction enabled={onSubmit && paramsAreComplete(params)} primary>Change report</FormAction>
      </FormActionList>
    </Form>;
  }

  onFileReferenceRemove(index: number): void {
    const { params: {files}} = this.state;
    const newFiles = files ? files.slice(0, index).concat(files.slice(index + 1)) : [];
    this.onChange({files: newFiles});
  }

  onDropzoneDrop(files: File[]): void {
    const newFiles = this.state.params.files ? this.state.params.files.concat(files).slice(-2) : files.slice(-2);
    this.onChange({files: newFiles});
  }

  onChange(delta: Partial<ValidationParams>): void {
    this.setState({params: {...this.state.params, ...delta}});
  }

  onSubmit(): void {
    const { onSubmit } = this.props;
    const { params } = this.state;
    if (onSubmit && paramsAreComplete(params)) {
      onSubmit(params);
      this.setState({params: {...params, files: undefined}});
    }
  }
}
