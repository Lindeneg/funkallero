class ServiceRegisterError extends Error {
    constructor(message: string) {
        super(message);
    }

    public static scopedServiceAsSingletonError(serviceKey: string) {
        return new ServiceRegisterError(`Cannot register scoped service ${serviceKey} as singleton`);
    }

    public static singletonServiceAsScopedError(serviceKey: string) {
        return new ServiceRegisterError(`Cannot register singleton service ${serviceKey} as scoped`);
    }

    public static serviceNotFoundError(serviceKey: string) {
        return new ServiceRegisterError(`Service with key ${serviceKey} not found`);
    }
}

export default ServiceRegisterError;
