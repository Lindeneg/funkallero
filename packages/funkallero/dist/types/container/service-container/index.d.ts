import { type Constructor, type IScopedService, type ISingletonService, type SingletonServiceResult, type ScopedServiceResult } from '@lindeneg/funkallero-core';
export declare const registerInstantiatedSingletonService: <TKey extends string, TService extends ISingletonService>(serviceKey: TKey, service: NonNullable<SingletonServiceResult<TService, TKey, false>>) => void;
export declare const getUninstantiatedSingletons: () => IterableIterator<[string, Constructor<ISingletonService>]>;
export declare const getUninstantiatedSingleton: (id: string) => Constructor<ISingletonService> | undefined;
export declare const getSingletonService: <TService extends ISingletonService>(serviceKey: string) => TService | null;
export declare const getScopedService: <TService extends Constructor<IScopedService>>(serviceKey: string) => TService | null;
declare const serviceContainer: {
    registerSingletonService: <TKey extends string, TService extends Constructor<ISingletonService>>(serviceKey: TKey, service: NonNullable<SingletonServiceResult<TService, TKey, true>>) => void;
    registerScopedService: <TKey_1 extends string, TService_1 extends Constructor<IScopedService>>(serviceKey: TKey_1, service: ScopedServiceResult<TService_1, TKey_1>) => void;
    getService: <TService_2 = null, TKey_2 extends string = string>(serviceKey: TKey_2) => NonNullable<ScopedServiceResult<TService_2, TKey_2>> | NonNullable<SingletonServiceResult<TService_2, TKey_2, false>>;
    getServiceSafe: <TService_3 = null, TKey_3 extends string = string>(serviceKey: TKey_3) => NonNullable<ScopedServiceResult<TService_3, TKey_3>> | NonNullable<SingletonServiceResult<TService_3, TKey_3, false>> | null;
};
export default serviceContainer;
