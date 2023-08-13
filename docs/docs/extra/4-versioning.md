---
sidebar_position: 4
description: Set API versioning strategy
---

# Versioning

Versioning can be set on either route level or controller level. Route level takes priority over controller and two strategies are supported.
Versioning via `headers` or via `URL`.

## Enable

First of all, a versioning strategy should be specified and an versioning service can optionally be registered. If not, a default service will be used.

```ts
Funkallero.create({
    // default: null
    versioning: {
        type: 'header', // can also be url
        headerName: 'api-version',
    },
});
```

## Route Level

All of the three handlers below have the same path and method, `GET /example/test`, but which handler is run for any given request is determined - in this example - by the value of request header `api-version`.

```ts
@controller('example')
class VersioningController extends Controller {
    @httpGet('/test')
    // will resolve if no api-version is provided
    public async test() {
        return new MediatorResultSuccess('No Version');
    }

    @httpGet('/test', { version: 'v2' })
    public async testV2() {
        // will resolve if api-version 'v2' is provided
        return new MediatorResultSuccess('Version 2');
    }

    @httpGet('/test', { version: 'v3' })
    public async testV3() {
        // will resolve if api-version 'v3' is provided
        return new MediatorResultSuccess('Version 3');
    }
}
```

## Controller Level

If versioning is added to a controller, that version propagates down to all handlers without versions. If handler already specifies version, then it will remain untouched.

```ts
@controller('example', 'v1')
class VersioningController extends Controller {
    @httpGet('/test')
    // will resolve if api-version 'v1' is provided
    public async test() {
        return new MediatorResultSuccess('Version 1');
    }

    @httpGet('/test', { version: 'v2' })
    public async testV2() {
        // will resolve if api-version 'v2' is provided
        return new MediatorResultSuccess('Version 2');
    }

    @httpGet('/test', { version: 'v3' })
    public async testV3() {
        // will resolve if api-version 'v3' is provided
        return new MediatorResultSuccess('Version 3');
    }
}
```

## Multiple Controllers

Since it's possible to have multiple controllers with the same path, it becomes quite easy to segregate controllers by versioning.

```ts
@controller('example')
class VersioningController extends Controller {
    @httpGet('/test')
    // will resolve if no api-version is provided
    public async test() {
        return new MediatorResultSuccess('No Version');
    }
}

@controller('example', 'v1')
class VersioningV1Controller extends Controller {
    @httpGet('/test')
    public async test() {
        // will resolve if api-version 'v1' is provided
        return new MediatorResultSuccess('Version 1');
    }
}

@controller('example', 'v2')
class VersioningV2Controller extends Controller {
    @httpGet('/test')
    public async test() {
        // will resolve if api-version 'v2' is provided
        return new MediatorResultSuccess('Version 2');
    }
}
```
