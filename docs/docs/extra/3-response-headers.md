---
sidebar_position: 3
description: Set global and route specific response headers
---

# Response Headers

Response headers can be set via the `response` context itself, however global and route specific configuration is also available.

```ts
type Headers = Record<
    string,
    string | ((request: Request) => string | Promise<string>)
>;
```

## Global Headers

These are set on all responses. However, they can easily be overwritten on specific routes.

```ts
Funkallero.create({
    // default: null
    globalHeaders: {
        'Content-Type': 'application/json',
        'Custom-Header': 'Global-Custom-Header-Value',
    },
});
```

## Route Headers

Use `setHeaders` decorator to set route specific headers.

```ts
@httpGet()
@setHeaders({
    'Custom-Header': 'Specific-Header-Value',
    'TimeStamp-Header': () => Date.now().toString(),
    'Request-ID': (req) => req.id,
})
public SomeQuery() {
    return this.mediator.send('SomeQuery');
}
```
