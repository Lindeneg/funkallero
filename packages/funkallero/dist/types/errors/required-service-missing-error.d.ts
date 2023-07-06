declare class RequiredServiceMissingError extends Error {
    constructor(serviceName: string);
}
export default RequiredServiceMissingError;
