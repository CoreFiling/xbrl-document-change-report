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

/**
 * Display a reference to the file the user has uploaded.
 */

import * as classNames from 'classnames';
import humanSize = require('human-size');
import * as React from 'react';

import FileReferenceIcon from './file-reference-icon';
import './file-reference.less';

interface FileReferenceProps {
  className?: string;
  file: File;
  type: 'OLD' | 'NEW';

  onRemove?: () => void;
}

export default function FileReference({className, file, type, onRemove}: FileReferenceProps): JSX.Element {
  return <div className={classNames('app-FileReference', className)}>
    <FileReferenceIcon type={type} onRemove={onRemove} />
    <div className='app-FileReference-item app-FileReference-name'>
      {file.name || 'Selected file'}
    </div>
    <div className='app-FileReference-item app-FileReference-size'>{humanSize(file.size)}</div>
  </div>;
}
