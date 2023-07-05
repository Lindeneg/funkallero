import type { Server as HttpsServer } from 'https';
import type { Server as HttpServer } from 'http';
import express, { type RequestHandler } from 'express';
import urlJoin from 'url-join';
import {
    SERVICE,
    injectService,
    SingletonService,
    type IExpressService,
    type ILoggerService,
    type IConfigurationService,
} from '@lindeneg/funkallero-core';

type Server = HttpServer | HttpsServer;

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

    protected server: Server;
    private protocol: 'http' | 'https' = 'http';

    public async setup() {
        this.app.use(express.json());

        if (this.config.https) {
            this.protocol = 'https';
            const https = await import('https');
            this.server = https.createServer(this.config.https, this.app);
        } else {
            const http = await import('http');
            this.server = http.createServer(this.app);
        }
    }

    public startup(): void | Promise<void> {
        const url = urlJoin(`${this.protocol}://localhost:${this.config.port}`, this.config.basePath);

        this.server.listen(this.config.port, () => {
            this.logger.info(`Server listening on ${url}`);
        });
    }

    public useJsonContentType() {
        this.app.use(setJsonContentTypeMiddleware);
    }
}

export default BaseExpressService;
