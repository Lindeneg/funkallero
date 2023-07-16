---
sidebar_position: 7
description: The first request
---

# First Request

## Start Server

`yarn start`

## Send Request

Make a `GET` request to `http://localhost:3000/user` however you please, via `cURL`, `postman` or the browser even, what ever works.

The response should have the array made in section four.

```bash
curl http://localhost:3000/user
```

###### 200 OK

```json
{ "data": ["user-1", "user-2", "user-3"] }
```

## Next Steps

Go to the next section where we transform this basic example into a more usable API.
