import {
    SERVICE,
    ACTION_RESULT,
    injectService,
    HttpException,
    ControllerService,
    type MediatorResult,
    type MediatorResultSuccess,
    type ILoggerService,
} from '@lindeneg/funkallero-core';
import type BaseMediatorService from './base-mediator-service';

class BaseControllerService<TMediator extends BaseMediatorService<any>> extends ControllerService {
    @injectService(SERVICE.MEDIATOR)
    protected readonly mediator: TMediator;

    @injectService(SERVICE.LOGGER)
    protected readonly logger: ILoggerService;

    // just a default implementation, meant to be overridden..
    public async handleResult(result: MediatorResult): Promise<void> {
        if (!result.success) {
            return this.handleError(result.error);
        }

        if (result.context === ACTION_RESULT.CONTEXT_WRITE) {
            this.handleWrite(result);
        } else {
            const hasPayload = !!result.value;

            let statusCode: number = 200;

            if (result.context === ACTION_RESULT.SUCCESS_CREATE) {
                statusCode = 201;
            }

            if (
                !hasPayload &&
                (result.context === ACTION_RESULT.SUCCESS_UPDATE || result.context === ACTION_RESULT.SUCCESS_DELETE)
            ) {
                statusCode = 204;
            }

            this.logger.verbose({
                msg: 'request handled successfully',
                statusCode,
                requestId: this.request.id,
            });

            this.response.status(statusCode);

            if (hasPayload) {
                this.response.json(result.value);
            }
        }

        this.response.end();
    }

    public handleWrite<TResult>(result: MediatorResultSuccess<TResult>): void {
        if (result.value) {
            this.response.write(result.value);
        }
    }

    private async handleError(err: string) {
        switch (err) {
            case ACTION_RESULT.ERROR_BAD_PAYLOAD:
                throw HttpException.malformedBody();
            case ACTION_RESULT.ERROR_UNAUTHORIZED:
                throw HttpException.unauthorized();
            case ACTION_RESULT.ERROR_UNAUTHENTICATED:
                throw HttpException.forbidden();
            case ACTION_RESULT.ERROR_NOT_FOUND:
                throw HttpException.notFound();
            case ACTION_RESULT.ERROR_UNPROCESSABLE:
                throw HttpException.unprocessable();
            default:
                throw HttpException.internal();
        }
    }
}

export default BaseControllerService;
