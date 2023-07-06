declare class AuthServiceNotFoundError extends Error {
    constructor(routePath: string, service?: string);
}
export default AuthServiceNotFoundError;
