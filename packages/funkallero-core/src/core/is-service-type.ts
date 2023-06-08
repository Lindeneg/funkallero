import SINGLETON_SERVICE, { type SingletonServiceUnion } from '../enums/singleton-service';
import SCOPED_SERVICE, { type ScopedServiceUnion } from '../enums/scoped-service';
import type { ServiceTypeUnion } from '../enums/service-type';

interface ServiceType {
    type?: ServiceTypeUnion;
}

interface ServiceConstraint extends ServiceType {
    prototype?: ServiceType;
}

const isServiceType = <T extends ServiceConstraint>(service: T, type: ServiceTypeUnion): boolean => {
    return service?.type === type || service?.prototype?.type === type;
};

export const isKnownScopedServiceType = (serviceKey: string): boolean => {
    return SCOPED_SERVICE[serviceKey as ScopedServiceUnion] !== undefined;
};

export const isKnownSingletonServiceType = (serviceKey: string): boolean => {
    return SINGLETON_SERVICE[serviceKey as SingletonServiceUnion] !== undefined;
};

export default isServiceType;
