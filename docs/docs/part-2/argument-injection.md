---
sidebar_position: 6
description: Injecting request data into route handlers
---

# Argument Injection

As said previously, `body`, `params`, `query` and `headers` decorators takes three optional arguments that can be given in any order.

The arguments are used for extraction (`string | string[]`), schema parsing (`Record<any, any>`) and transformation (`Function`).

Regardless of which order they are given, the order they are run is always the same:

Extraction happens first, then parsing then transformation.

## Inject request context

###### src/api/user-controller.ts

```ts
import { controller, httpGet, httpPost, params, body } from '@lindeneg/funkallero';
import BaseController from './base-controller';
import { createUserSchema, type ICreateUserDto } from '@/dtos/create-user';

@controller('user')
class UserController extends BaseController {
    @httpGet()
    public async getUsers() {
        return this.mediator.send('GetUsersQuery');
    }

    @httpGet('/:id')
    public async getUser(@params('id') id: string) {
        return this.mediator.send('GetUserQuery', {
            id,
        });
    }

    @httpPost()
    public async createUser(@body(createUserSchema) dto: ICreateUserDto) {
        return this.mediator.send('CreateUserCommand', dto);
    }
}
```

## Test it out

Build the project and start up the server.

Lets test by creating an invalid user.

```bash
curl http://localhost:3000/user -X POST
```

###### 400 Bad Request

```json
{
    "message": "The requested action could not be exercised due to malformed syntax.",
    "error": [{ "name": "Required", "email": "Required" }]
}
```

Nice, lets try with the properties defined but with empty strings as values.

```bash
curl http://localhost:3000/user \
-d '{"name":"", "email":""}' \
-H "Content-Type: application/json" \
-X POST
```

###### 400 Bad Request

```json
{
    "message": "The requested action could not be exercised due to malformed syntax.",
    "error": [{ "name": "String must contain at least 2 character(s)", "email": "Invalid email" }]
}
```

Great. Now for a valid user.

```bash
curl http://localhost:3000/user \
-d '{"name":"miles davis", "email":"miles@davis.org"}' \
-H "Content-Type: application/json" \
-X POST
```

###### 200 OK

```json
{ "data": { "id": "GENERATED_ID" } }
```

Lets get the user for good measure.

```bash
curl http://localhost:3000/user/GENERATED_ID
```

###### 200 OK

```json
{ "data": { "id": "GENERATED_ID", "name": "miles davis" } }
```
