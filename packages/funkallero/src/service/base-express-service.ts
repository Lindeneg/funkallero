import type { Server } from 'https';
import express, { type RequestHandler, type Express } from 'express';
import urlJoin from 'url-join';
import {
    SERVICE,
    injectService,
    SingletonService,
    type IExpressService,
    type ILoggerService,
    type IConfigurationService,
} from '@lindeneg/funkallero-core';

const setJsonContentTypeMiddleware: RequestHandler = (_, res, next) => {
    res.set('Content-Type', 'application/json');
    next();
};

class BaseExpressService extends SingletonService implements IExpressService {
    @injectService(SERVICE.CONFIGURATION)
    private readonly config: IConfigurationService;

    @injectService(SERVICE.LOGGER)
    private readonly logger: ILoggerService;

    public readonly app = express();

    private server: Server | Express;

    public async setup() {
        this.app.use(express.json());

        if (this.config.https) {
            const https = await import('https');
            this.server = https.createServer(this.config.https, this.app);
        } else {
            this.server = this.app;
        }
    }

    public startup(): void | Promise<void> {
        const protocol = this.config.https ? 'https' : 'http';
        const url = urlJoin(`${protocol}://localhost:${this.config.port}`, this.config.basePath);

        this.server.listen(this.config.port, () => {
            this.logger.info(`Server listening on ${url}`);
        });
    }

    public useJsonContentType() {
        this.app.use(setJsonContentTypeMiddleware);
    }
}

export default BaseExpressService;
