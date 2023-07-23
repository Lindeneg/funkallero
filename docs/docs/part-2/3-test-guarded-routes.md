---
sidebar_position: 3
description: Test authentication & authorization
---

# Test Guarded Routes

Alright, now we can test out the new auth usage.

Start by building project again and starting server.

## Build Project

:::info
It is recommended to mark consumed libraries as `external` in `rollup.config.js`:

```js
{
    ...,
    external: ["@lindeneg/funkallero", "@lindeneg/funkallero-auth-service", "zod"],
    ...
}
```

:::

```bash
yarn build
```

## Start Server

```bash
yarn start
```

## Requests

Lets try to hit a guarded route with no credentials.

```bash
curl http://localhost:3000/api/auth/guard
```

###### 401 Unauthorized

```json
{
    "message": "The provided credentials are either invalid or has insufficient privilege to perform the requested action."
}
```

Create a new user that is **not** Miles Davis

```bash
curl http://localhost:3000/api/user \
-d '{"name":"john doe", "email":"john@doe.org", "password": "some-password"}' \
-H "Content-Type: application/json" -X POST
```

The response contains a `token` property. Copy the value and use it in the next request.

```bash
curl http://localhost:3000/api/auth/guard \
-H "Authorization: Bearer JOHN_TOKEN" -X GET
```

###### 200 OK

```json
{ "data": "you are authenticated" }
```

Nice! It worked.

Lets see how the other policy works. Reuse John's token.

```bash
curl http://localhost:3000/api/auth/miles \
-H "Authorization: Bearer JOHN_TOKEN" -X GET
```

###### 401 Unauthorized

```json
{
    "message": "The provided credentials are either invalid or has insufficient privilege to perform the requested action."
}
```

Ok, lets create a new user, Miles Davis and use that token with the miles endpoint. We should see 200 OK response.

```bash
curl http://localhost:3000/api/user \
-d '{"name":"Miles Davis", "email":"miles@davis.org", "password": "some-password"}' \
-H "Content-Type: application/json" -X POST
```

The response contains a `token` property again. Use it.

```bash
curl http://localhost:3000/api/auth/miles \
-H "Authorization: Bearer MILES_TOKEN" -X GET
```

###### 200 OK

```json
{ "data": "you are miles davis" }
```

Great, it worked! Lets test the login endpoint as well for good measure.

First with an invalid user.

```bash
curl http://localhost:3000/api/auth/login \
-d '{"email":"invalid@doe.org", "password": "some-password"}' \
-H "Content-Type: application/json" -X POST
```

###### 404 Not Found

```json
{ "message": "The requested resource could not be found." }
```

Now, with a valid user but wrong password.

```bash
curl http://localhost:3000/api/auth/login \
-d '{"email":"miles@davis.org", "password": "invalid-password"}' \
-H "Content-Type: application/json" -X POST
```

###### 404 Not Found

```json
{ "message": "The requested resource could not be found." }
```

Same response, nice!

Lets try with a valid user with correct password.

```bash
curl http://localhost:3000/api/auth/login \
-d '{"email":"miles@davis.org", "password": "some-password"}' \
-H "Content-Type: application/json" -X POST
```

###### 200 OK

```json
{ "data": { "token": "GENERATED_TOKEN" } }
```
