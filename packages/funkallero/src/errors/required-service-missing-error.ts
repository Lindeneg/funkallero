class RequiredServiceMissingError extends Error {
    constructor(serviceName: string) {
        super(`Required service ${serviceName} is missing. Did you forget to register it?`);
    }
}

export default RequiredServiceMissingError;
