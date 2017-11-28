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
 * API wrapper classes as supplied by the client libraries.
 */

import { ProfilesApiFactory, UploadApiFactory, TablesApiFactory } from '@cfl/table-diff-service';
import { IssuesApiFactory as ValidationServiceIssuesApiFactory } from '@cfl/validation-service';
import {
  FilingversionsApiFactory as TableRenderingServiceFilingVersionsApiFactory,
  TablesApiFactory as TableRenderingServiceTablesApiFactory,
} from '@cfl/table-rendering-service';

import { apiFetch } from './api-fetch';
import { TABLE_DIFF_PREFIX, VALIDATION_PREFIX, TABLE_RENDERING_PREFIX } from './urls';

export const profilesApi = ProfilesApiFactory(apiFetch, TABLE_DIFF_PREFIX);
export const uploadApi = UploadApiFactory(apiFetch, TABLE_DIFF_PREFIX);
export const tablesApi = TablesApiFactory(apiFetch, TABLE_DIFF_PREFIX);

export const validationServiceIssuesApi = ValidationServiceIssuesApiFactory(apiFetch, VALIDATION_PREFIX);

export const tableRenderingServiceTablesApi = TableRenderingServiceTablesApiFactory(apiFetch, TABLE_RENDERING_PREFIX);
export const tableRenderingServiceFilingsVersionsApi = TableRenderingServiceFilingVersionsApiFactory(apiFetch, TABLE_RENDERING_PREFIX);
