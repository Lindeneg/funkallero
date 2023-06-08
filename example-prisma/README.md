This example uses prisma, postgres, cookies for authentication and local https server.

---

To run the example:

1. Make sure you first run the commands specified in the main [README](https://github.com/Lindeneg/funkallero/tree/master).

2. Ensure you have set the correct environmental variables, see `.env-example`.

3. Run a DB migration, i.e `yarn migrate` from here or `yarn cli migrate prisma` from root.

4. Either:

    - Generate HTTPS credentials. See [package.json](./package.json) `setup-https` script for an example.
    - Or simply comment out the https property in the configuration. Then the example will run on http.

5. Use `yarn start` (or `yarn start prisma` from root).

Optionally, open a new shell and either run `yarn studio` from here or `yarn cli studio prisma` from root, to utilize prisma studio.

---

Make use of the postman-collection [here](./postman) for easy usage of this example.

---

Set the below environmental variable for extra logs to stdout:

`FUNKALLERO_DEBUG_MODE=on`
