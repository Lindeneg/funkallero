import SINGLETON_SERVICE, { type SingletonServiceUnion } from './singleton-service';
import SCOPED_SERVICE, { type ScopedServiceUnion } from './scoped-service';

const SERVICE = Object.freeze({
    ...SINGLETON_SERVICE,
    ...SCOPED_SERVICE,
});

export type ServiceUnion = ScopedServiceUnion | SingletonServiceUnion;

export default SERVICE;
