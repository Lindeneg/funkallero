import SERVICE_TYPE from '../enums/service-type';
import type IBaseService from './base-service';
import type { Request } from '../types';
export interface IScopedService extends IBaseService<typeof SERVICE_TYPE.SCOPED> {
}
declare abstract class ScopedService implements IScopedService {
    readonly type: "SCOPED";
    protected readonly request: Request;
}
export default ScopedService;
