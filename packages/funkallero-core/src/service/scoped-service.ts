import SERVICE_TYPE from '../enums/service-type';
import type IBaseService from './base-service';
import type { Request } from '../types';

export interface IScopedService extends IBaseService<typeof SERVICE_TYPE.SCOPED> {}

abstract class ScopedService implements IScopedService {
    public readonly type = SERVICE_TYPE.SCOPED;

    protected readonly request: Request;
}

(ScopedService.prototype as any).type = SERVICE_TYPE.SCOPED;

export default ScopedService;
