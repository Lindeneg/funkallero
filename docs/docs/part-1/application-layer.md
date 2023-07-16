---
sidebar_position: 4
description: The first query
---

# Base Application Layer

The application layer is a bunch of mediator actions, which always exposes an `execute` method.

Mediator actions are effectively singleton services and thus can only have other singleton services injected via the `injectService` decorator.

For ease of use, it's recommended to have a base action that extends the default implementation exposed by `Funkallero`. That implementation is always injected with the registered `DataContextService`.

###### src/application/base-action/index.ts

```ts
import { MediatorAction } from '@lindeneg/funkallero';
import type DataContextService from '@/services/data-context-service';

class BaseAction extends MediatorAction<DataContextService> {}

export default BaseAction;
```

###### src/application/user/get-users-query.ts

```ts
import { MediatorResultSuccess } from '@lindeneg/funkallero';
import BaseAction from '@/application/base-action';

class GetUsersQuery extends BaseAction {
    public async execute() {
        return new MediatorResultSuccess(['user-1', 'user-2', 'user-3']);
    }
}

export default GetUsersQuery;
```

###### src/application/index.ts

```ts
// now the import error in src/services/mediator-service.ts is gone
export { default as GetUsersQuery } from './user/get-users-query';
```

We will return to this but for now lets move on to `controllers` and expose an endpoint that returns the data from the `GetUsersQuery` action.
