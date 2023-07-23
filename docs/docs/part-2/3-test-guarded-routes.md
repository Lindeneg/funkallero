---
sidebar_position: 3
description: Test authentication & authorization
---

# Test Guarded Routes

Alright, now we can test out the new auth usage. Build the project anew and start the server again.

Lets try to hit a guarded route with no credentials.

```bash
curl http://localhost:3000/auth/guard
```

###### 401 Unauthorized

```json
{
    "message": "The provided credentials are either invalid or has insufficient privilege to perform the requested action."
}
```

Create a new user that is **not** Miles Davis

```bash
curl http://localhost:3000/user \
-d '{"name":"john doe", "email":"john@doe.org", "password": "some-password"}' \
-H "Content-Type: application/json" -X POST -o john.json
```

A new file is created `jonn.json` that contains the response, including the generated token. We'll use that now.

Open the `john.json` file and copy the token, send a request to the guarded endpoint again and include the token as a bearer.

```bash
curl http://localhost:3000/auth/guard \
-H "Authorization: Bearer JOHN_TOKEN" -X GET
```

###### 200 OK

```json
{ "data": "you are authenticated" }
```

Nice! It worked.

Lets see how the other policy works. Reuse John's token.

```bash
curl http://localhost:3000/auth/miles \
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
curl http://localhost:3000/user \
-d '{"name":"Miles Davis", "email":"miles@davis.org", "password": "some-password"}' \
-H "Content-Type: application/json" -X POST -o miles.json
```

A new file is created `miles.json` that contains the generated token. Use that now.

```bash
curl http://localhost:3000/auth/miles \
-H "Authorization: Bearer MILES_TOKEN" -X GET
```

###### 200 OK

```json
{ "data": "you are miles davis" }
```
