import {
    INJECTABLE_ARG,
    injectArgFactory as injectArgFactoryCore,
    type InjectableArgUnion,
    type TransformFn,
} from '@lindeneg/funkallero-core';
import { ensureStringArray } from './shared';

interface IInjectConfig {
    schema: Record<any, any> | null;
    fn: TransformFn | null;
    properties: string | string[];
}

type ArgUnionCore = string | string[] | TransformFn;
type ArgUnion = ArgUnionCore | Record<any, any>;

const handleArgs = (config: IInjectConfig, ...args: Array<ArgUnion | undefined>) => {
    for (const arg of args) {
        if (typeof arg === 'object') {
            config.schema = arg;
        } else if (typeof arg === 'string' || Array.isArray(arg)) {
            config.properties = arg;
        } else if (typeof arg === 'function') {
            config.fn = arg;
        }
    }
};

const injectFactory = (injectableArg: InjectableArgUnion) => {
    return function (arg1?: ArgUnion, arg2?: ArgUnion, arg3?: ArgUnion) {
        const config: IInjectConfig = {
            schema: null,
            fn: null,
            properties: [],
        };

        handleArgs(config, arg1, arg2, arg3);

        return injectArgFactoryCore(injectableArg, config.schema, ensureStringArray(config.properties), config.fn);
    };
};

export const body = injectFactory(INJECTABLE_ARG.BODY);
export const query = injectFactory(INJECTABLE_ARG.QUERY);
export const params = injectFactory(INJECTABLE_ARG.PARAMS);
export const headers = injectFactory(INJECTABLE_ARG.HEADERS);
