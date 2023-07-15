---
sidebar_position: 1
description: Install dependencies
---

# Install

Use [Funkallero CLI](/docs/cli/manage-docs-versions) or

`npm install @lindeneg/funkallero`

`yarn add @lindeneg/funkallero`

If `TypeScript` is used, then ensure these settings in `tsconfig`:

```json
{
    "compilerOptions": {
        "experimentalDecorators": true,
        "strictPropertyInitialization": false
    }
}
```

And **optionally** also

```json
{
    "compilerOptions": {
        "paths": {
            "@/*": ["./src/*"]
        }
    }
}
```

Next we'll setup basic project files.
