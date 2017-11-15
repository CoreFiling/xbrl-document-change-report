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

import {} from 'jasmine';

import { paramsAreComplete } from '../models';

describe('paramsAreComplete', () => {
  it('is happy if two files', () => {
    const result = paramsAreComplete({
      profile: 'profile-name',
      files: [
        new File(['x'], 'x.ixbrl'),
        new File(['x'], 'y.ixbrl'),
      ],
    });
    expect(result).toBeTruthy();
  });

  it('is unhappy if fewer files', () => {
    const result = paramsAreComplete({
      profile: 'profile-name',
      files: [
        new File(['x'], 'x.ixbrl'),
      ],
    });
    expect(result).toBeFalsy();
  });

  it('is unhappy if fewer files', () => {
    const result = paramsAreComplete({
      profile: 'profile-name',
      files: [
        new File(['x'], 'x.ixbrl'),
        new File(['x'], 'y.ixbrl'),
        new File(['x'], 'z.ixbrl'),
      ],
    });
    expect(result).toBeFalsy();
  });

  it('is unhappy without profile', () => {
    const result = paramsAreComplete({
      files: [
        new File(['x'], 'x.ixbrl'),
        new File(['x'], 'y.ixbrl'),
      ],
    });
    expect(result).toBeFalsy();
  });
});
