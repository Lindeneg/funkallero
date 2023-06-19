import {
    INJECTABLE_ARG,
    InjectableArgUnion,
    TransformFn,
    injectArgFactory as injectArgFactoryCore,
} from '@lindeneg/funkallero-core';
import { z } from 'zod';

const injectConfigSchema = z.object({
    schema: z.any().nullable().optional(),
    fn: z.function().nullable().optional(),
    properties: z.union([z.string(), z.array(z.string())]).optional(),
});

type InjectConfig = z.infer<typeof injectConfigSchema>;

type ArgUnionCore = string | string[] | TransformFn;
type ArgUnion = ArgUnionCore | InjectConfig | Record<any, any>;

const ensureArray = (properties?: string | string[]): string[] => {
    if (!properties) return [];
    if (typeof properties === 'string') return [properties];
    return properties;
};

const handleArg = (config: Required<InjectConfig>, arg?: ArgUnion) => {
    if (typeof arg === 'object') {
        // if arg is object, assume it can either be InjectConfig or a validation schema
        const result = injectConfigSchema.safeParse(arg);

        if (result.success) {
            config.schema = result.data.schema || null;
            config.fn = result.data.fn || null;
            config.properties = result.data.properties || [];
        } else {
            config.schema = arg;
        }
    } else if (typeof arg === 'string' || Array.isArray(arg)) {
        config.properties = arg;
    } else if (typeof arg === 'function') {
        config.fn = arg;
    }
};

const injectFactory = (injectableArg: InjectableArgUnion) => {
    return function (arg1?: ArgUnion, arg2?: ArgUnion) {
        const config: Required<InjectConfig> = {
            schema: null,
            fn: null,
            properties: [],
        };

        if (arg1) handleArg(config, arg1);
        if (arg2) handleArg(config, arg2);

        return injectArgFactoryCore(injectableArg, config.schema, ensureArray(config.properties), config.fn);
    };
};

export const body = injectFactory(INJECTABLE_ARG.BODY);
export const query = injectFactory(INJECTABLE_ARG.QUERY);
export const params = injectFactory(INJECTABLE_ARG.PARAMS);
export const headers = injectFactory(INJECTABLE_ARG.HEADERS);
