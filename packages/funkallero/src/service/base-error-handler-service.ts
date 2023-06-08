import {
    SERVICE,
    SingletonService,
    HttpException,
    injectService,
    type IExpressErrorhandlerService,
    type ExpressErrorHandlerFnArgs,
    type ILoggerService,
} from '@lindeneg/funkallero-core';

class BaseRequestErrorHandlerService extends SingletonService implements IExpressErrorhandlerService {
    @injectService(SERVICE.LOGGER)
    private readonly logger: ILoggerService;

    public handler(...[err, req, res, next]: ExpressErrorHandlerFnArgs) {
        if (res.headersSent) return next(err);

        this.logger.error({
            msg: `${err?.statusCode || 500} ${req.method.toUpperCase()}: ${req.originalUrl}`,
            source: 'BaseRequestErrorHandlerService',
            requestId: req.id,
            error: err,
        });

        if (err instanceof HttpException) {
            res.status(err.statusCode).json(err.toResponse());
        } else {
            res.status(500).json({
                message: 'Something went wrong. Please try again.',
            });
        }
    }
}

export default BaseRequestErrorHandlerService;
