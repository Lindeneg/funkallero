declare const META_DATA: {
    readonly SERVICE_INJECTION: "funkallero:service-injection";
    readonly ARGUMENT_INJECTION: "funkallero:argument-injection";
    readonly CONTROLLER_ROUTES: "funkallero:controller-routes";
    readonly CONTROLLER_PATH: "funkallero:controller-path";
    readonly MIDDLEWARE_AFTER: "funkallero:middleware-after";
    readonly MIDDLEWARE_BEFORE: "funkallero:middleware-before";
    readonly AUTHORIZATION_POLICIES: "funkallero:authorization-policies";
};
export type MetaDataUnion = typeof META_DATA[keyof typeof META_DATA];
export default META_DATA;
