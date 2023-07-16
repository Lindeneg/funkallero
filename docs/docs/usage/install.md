---
sidebar_position: 1
description: Install dependencies
---

# Install

Use [Funkallero CLI](/docs/cli/manage-docs-versions) or

`yarn add @lindeneg/funkallero`

If TypeScript is used install types for express:

`yarn add -D @types/express`

And ensure these settings in `tsconfig`:

```json
{
    "compilerOptions": {
        "experimentalDecorators": true,
        "strictPropertyInitialization": false
    }
}
```

**Optionally** also these settings:

```json
{
    "compilerOptions": {
        "paths": {
            "@/*": ["./src/*"]
        }
    }
}
```

See here for an [example](https://github.com/Lindeneg/funkallero/blob/master/example/tsconfig.json) config.

Next we'll setup basic project files.
