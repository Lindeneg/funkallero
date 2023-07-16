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

`curl http://localhost:3000/user -i -X POST`

```json
400 Bad Request
{
    "message": "The requested action could not be exercised due to malformed syntax.",
    "error": [{ "name": "Required", "email": "Required" }]
}
```

Nice, lets try with the properties defined but with an empty string as value.

`curl http://localhost:3000/user -i -d '{"name":"", "email":""}' -H "Content-Type: application/json" -X POST`

```json
400 Bad Request
{
    "message": "The requested action could not be exercised due to malformed syntax.",
    "error": [{ "name": "String must contain at least 2 character(s)", "email": "Invalid email" }]
}
```

Great. Now for a valid user.

`curl http://localhost:3000/user -i -d '{"name":"miles davis", "email":"miles@davis.org"}' -H "Content-Type: application/json" -X POST`

```json
200 OK
{ "data": { "id": "920e3ec0-6a5e-4fe0-ad2e-03f01bca96f2" } } // or whatever id is generated
```

`curl http://localhost:3000/user/:id -i`

```json
200 OK
{ "data": { "id": "920e3ec0-6a5e-4fe0-ad2e-03f01bca96f2", "name": "miles davis" } }
```
