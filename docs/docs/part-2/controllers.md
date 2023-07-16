---
sidebar_position: 4
description: Extending user controller
---

# Extending Controller

Extend the controller with new routes _(naive implementation at first)_.

Notice the type safety in the mediator `send` calls inferred from the `execute` method of the given action name.

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
