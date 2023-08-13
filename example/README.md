This example uses prisma, sqlite and http-only cookie with jwt for authentication.

It also includes some UI, using Handlebars as template engine. However, it is also possible to serve SPA, such as React, Vue etc.

---

To run the example:

1. Make sure you first run the commands specified in the main [README](https://github.com/Lindeneg/funkallero/tree/master).

2. Run a DB migration, i.e `yarn migrate` from here or `yarn cli migrate example` from root.

3. Run `yarn start` (or `yarn start example` from root).

To run the example in watch mode, simply run `yarn dev` from here or `yarn cli dev example` from root.

---

Make use of the postman-collection [here](./postman) for easy usage of this example. Remember to update the `url` postman variable if `https` server is used.

---

Set the below environmental variable for extra logs to stdout:

`FUNKALLERO_DEBUG_MODE=on`
