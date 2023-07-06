declare const SCOPED_SERVICE: Readonly<{
    AUTHORIZATION: "AUTHORIZATION";
    AUTHENTICATION: "AUTHENTICATION";
}>;
export type ScopedServiceUnion = typeof SCOPED_SERVICE[keyof typeof SCOPED_SERVICE];
export default SCOPED_SERVICE;
