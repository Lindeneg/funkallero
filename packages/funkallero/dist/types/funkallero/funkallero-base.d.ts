import { Application as Express } from 'express';
import { type IFunkalleroBase, type IControllerService, type IFunkalleroPartialConfiguration, type Constructor } from '@lindeneg/funkallero-core';
declare abstract class FunkalleroBase implements IFunkalleroBase {
    protected readonly config: Omit<IFunkalleroPartialConfiguration, 'setup' | 'startup'>;
    protected readonly customSetup: IFunkalleroPartialConfiguration['setup'];
    protected readonly customStartup: IFunkalleroPartialConfiguration['startup'];
    protected constructor({ setup, startup, ...config }: IFunkalleroPartialConfiguration);
    abstract start(): Promise<void>;
    protected configureController(app: Express, CustomController: Constructor<IControllerService>): void;
    protected ensureRequiredServicesRegistered(): Promise<void>;
    protected setupConfiguration(): Promise<void>;
    private ensureRegisteredSingletonService;
    private configureRouteHandler;
}
export default FunkalleroBase;
