/// <reference types="node" />
/// <reference types="node" />
import type { Server as HttpsServer } from 'https';
import type { Server as HttpServer } from 'http';
import { SingletonService, type IExpressService } from '@lindeneg/funkallero-core';
type Server = HttpServer | HttpsServer;
declare class BaseExpressService extends SingletonService implements IExpressService {
    private readonly config;
    private readonly logger;
    readonly app: import("express-serve-static-core").Express;
    protected server: Server;
    private protocol;
    setup(): Promise<void>;
    startup(): void | Promise<void>;
    useJsonContentType(): void;
}
export default BaseExpressService;
