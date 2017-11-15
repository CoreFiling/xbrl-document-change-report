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

import * as cookie from 'cookie';

/**
 * Wrapper around the `fetch` builtin to add authentication information.
 *
 * Should have same signature as `window.fetch` and return a promise of the decoded JSON object.
 */
export async function apiFetchJson<T>(url: RequestInfo, init: RequestInit = {}): Promise<T> {
  const res = await apiFetch(url, init);
  if (res.ok) {
    return res.json();
  }
  throw res;
}

/**
 * Wrapper around the `fetch` builtin to add authentication information.
 *
 * Should have same signature as `window.fetch`.
 */
export function apiFetch(url: RequestInfo, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  const xsrfToken = getXsrfToken();
  if (xsrfToken) {
    headers.set('X-XSRF-TOKEN', xsrfToken);
  }
  return fetch(url, {
    credentials: 'same-origin',
    ...init,
    headers,
  });
}

function getXsrfToken(): string | undefined {
  return cookie.parse(document.cookie)['XSRF-TOKEN'];
}
