import type { ServiceTypeUnion } from '../enums/service-type';

interface IBaseService<TServiceType extends ServiceTypeUnion = ServiceTypeUnion> {
    type: TServiceType;
}

export default IBaseService;
