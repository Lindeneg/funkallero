import type { ScaffoldPackageManager } from './types';

const createPackageManager = (implementation: Omit<ScaffoldPackageManager, 'construct'>): ScaffoldPackageManager => {
    const add = `${implementation.name} ${implementation.addCommand}`;
    const addDev = `${add} ${implementation.devFlag}`;
    const addPeer = `${add} ${implementation.peerFlag}`;
    return {
        ...implementation,
        construct: {
            add,
            addDev,
            addPeer,
            addExact: `${add} ${implementation.exactFlag}`,
            addExactDev: `${addDev} ${implementation.exactFlag}`,
            addExactPeer: `${addPeer} ${implementation.exactFlag}`,
            install: `${implementation.name} ${implementation.installCommand}`,
            run: `${implementation.name} ${implementation.runCommand}`,
        },
    };
};

export default createPackageManager;
