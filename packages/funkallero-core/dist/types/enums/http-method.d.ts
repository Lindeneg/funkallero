declare const HTTP_METHOD: Readonly<{
    GET: "get";
    POST: "post";
    PUT: "put";
    PATCH: "patch";
    DELETE: "delete";
}>;
export type HttpMethodUnion = typeof HTTP_METHOD[keyof typeof HTTP_METHOD];
export default HTTP_METHOD;
