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

        const errCode = err?.statusCode || 500;
        const isHtmlResponse = !!req._funkallero?.html;

        this.logger.error({
            msg: `${errCode} ${req.method.toUpperCase()}: ${req.originalUrl}`,
            source: 'BaseRequestErrorHandlerService',
            requestId: req.id,
            isHtmlResponse,
            error: err,
        });

        if (isHtmlResponse) {
            this.logger.info('sending html error response on ' + req.id);
            return res.status(errCode).send(`<h1>${errCode} Something went wrong. Please try again.</h1>`);
        }

        if (err instanceof HttpException) {
            res.status(errCode).json(err.toResponse());
        } else {
            res.status(errCode).json({
                message: 'Something went wrong. Please try again.',
            });
        }
    }
}

export default BaseRequestErrorHandlerService;
