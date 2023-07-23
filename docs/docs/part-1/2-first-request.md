---
sidebar_position: 2
description: The first request
---

# First Request

Lets see if everything has been setup correctly.

## Build Project

First build project

```sh
yarn build
```

## Start Server

Then start server.

```sh
yarn start
```

## Send Request

Make a `GET` request to `http://localhost:3000/api/example` however you please, via `cURL`, `postman` or the browser even, what ever works.

```bash
curl http://localhost:3000/api/example -X GET
```

###### 200 OK

```json
{ "data": ["user-1", "user-2", "user-3"] }
```

## Next Steps

Lets look a bit closer at services in the next section.
