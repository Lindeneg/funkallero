declare class ServiceRegisterError extends Error {
    constructor(message: string);
    static scopedServiceAsSingletonError(serviceKey: string): ServiceRegisterError;
    static singletonServiceAsScopedError(serviceKey: string): ServiceRegisterError;
    static serviceNotFoundError(serviceKey: string): ServiceRegisterError;
}
export default ServiceRegisterError;
