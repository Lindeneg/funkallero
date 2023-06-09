import SERVICE_TYPE from '../enums/service-type';
import type IBaseService from './base-service';

export interface ISingletonService extends IBaseService<typeof SERVICE_TYPE.SINGLETON> {}

abstract class SingletonService implements ISingletonService {
    public readonly type = SERVICE_TYPE.SINGLETON;
}

(SingletonService.prototype as any).type = SERVICE_TYPE.SINGLETON;

export default SingletonService;
