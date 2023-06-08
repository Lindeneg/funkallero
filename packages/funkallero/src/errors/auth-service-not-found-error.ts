class AuthServiceNotFoundError extends Error {
    constructor(policyName: string, routePath: string) {
        super(`No authorization service registered but ${policyName} policy is consumed by ${routePath}`);
    }
}

export default AuthServiceNotFoundError;
