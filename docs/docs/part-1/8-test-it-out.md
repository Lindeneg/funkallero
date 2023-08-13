---
sidebar_position: 8
description: Test out the app so far
---

# Test it out

Start by building project again and starting server.

## Build Project

```bash
yarn build
```

## Start Server

```bash
yarn start
```

## Requests

Start by creating an invalid user.

```bash
curl http://localhost:3000/api/user -X POST
```

###### 400 Bad Request

```json
{
    "message": "The requested action could not be exercised due to malformed syntax.",
    "error": [{ "name": "Required", "email": "Required" }]
}
```

Nice. Try with the properties defined but with empty strings as values.

```bash
curl http://localhost:3000/api/user \
-d '{"name":"", "email":""}' \
-H "Content-Type: application/json" \
-X POST
```

###### 400 Bad Request

```json
{
    "message": "The requested action could not be exercised due to malformed syntax.",
    "error": [
        {
            "name": "String must contain at least 2 character(s)",
            "email": "Invalid email"
        }
    ]
}
```

Great. Now for a valid user.

```bash
curl http://localhost:3000/api/user \
-d '{"name":"miles davis", "email":"miles@davis.org"}' \
-H "Content-Type: application/json" \
-X POST
```

###### 201 OK

```json
{ "id": "GENERATED_ID" }
```

Lets get the user for good measure.

```bash
curl http://localhost:3000/api/user/GENERATED_ID -X GET
```

###### 200 OK

```json
{ "id": "GENERATED_ID", "name": "miles davis" }
```

## Next Steps

In Part 2, we'll take a closer look at authentication, authorization, middleware and some other stuff.
