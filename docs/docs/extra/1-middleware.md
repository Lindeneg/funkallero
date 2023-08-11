---
sidebar_position: 1
description: Create and use middleware services
---

# Middleware

Middleware are services and thus inherits all service properties. Middleware services are then guaranteed to contain two public methods: `beforeRequestHandler` and `afterRequestHandler`, which correlates to before and after decorators, respectively. However, both have an empty default implementation and thus one can implement only what's desired.

## Create

Middleware can be both scoped or singleton service.

:::info
Remember to register middleware inside `setup` in the main project file, i.e

`service.registerScopedService(SERVICE.TEST_1_MIDDLEWARE, ExampleMiddlewareService);`
:::

```ts
class ExampleMiddlewareService extends MiddlewareScopedService {
    @injectService(SERVICE.LOGGER)
    private readonly logger: ILoggerService;

    async beforeRequestHandler(response: Response) {
        this.logger.info(
            `before test-2-middleware running on request: ${this.request.id}`
        );
    }

    async afterRequestHandler(response: Response, result: MediatorResult) {
        this.logger.info(
            `after test-2-middleware running on request: ${this.request.id}`
        );
        return result;
    }
}
```

## Usage

Middleware can be consumed on route handlers via `before` and `after` decorators.

If multiple before middleware services are added, they are executed in arbitrary order. If multiple after middleware services are added, they are always executed in the order they were provided.

```ts
@httpGet('/:id')
@before(SERVICE.TEST_1_MIDDLEWARE, SERVICE.TEST_2_MIDDLEWARE)
@after(SERVICE.TEST_2_MIDDLEWARE)
public async getUser(@params('id') id: string) {
    return this.mediator.send('GetUserQuery', { id });
}
```
