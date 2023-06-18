const META_DATA = {
    SERVICE_INJECTION: 'funkallero:service-injection',
    ARGUMENT_INJECTION: 'funkallero:argument-injection',
    CONTROLLER_ROUTES: 'funkallero:controller-routes',
    CONTROLLER_PATH: 'funkallero:controller-path',
} as const;

export type MetaDataUnion = typeof META_DATA[keyof typeof META_DATA];

export default META_DATA;
