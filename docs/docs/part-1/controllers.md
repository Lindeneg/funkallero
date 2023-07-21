---
sidebar_position: 5
description: The first controller and route
---

# Base API Layer

## Base Controller

A controller is a special kind of scoped service that receives both the request and response context.

A base implementation is provided that is injected with the registered mediator service and a logger. It is recommend to extend the base service and provide the mediator as a type.

###### src/api/base-controller.ts

```ts
import { ControllerService } from '@lindeneg/funkallero';
import type MediatorService from '@/services/mediator-service';

class BaseController extends ControllerService<MediatorService> {
    // override handleResult if desired
    // public async handleResult(result: MediatorResult): Promise<void> {
    // }
}

export default BaseController;
```

`handleResult` translates a [MediatorResult](https://github.com/Lindeneg/funkallero/blob/funkallero-cli/packages/funkallero-core/src/service/mediator-service.ts#L35-L47) into an actual `response`. There's a default implementation [here](https://github.com/Lindeneg/funkallero/blob/funkallero-cli/packages/funkallero/src/service/base-controller-service.ts#L19-L71) but it can easily be overwritten.

## User Controller

Lets implement a controller for the single query we created.

###### src/api/user-controller.ts

```ts
import { controller } from '@lindeneg/funkallero';
import BaseController from './base-controller';

@controller('user')
class UserController extends BaseController {}
```

With a default config, this controller path would be `http://localhost:3000/user`. In order to have routes and handlers, simply define methods and use the appropiate `http` decorator. The handler method must always return a `MediatorResult`.

###### src/api/user-controller.ts

```ts
import { controller, httpGet } from '@lindeneg/funkallero';
import BaseController from './base-controller';

@controller('user')
class UserController extends BaseController {
    @httpGet()
    public async getUsers() {
        return this.mediator.send('GetUsersQuery');
    }
}
```

Requests to `GET http://localhost:3000/user` would now run the above handler.

## Register Controller

In order for the controller to be registered, just import the file itself inside the projects main file:

###### src/index.ts

```ts
import '@/api/user-controller';
```

## Moving On

There's more to do with controllers, such as specifying middleware, authorization policies, schema parsing and response headers, all via decorators. Both singletons and scoped services can also be injected into controllers.

However, lets build the project and make a request to the created endpoint and see if it works.
