---
sidebar_position: 2
description: Get started with a base project
---

# Base Project

## Structure

```
.
└── src
    ├── index.ts         - Main File
    ├── api              - Controllers
    ├── application      - Use Cases
    ├── domain           - Entities
    ├── enums            - Constants
    |     ├── service.ts - Service names
    └── services         - Singleton and scoped services
```

Create `src/index.ts` if not already done.

Funkallero exposes a static `create` method that takes in a configuration object with [these](https://github.com/Lindeneg/funkallero/blob/master/packages/funkallero-core/src/service/configuration-service.ts#L5-L25) options.

The only required options are `basePath` and a `setup` function that is used to register services.

###### src/index.ts

```ts
import Funkallero from '@lindeneg/funkallero';

Funkallero.create({
    basePath: '/',
    setup(service) {},
}).then((app) => app.start());
```

Next we'll look at some basic services.
