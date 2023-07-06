import type { ServiceTypeUnion } from '../enums/service-type';
interface ServiceType {
    type?: ServiceTypeUnion;
}
interface ServiceConstraint extends ServiceType {
    prototype?: ServiceType;
}
declare const isServiceType: <T extends ServiceConstraint>(service: T, type: ServiceTypeUnion) => boolean;
export declare const isKnownScopedServiceType: (serviceKey: string) => boolean;
export declare const isKnownSingletonServiceType: (serviceKey: string) => boolean;
export default isServiceType;
