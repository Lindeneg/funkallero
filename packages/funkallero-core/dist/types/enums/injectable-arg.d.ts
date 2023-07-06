declare const INJECTABLE_ARG: {
    readonly BODY: "body";
    readonly QUERY: "query";
    readonly PARAMS: "params";
    readonly HEADERS: "headers";
};
export type InjectableArgUnion = typeof INJECTABLE_ARG[keyof typeof INJECTABLE_ARG];
export default INJECTABLE_ARG;
