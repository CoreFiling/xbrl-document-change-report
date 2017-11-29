// Run tests from all modules whose names start with `test-`
// in the `src/app` directory and its subdirectories.
//
// Convention is that in order to test a module `foo.ts`, you create
// file `tests/test-foo.ts`.

require('babel-polyfill');
var context = require.context('./src/app', true, /\/test-[^\/]*\.tsx?$/);
context.keys().forEach(context);

