import SERVICE_TYPE from '../enums/service-type';
import type IBaseService from './base-service';
export interface ISingletonService extends IBaseService<typeof SERVICE_TYPE.SINGLETON> {
}
declare abstract class SingletonService implements ISingletonService {
    readonly type: "SINGLETON";
}
export default SingletonService;
