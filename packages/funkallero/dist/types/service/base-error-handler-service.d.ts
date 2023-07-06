import { SingletonService, type IExpressErrorhandlerService, type ExpressErrorHandlerFnArgs } from '@lindeneg/funkallero-core';
declare class BaseRequestErrorHandlerService extends SingletonService implements IExpressErrorhandlerService {
    private readonly logger;
    handler(...[err, req, res, next]: ExpressErrorHandlerFnArgs): void;
}
export default BaseRequestErrorHandlerService;
