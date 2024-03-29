---
sidebar_position: 1
description: Install dependencies
---

# Install

Start by installing `funkallero-cli`. A global install is recommended.

```bash
npm install -g @lindeneg/funkallero-cli
```

## Initialize

This creates a new folder `tutorial` and scaffolds a basic project within.

```
funkallero init tutorial --yarn
```

## Overview

The contents of `src` folder within `tutorial`, will look as such:

```
.
└── src
    ├── index.ts         - Main File
    ├── api              - Controllers
    ├── application      - Use Cases
    ├── enums            - Constants
    └── services         - Singleton and scoped services
```
