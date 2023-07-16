---
sidebar_position: 3
description: Register two required services
---

# Base Services

## Overview

Services are at the center in Funkallero. The main property that defines a service, is the fact that it can be injected into other services.

In the context of web APIs, it's quite easy to think of two distinct types of services: `Singleton` and `Scoped`. The former is instantiated once. The latter is instantiated per request and is always injected with the request as an instance member.

This of course has a direct influence on the lifetime of a given service instance but it also introduces the following constraint:

Singleton services can only have other singleton services as injection dependencies. Scoped services can have other scoped services as well as singletons as dependencies.

A bunch of defaults services are provided but any service can be extended/overwritten and custom services can be easily added.

At least two singleton services must always be registered, a `MediatorService` and a `DataContextService`.

Create the below files as a start.

## Base Service Setup

###### src/enums/service.ts

```ts
import { SERVICE as BASE_SERVICE } from '@lindeneg/funkallero';

const SERVICE = {
    ...BASE_SERVICE,
} as const;

export default SERVICE;
```

###### src/services/data-context-service.ts

```ts
import {
    injectService,
    SingletonService,
    type ILoggerService,
    type IDataContextService,
} from '@lindeneg/funkallero';
import SERVICE from '@/enums/service';

class DataContextService extends SingletonService implements IDataContextService {
    @injectService(SERVICE.LOGGER)
    private readonly logger: ILoggerService;

    // we will return to this in a later section
}

export default DataContextService;

```

###### src/services/mediator-service.ts

```ts
import { MediatorService as BaseMediatorService } from '@lindeneg/funkallero';
import * as application from '@/application'; // this will give an error, we'll fix that in the next section

class MediatorService extends BaseMediatorService<typeof application> {
    constructor() {
        super(application);
    }
}

export default MediatorService;
```

## Register Required Services

Now we can register the two required services in the `setup` function:

###### src/index.ts

```ts
import Funkallero from '@lindeneg/funkallero';
import SERVICE from '@/enums/service';
import MediatorService from '@/services/mediator-service';
import DataContextService from '@/services/data-context-service';

Funkallero.create({
    basePath: '/',
    setup(service) {
        service.registerSingletonService(SERVICE.MEDIATOR, MediatorService);
        service.registerSingletonService(SERVICE.DATA_CONTEXT, DataContextService);
    },
}).then((app) => app.start());

```
Lets look at a basic application layer.