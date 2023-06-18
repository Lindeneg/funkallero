import { INJECTABLE_ARG, injectArgFactory } from '@lindeneg/funkallero-core';

const ensureArray = (properties: string | string[]): string[] => {
    if (typeof properties === 'string') return [properties];
    return properties;
};

export function body<TSchema>(schema: TSchema | null = null, properties: string | string[] = []) {
    return injectArgFactory(INJECTABLE_ARG.BODY, schema, ensureArray(properties));
}

export function query<TSchema>(schema: TSchema | null = null, properties: string | string[] = []) {
    return injectArgFactory(INJECTABLE_ARG.QUERY, schema, ensureArray(properties));
}

export function params<TSchema>(schema: TSchema | null = null, properties: string | string[] = []) {
    return injectArgFactory(INJECTABLE_ARG.PARAMS, schema, ensureArray(properties));
}

export function headers<TSchema>(schema: TSchema | null = null, properties: string | string[] = []) {
    return injectArgFactory(INJECTABLE_ARG.HEADERS, schema, ensureArray(properties));
}
