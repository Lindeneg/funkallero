---
sidebar_position: 8
description: Middleware services
---

# Middleware

`body`, `params`, `query` and `headers` decorators can be used to inject request context into route handlers.

The decorators each have the same function [signature](https://github.com/Lindeneg/funkallero/blob/master/packages/funkallero/src/decorators/inject-arg.ts#L31) that can be used to extract, validate and transform values.

However, before they add any real value, a `SCHEMA_PARSER` service must be added.

## Zod

In this example, [zod](https://zod.dev/) will be used, where an adapter can be consumed but any implementation can be used by satisfying [this](https://github.com/Lindeneg/funkallero/blob/master/packages/funkallero-core/src/service/schema-parser-service.ts#L15-L17) interface.

`yarn add zod`

Then add the schema parser service in the main file

###### src/index.ts

```ts
import { BaseZodParserService } from '@lindeneg/funkallero';

setup(service) {
    service.registerSingletonService(SERVICE.SCHEMA_PARSER, BaseZodParserService);
}
```

## Update DTOs

## Update Controller

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
