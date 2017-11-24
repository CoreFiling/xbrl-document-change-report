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

import DropzoneIcon from './dropzone-icon';
import './file-input.less';

interface FileInputProps {
  file?: File;
  className?: string;
  type: 'OLD' | 'NEW';

  onChange?: (file: File | undefined) => void;
}

// tslint:disable-next-line:variable-name
const FileInput = ({ file, className, type, onChange }: FileInputProps): JSX.Element => {
  if (file) {
    return <div className={classNames('app-FileInput', className)} onClick={onChange && (() => onChange(undefined))}>
      <FileReference className='app-FileInput-file' type={type} file={file} />
    </div>;
  }
  return <Dropzone
    className={classNames('app-FileInput', className)}
    activeClassName='app-ChangeForm-dropzoneActive'
    multiple={false}
    accept='.xml,.xbrl,.html,.htm'
    maxSize={5 * 1024 * 1024}
    aria-label='File to compare'
    onDrop={onChange && (files => onChange(files[0]))}
    disabled={!onChange}
  >
    {[
      <div key='1' className='app-FileInput-main'>
        <DropzoneIcon className='app-FileInput-DropzoneIcon' type={type} />
        <h2 className='app-FileInput-heading'>Drag &amp; Drop</h2>
        <div className='app-FileInput-prompt'>
          your file here, <span className='app-FileInput-prompt-btn'>or browse.</span>
        </div>
      </div>,
      <div key='2' className='app-FileInput-hint'>XBRL or Inline XBRL. 5&thinsp;MB max each.</div>,
    ]}
  </Dropzone>;
};

export default FileInput;
