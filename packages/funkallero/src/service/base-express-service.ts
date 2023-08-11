import type { Server as HttpsServer } from 'https';
import type { Server as HttpServer } from 'http';
import express from 'express';
import {
    SERVICE,
    injectService,
    HttpException,
    SingletonService,
    type IExpressService,
    type ILoggerService,
    type IConfigurationService,
} from '@lindeneg/funkallero-core';

type Server = HttpServer | HttpsServer;

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
        const url = `${this.protocol}://localhost:${this.config.port}`;

        this.server.listen(this.config.port, () => {
            this.logger.info(`Server listening on ${url}`);
        });
    }

    public onLastRouteAdded() {
        this.app.use((req, _, next) => {
            if (!!this.config.basePath && !req.path.startsWith(this.config.basePath)) {
                (req as any)._funkallero = { html: true };
            }

            next(HttpException.notFound());
        });
    }
}

export default BaseExpressService;
