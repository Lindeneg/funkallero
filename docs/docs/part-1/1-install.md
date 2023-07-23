---
sidebar_position: 1
description: Install dependencies
---

# Install

Start by installing `funkallero-cli`. A global install is recommended.

```sh
yarn global add @lindeneg/funkallero-cli
```

## Initialize

This creates a new folder `tutorial` and scaffolds a new project within.

```sh
funkallero init tutorial --yarn
```

## Overview

The contents of `src` folder within `tutorial`, will look as such:

```sh
.
└── src
    ├── index.ts         - Main File
    ├── api              - Controllers
    ├── application      - Use Cases
    ├── enums            - Constants
    └── services         - Singleton and scoped services
```
