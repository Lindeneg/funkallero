import {
    isKnownScopedServiceType,
    isKnownSingletonServiceType,
    type Constructor,
    type IScopedService,
    type ISingletonService,
    type SingletonServiceResult,
    type ScopedServiceResult,
} from '@lindeneg/funkallero-core';
import ServiceRegisterError from '../../errors/service-register-error';
import devLogger from '../../dev-logger';

const uninstantiatedSingletons = new Map<string, Constructor<ISingletonService>>();
const singletonServices = new Map<string, ISingletonService>();
const scopedServices = new Map<string, Constructor<IScopedService>>();

export const registerInstantiatedSingletonService = <TKey extends string, TService extends ISingletonService>(
    serviceKey: TKey,
    service: NonNullable<SingletonServiceResult<TService, TKey, false>>
) => {
    if (isKnownScopedServiceType(serviceKey)) {
        throw ServiceRegisterError.scopedServiceAsSingletonError(serviceKey);
    }

    devLogger(`registering instantiated singleton service ${serviceKey}`);

    singletonServices.set(serviceKey, service);
};

export const getUninstantiatedSingletons = () => uninstantiatedSingletons.entries();
export const getUninstantiatedSingleton = (id: string) => uninstantiatedSingletons.get(id);

const registerSingletonService = <TKey extends string, TService extends Constructor<ISingletonService>>(
    serviceKey: TKey,
    service: NonNullable<SingletonServiceResult<TService, TKey, true>>
) => {
    if (isKnownScopedServiceType(serviceKey)) {
        throw ServiceRegisterError.scopedServiceAsSingletonError(serviceKey);
    }

    devLogger(`registering singleton service ${serviceKey} with injections:`, service.prototype.injection);

    uninstantiatedSingletons.set(serviceKey, service);
};

const registerScopedService = <TKey extends string, TService extends Constructor<IScopedService>>(
    serviceKey: TKey,
    service: ScopedServiceResult<TService, TKey>
) => {
    if (isKnownSingletonServiceType(serviceKey)) {
        throw ServiceRegisterError.singletonServiceAsScopedError(serviceKey);
    }

    devLogger(`registering scoped service ${serviceKey} with injections:`, service?.prototype.injection);

    scopedServices.set(serviceKey, service as Constructor<IScopedService>);
};

export const getSingletonService = <TService extends ISingletonService>(serviceKey: string): TService | null => {
    const service = singletonServices.get(serviceKey);

    if (!service) return null;

    return service as TService;
};

export const getScopedService = <TService extends Constructor<IScopedService>>(serviceKey: string): TService | null => {
    const service = scopedServices.get(serviceKey);

    if (!service) return null;

    return service as TService;
};

const getService = <TService = null, TKey extends string = string>(serviceKey: TKey) => {
    const scopedService = getScopedService(serviceKey) as ScopedServiceResult<TService, TKey>;
    if (scopedService) {
        return scopedService;
    }

    const singletonService = getSingletonService(serviceKey) as SingletonServiceResult<TService, TKey>;
    if (singletonService) {
        return singletonService;
    }

    throw ServiceRegisterError.serviceNotFoundError(serviceKey);
};

const getServiceSafe = <TService = null, TKey extends string = string>(serviceKey: TKey) => {
    const scopedService = getScopedService(serviceKey) as ScopedServiceResult<TService, TKey>;
    if (scopedService) {
        return scopedService;
    }

    const singletonService = getSingletonService(serviceKey) as SingletonServiceResult<TService, TKey>;
    if (singletonService) {
        return singletonService;
    }

    return null;
};

const serviceContainer = {
    registerSingletonService,
    registerScopedService,
    getService,
    getServiceSafe,
};

export default serviceContainer;
