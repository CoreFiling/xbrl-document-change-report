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
  * Create fake instances of models, for use in stories.
  */

import { Profile } from '@cfl/table-diff-service';
import { App } from '../app/models';

function idFromLabel(label: string): string {
  let hash = 0;
  for (let i = 0; i < label.length; i++) {
    const chr = label.charCodeAt(i);
    hash  = (((hash << 5) - hash) + chr) & 0x7FFFFFFF; // tslint:disable-line:no-bitwise
  }
  return `id_${hash.toString(16)}`;
}

export function profile(label: string): Profile {
  return {
    id: idFromLabel(label),
    name: label,
  };
}

export function profiles(...labels: string[]): Profile[] {
  return labels.map(x => profile(x));
}

export const app = (name: string): App => {
  const id = name.toLowerCase().replace(/[^a-z]+/g, '-');
  return {
    id,
    name,
    href: `/${id}/`,
  };
};

export const apps = (...names: string[]): App[] => names.map(name => app(name));
