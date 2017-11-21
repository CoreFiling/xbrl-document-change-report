# CoreFiling Labs XBRL Document Change Report

A simple demonstration of using the CoreFiling Platform API to calculate and display changes between two XBRL instances.

## Quick start

Sign-up for the True North Data Platform at <https://www.corefiling.com/platform/>.

Install node@>=6.0.0, npm@>=4.0.0 and yarn@>=1.0.0.

```bash
$ yarn install
$ yarn start
```

The application will be available on <http://localhost:8080/xbrl-document-change-report/>.

When prompted, log in using the email address and password for your CoreFiling account.

### Configuring authentication (not required)

To configure non-default OAuth 2 client credentials (supplied by CoreFiling)
export the following variables before starting the application with `yarn start`.

```bash
$ export CLIENT_ID="your-client-id"
$ export CLIENT_SECRET="your-client-secret"
```

## Development

See [Getting Started](#getting-started) for the dependencies.

### Stack

- [Typescript](https://github.com/Microsoft/TypeScript)
- [React](https://github.com/facebook/react)
- [Redux](http://redux.js.org/)
- [Redux-Saga](https://redux-saga.js.org/)
- [Storybook](https://storybook.js.org)
- [Webpack](https://github.com/webpack/webpack)

### Storybook

```bash
yarn storybook
```

and visit <http://localhost:6006/>.

### Unit tests

Single run:

```bash
yarn test
```

Watch files:

```bash
yarn test-debug
```

### Build

```bash
yarn compile
```

### Package

```bash
yarn pack # Produces cfl-xbrl-document-change-report-$VERSION.tgz
```

### Development server

The webpack development server is currently optimised for running in CoreFiling's
development environment and cannot easily be used externally.

## Licence

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this software except in compliance with the License.
You may obtain a copy of the License at <http://www.apache.org/licenses/LICENSE-2.0>.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
