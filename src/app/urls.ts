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
 * URLs for the APIs we do not call via a client wrapper.
 */

import * as uriTemplates from 'uri-templates';

import { App } from './models';

export const USER = '/api/user';
export const APPS = '/api/apps';
export const AUTH_LOGOUT = '/auth/logout';

const APP_HOME = uriTemplates('{+base}');
const APP_HELP = uriTemplates('{+base}static/user-guide.html');

export const appHome = ({href}: App) => APP_HOME.fillFromObject({base: href});
export const appHelp = ({href}: App) => APP_HELP.fillFromObject({base: href});

export const TABLE_RENDERING_PREFIX = '/api/table-rendering-service/v1';
export const TABLE_DIFF_PREFIX = '/api/table-diff-service/v1';

// POST to this URL to create a comparison.
export const TABLE_DIFF_SERVICE_COMPARISONS = TABLE_DIFF_PREFIX + '/comparisons/';
