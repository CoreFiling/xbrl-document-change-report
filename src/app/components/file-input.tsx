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

import DropzoneIcon, { DropzoneIconType } from './dropzone-icon';
import './file-input.less';

interface FileInputProps {
  file?: File;
  className?: string;
  dropzoneType: DropzoneIconType;

  onChange?: (file: File | undefined) => void;
}

// tslint:disable-next-line:variable-name
const FileInput = ({ file, className, dropzoneType, onChange }: FileInputProps): JSX.Element => <Dropzone
  className={classNames('app-FileInput', className)}
  activeClassName='app-ChangeForm-dropzoneActive'
  multiple={false}
  accept='.xml,.xbrl,.html,.htm,.zip'
  maxSize={5 * 1024 * 1024}
  aria-label='File to compare'
  onDrop={onChange && (files => onChange(files[0]))}
  disabled={!onChange}
>
  {file &&
    <FileReference className='app-FileInput-file' file={file} onRemove={onChange && (() => onChange(undefined))}/>
  }
  {!file && [
    <div className='app-FileInput-main'>
      <DropzoneIcon className='app-FileInput-DropzoneIcon' type={dropzoneType} />
      <h2 className='app-FileInput-heading'>Drag &amp; Drop</h2>
      <div className='app-FileInput-prompt'>
        your file here, <span className='app-FileInput-prompt-btn'>or browse.</span>
      </div>
    </div>,
    <div className='app-FileInput-hint'>XBRL, Inline XBRL, or ZIP. 5&thinsp;MB max each.</div>,
    ]
  }
</Dropzone>;

export default FileInput;
