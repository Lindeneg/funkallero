import {
    SERVICE,
    SingletonService,
    HttpException,
    injectService,
    type Response,
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

        if (isHtmlResponse) return this.handleHtmlResponse(err, res, errCode);

        return this.handleJsonResponse(err, res, errCode);
    }

    private async handleHtmlResponse(err: any, res: Response, errCode: number) {
        if (err instanceof HttpException) {
            return res.status(errCode).send(await err.toHtml());
        }

        return res.status(errCode).send(`<h1>${errCode} Something went wrong..</h1>`);
    }

    private handleJsonResponse(err: any, res: Response, errCode: number) {
        if (err instanceof HttpException) {
            return res.status(errCode).json(err.toResponse());
        }

        return res.status(errCode).json({
            message: 'Something went wrong. Please try again.',
        });
    }
}

export default BaseRequestErrorHandlerService;
