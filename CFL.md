CoreFiling Development
======================

We wanted to avoid committing keys or certs into Git, so to use the dev server that
fakes up the gateway & authentication, you will need to copy the `.dev` directory
from the Beacon UI project.


Registry
--------

We need to make `yarn` use the public registry, not our proxy, so the `yarn.lock`
makes sense outside out network. To temporarily use a local development build
of one of our packages, use a command like this:

```bash
yarn add @cfl/simple-platform-server --registry https://artifacts.int.corefiling.com/api/npm/cfl-npm/
```


Simple server
-------------

To use the simple server with the realm `dev` rather than `platform`, create a
client in the Keycloak admin interface, then create a `.env` file like the
following:

```bash
CLIENT_ID=id-of-your-client
CLIENT_SECRET=secret
CFL_DEV=t
```


Updating SSL certificates
-------------------------

These are in `.dev`. When these expire, they will need to be replaced by the [latest ones](https://wiki.int.corefiling.com/cfl/CflDotIo).
