import state from './state';

export const checkFlag = (flag: string, val: string): boolean => {
    return flag === val || '--' + flag === val;
};

export const hasFlag = (flag: string, args = state.get()): boolean => {
    for (const entry of args) {
        if (checkFlag(flag, entry)) return true;
    }
    return false;
};

export const getFlagValue = (flag: string, args = state.get()): string | null => {
    for (let i = 0; i < args.length; i++) {
        const entry = args[i];
        const nextIdx = i + 1;

        if (nextIdx < args.length && checkFlag(flag, entry)) {
            return args[nextIdx];
        }
    }

    return null;
};

export const parseOptionals = <T extends string>(properties?: T[], usePropertiesAsArgs = false): Record<T, boolean> => {
    const args = usePropertiesAsArgs ? properties : state.get();

    return (properties || []).reduce((a, c) => {
        if (hasFlag(c, args)) a[c.replace(/-/g, '') as T] = true;
        return a;
    }, {} as Record<T, boolean>);
};
