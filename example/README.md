This example uses prisma, postgres and http-only cookie with jwt for authentication.

---

To run the example:

1. Make sure you first run the commands specified in the main [README](https://github.com/Lindeneg/funkallero/tree/master).

2. Ensure you have set the correct environmental variables, see `.env-example`.

3. Run a DB migration, i.e `yarn migrate` from here or `yarn cli migrate example` from root.

4. Run `yarn start` (or `yarn start example` from root).

Optionally, open a new shell and either run `yarn studio` from here or `yarn cli studio example` from root, to utilize prisma studio.

---

Make use of the postman-collection [here](./postman) for easy usage of this example. Remember to update the `url` postman variable if `https` server is used.

---

Set the below environmental variable for extra logs to stdout:

`FUNKALLERO_DEBUG_MODE=on`
