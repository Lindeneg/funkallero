class AuthServiceNotFoundError extends Error {
    constructor(routePath: string, service = 'authorization') {
        super(`No ${service} service registered yet it is consumed by ${routePath}`);
    }
}

export default AuthServiceNotFoundError;
