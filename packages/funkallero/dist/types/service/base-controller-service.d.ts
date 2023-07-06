import { ControllerService, type MediatorResult, type ILoggerService } from '@lindeneg/funkallero-core';
import type BaseMediatorService from './base-mediator-service';
declare class BaseControllerService<TMediator extends BaseMediatorService<any>> extends ControllerService {
    protected readonly mediator: TMediator;
    protected readonly logger: ILoggerService;
    handleResult(result: MediatorResult): Promise<void>;
    private handleError;
}
export default BaseControllerService;
