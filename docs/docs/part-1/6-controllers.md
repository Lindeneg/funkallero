---
sidebar_position: 6
description: Create user controller
---

# Controller

Make use of new actions by creating a user controller.

```sh
funkallero controller user
```

This creates a new file in the `api` folder.

Consume the user actions via mediator. _(naive implementation at first)_.

###### src/api/user-controller.ts

```ts
import { controller, httpGet, httpPost } from '@lindeneg/funkallero';
import BaseController from './base-controller';

@controller('user')
class UserController extends BaseController {
    @httpGet()
    public async getUsers() {
        return this.mediator.send('GetUsersQuery');
    }

    @httpGet('/:id')
    public async getUser() {
        return this.mediator.send('GetUserQuery', {
            id: this.request.params.id,
        });
    }

    @httpPost()
    public async createUser() {
        return this.mediator.send('CreateUserCommand', {
            name: this.request.body.name,
            email: this.request.body.email,
        });
    }
}
```

## Is this good?

No. There's no validation on the request data, we assume the values to be sound, which is an insane position.

Funkallero offers a solution to this by the optional service `SCHEMA_PARSER` service that works on `body`, `params`, `query` and `headers` decorators.

Lets take a look in the next section.
