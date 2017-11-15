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

import './file-reference.less';

interface FileReferenceProps {
  className?: string;
  file?: File;

  onRemove?: () => void;
}

export default function FileReference({className, file, onRemove}: FileReferenceProps): JSX.Element {
  if (!file) {
    return <span>No file</span>;
  }
  return <span className={classNames('app-FileReference', className)}>
    <span className='app-FileReference-name'>
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 24' className='app-FileReference-icon'>
        <path className='app-FileReference-outline' d='M1,1H11l6,8V23H1z'/>
        <path className='app-FileReference-inline' d='M11,1l-2,6 8,2'/>
      </svg>
      {file.name || 'Selected file'}
    </span>
    <span className='app-FileReference-size'>{humanSize(file.size)}</span>
    {onRemove &&
      <span className='app-FileReference-remove' onClick={e => {e.stopPropagation(); onRemove(); }}>
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 15 15' className='app-FileReference-removeIcon'>
          <circle className='app-FileReference-removeDisc' cx='7.5' cy='7.5' r='7.5'/>
          <path className='app-FileReference-removeSymbol' d='M4,4L11,11M4,11L11,4'/>
        </svg>
      </span>
    }
  </span>;
}
