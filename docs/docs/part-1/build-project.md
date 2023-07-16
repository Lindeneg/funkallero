---
sidebar_position: 6
description: Build the project
---

# Build Project

## Build Config

Either setup your own build process, use the typescript compiler or follow the below approach with `rollup`.

###### Rollup

`yarn add -D rollup rollup-plugin-typescript2 rollup-plugin-cleaner @rollup/plugin-commonjs`

###### rollup.config.mjs

```js
import typescript from 'rollup-plugin-typescript2';
import cleaner from 'rollup-plugin-cleaner';
import commonjs from '@rollup/plugin-commonjs';

export default {
    input: './src/index.ts',
    output: {
        file: './dist/index.mjs',
        format: 'esm',
        exports: 'named',
    },
    external: ['@lindeneg/funkallero'],
    plugins: [
        cleaner({
            targets: ['./dist'],
        }),
        commonjs(),
        typescript({
            tsconfig: './tsconfig.json',
            clean: true,
        }),
    ],
};
```

###### package.json

```json
{
    "scripts": {
        "start": "node ./dist/index.mjs",
        "build": "rollup -c"
    }
}
```

## Build

Build the project

`yarn build`
