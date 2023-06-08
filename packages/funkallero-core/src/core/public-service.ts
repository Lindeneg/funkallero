import type { ScopedServiceResult, SingletonServiceResult } from './known-service';
import type { IScopedService } from '../service/scoped-service';
import type { ISingletonService } from '../service/singleton-service';
import type { Constructor } from '../types';

export type PublicServiceGetter = {
    readonly getSingletonService: <TService extends ISingletonService>(serviceKey: string) => TService | null;
};

export type PublicServiceRegister = {
    readonly registerScopedService: <TKey extends string, TService extends Constructor<IScopedService>>(
        serviceKey: TKey,
        service: ScopedServiceResult<TService, TKey>
    ) => void;
    readonly registerSingletonService: <TKey extends string, TService extends Constructor<ISingletonService>>(
        serviceKey: TKey,
        service: NonNullable<SingletonServiceResult<TService, TKey, true>>
    ) => void;
};
