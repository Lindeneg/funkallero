const INJECTABLE_ARG = {
    BODY: 'body',
    QUERY: 'query',
    PARAMS: 'params',
    HEADERS: 'headers',
} as const;

export type InjectableArgUnion = typeof INJECTABLE_ARG[keyof typeof INJECTABLE_ARG];

export default INJECTABLE_ARG;
