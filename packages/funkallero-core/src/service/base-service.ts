import type { ServiceTypeUnion } from '../enums/service-type';
import type { InjectionContext } from '../types';

interface IBaseService<TServiceType extends ServiceTypeUnion = ServiceTypeUnion> {
    injection: InjectionContext;
    type: TServiceType;
}

export default IBaseService;
