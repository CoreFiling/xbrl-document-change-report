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

import { User, App, Category, Filing, FilingVersion,
  TableRenderingWindow, ValidationServiceFilingVersionSummary } from '../models';
import { QueryableTablePage } from '@cfl/table-viewer';
import { Breakdown, Option, TableHeader, TableMetadata } from '@cfl/table-rendering-service';

export const exampleUser: User = {
  sub: 'ecdc0363-976d-4a42-a4cc-ae5d63f3a806',
  name: 'Akira Knutson',
  preferred_username: 'at',
  email: 'at@example.com',
};

export const exampleApps: App[] = [
  {id: 'beacon', name: 'Beacon', href: '/beacon/', colour: '#3c7c34', iconHref: '/img/logo-beacon.svg', features: []},
  {id: 'account', name: 'Manage account', href: '/auth/account', colour: '#3A75C4', features: []},
  {id: 'sms', name: 'Manage organisation', href: '/sms/', colour: '#3A75C4', features: []},
];

export const exampleCategory: Category = {
  name: 'validation',
  profiles: [
    {
      id: 'cab5627a-0afa-434c-9891-cd7e37927ee5',
      category: 'validation',
      name: 'SII 2.0.1',
      description: 'Validation profile for Solvency II 2.0.1 instances. XIIF and TNEFRVM SII EIOPA enabled.',
    },
    {
      id: '24b17ed4-0d2b-4e0c-83a2-c1d72e67aa64',
      category: 'validation',
      name: 'FRC 2.1.0,  UK 2009-09 - 01 & HMRC DPL 2013-10 - 01',
    },
  ],
};

export const exampleFiling: Filing = {
  id: '8723b794-3261-4cd3-b946-b683c19fb99c',
  type: 'Filing',
  name: 'report.xbrl',
  versions: [
    {
      id: 'f09be954-1895-4954-b333-6c9c89b833f1',
      type: 'FilingVersionSummary',
      created: '2017-09-12T10:09:49.915Z',
      creator: {
        id: '4b7fe222-0d6e-4ae1-977d-c4eb047c2fbc',
        name: 'Gurdeep Tash',
        // https://www.behindthename.com/random/random.php?number=1&gender=u&surname=&randomsurname=yes&norare=yes&nodiminutives=yes&all=yes
      },
      status: 'RUNNING',
    },
  ],
};

export const exampleFilingVersion: FilingVersion = {
  id: 'f09be954-1895-4954-b333-6c9c89b833f1',
  type: 'FilingVersion',
  created: '2017-09-12T10:09:49.915Z',
  creator:  {
    id: '4b7fe222-0d6e-4ae1-977d-c4eb047c2fbc',
    name: 'Gurdeep Tash',
  },
  status: 'DONE',
  documents: [
    {
      category: 'validation',
      created: '2017-09-12T10:09:50.875Z',
      creation: {status: 'DONE'},
      id: '081c4d35-7c12-40e9-b3a5-df3eb8ddc214',
      profile: 'SII 2.0.1',
    },
    {
      category: 'unknown',
      created: '2017-09-12T10:09:49.915Z',
      id: 'd18a0433-8f5d-44d3-821b-3b505df37d63',
      profile: 'default',
    },
  ],
  filing: {
    type: 'FilingSummary',
    id: '8723b794-3261-4cd3-b946-b683c19fb99c',
    name: 'report.xbrl',
  },
};

export const exampleValidationServiceFilingVersionSummary: ValidationServiceFilingVersionSummary = {
  id: exampleFilingVersion.id,
  severity: 'OK',
};

export const exampleZOption: Option = {
  headers: [],
  z: 1,
};

export const exampleBreakdown: Breakdown = {
  depth: 1,
  name: 'exampleBreakdown',
};

export const exampleTableHeader: TableHeader = {
  breakdowns: [exampleBreakdown],
  depth: 1,
  sliceCount: 1,
};

export const exampleTableMetadata: TableMetadata = {
  id: 'foo',
  name: 'Foo',
  x: exampleTableHeader,
  y: exampleTableHeader,
  z: exampleTableHeader,
};

// So far just used in equality checks.
export const exampleQueryableTablePage: QueryableTablePage = {
} as any;

export const exampleTableRenderingWindow: TableRenderingWindow = {
  height: 1,
  width: 1,
  x: 1,
  y: 1,
  z: 1,
};
