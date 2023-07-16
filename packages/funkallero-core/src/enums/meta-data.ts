const META_DATA = {
    SERVICE_INJECTION: 'funkallero:service-injection',
    ARGUMENT_INJECTION: 'funkallero:argument-injection',
    CONTROLLER_ROUTES: 'funkallero:controller-routes',
    RESPONSE_HEADERS: 'funkallero:response-headers',
    CONTROLLER_PATH: 'funkallero:controller-path',
    MIDDLEWARE_AFTER: 'funkallero:middleware-after',
    MIDDLEWARE_BEFORE: 'funkallero:middleware-before',
    AUTHORIZATION_POLICIES: 'funkallero:authorization-policies',
} as const;

export type MetaDataUnion = typeof META_DATA[keyof typeof META_DATA];

export default META_DATA;
