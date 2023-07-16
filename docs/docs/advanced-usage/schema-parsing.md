---
sidebar_position: 5
description: Extract, validate and/or transform request context values
---

# Schema Parsing

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

## Update DTO

###### src/dtos/create-user.ts

```ts
import { z } from 'zod';
import type User from '@/domain/user';

export const createUserSchema = z.object({
    name: z.string().min(2).max(20),
    email: z.string().email(),
});

export interface ICreateUserDto extends z.infer<typeof createUserSchema> {}

export interface ICreateUserResponse {
    id: User['id'];
}
```

## Next up

Update controllers and make use of the `zod` schemas.
