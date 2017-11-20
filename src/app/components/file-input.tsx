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

import classNames = require('classnames');
import * as React from 'react';
import Dropzone = require('react-dropzone');

import FileReference from './file-reference';

import './file-input.less';

interface FileInputProps {
  label?: string;
  file?: File;
  className?: string;

  onChange?: (file: File | undefined) => void;
}

// tslint:disable-next-line:variable-name
const FileInput = ({ label, file, className, onChange }: FileInputProps): JSX.Element => <Dropzone
  className={classNames('app-FileInput', className)}
  activeClassName='app-ChangeForm-dropzoneActive'
  multiple={false}
  accept='.xml,.xbrl,.html,.htm,.zip'
  maxSize={5 * 1024 * 1024}
  aria-label='File to compare'
  onDrop={onChange && (files => onChange(files[0]))}
  disabled={!onChange}
>
  <div>
    {file
    ? <FileReference className='app-FileInput-file' file={file} onRemove={onChange && (() => onChange(undefined))}
      />
    : <div>
        <h2 className='app-FileInput-heading'>{label || 'Drop file here'}</h2>
        <div className='app-FileInput-prompt'>
          or <span className='app-FileInput-btn'>click to select file</span>
        </div>
        <div className='app-FileInput-hint'>XBRL, Inline XBRL, or ZIP. 5&thinsp;MB max.</div>
      </div>
    }
  </div>
</Dropzone>;

export default FileInput;
