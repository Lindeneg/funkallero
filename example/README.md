This example uses prisma, postgres and http-only cookie with jwt for authentication.

---

To run the example:

1. Make sure you first run the commands specified in the main [README](https://github.com/Lindeneg/funkallero/tree/master).

2. Ensure you have set the correct environmental variables, see `.env-example`.

3. Run a DB migration, i.e `yarn migrate` from here or `yarn cli migrate prisma` from root.

4. Optionally uncomment `https` property in main index.ts file. Remember to generate https credentials if so. See [package.json](./package.json) `setup-https` script for an example.

5. Run `yarn start` (or `yarn start example` from root).

Optionally, open a new shell and either run `yarn studio` from here or `yarn cli studio prisma` from root, to utilize prisma studio.

---

Make use of the postman-collection [here](./postman) for easy usage of this example.

---

Set the below environmental variable for extra logs to stdout:

`FUNKALLERO_DEBUG_MODE=on`
