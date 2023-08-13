import { SERVICE, type IFunkalleroPartialConfiguration } from '@lindeneg/funkallero-core';
import controllerContainer from '../container/controller-container';
import serviceContainer, { getUninstantiatedSingleton } from '../container/service-container';
import publicServiceRegister from '../container/service-container/public-service-register';
import publicServiceGetter from '../container/service-container/public-service-getter';
import RequiredServiceMissingError from '../errors/required-service-missing-error';
import NoControllersFoundError from '../errors/no-controllers-found-error';
import SingletonDependencyInjection from '../injection/singleton-dependency-injection';
import FunkalleroBase from './funkallero-base';

class Funkallero extends FunkalleroBase {
    private constructor(config: IFunkalleroPartialConfiguration) {
        super(config);
    }

    public async start() {
        if (typeof this.customStartup === 'function') {
            await this.customStartup(publicServiceGetter);
        }

        const expressService = serviceContainer.getService(SERVICE.EXPRESS);

        await expressService.startup();
    }

    private async setup() {
        await this.customSetup(publicServiceRegister);

        await this.ensureRequiredServicesRegistered();

        this.checkRegistryForRequiredServices();

        await new SingletonDependencyInjection().inject();

        await this.setupConfiguration();

        const expressService = serviceContainer.getService(SERVICE.EXPRESS);
        const app = expressService.app;

        await expressService.setup();

        const controllers = controllerContainer.getAll();

        if (controllers.length === 0) {
            throw new NoControllersFoundError();
        }

        const logger = serviceContainer.getService(SERVICE.LOGGER);
        const versioning = serviceContainer.getService(SERVICE.VERSIONING);
        const configureController = this.configureController.bind(this, app, logger, versioning);

        await Promise.all(controllers.map((Controller) => configureController(Controller)));

        if (expressService.onLastRouteAdded) await expressService.onLastRouteAdded();

        app.use((err: any, req: any, res: any, next: any) => {
            const errorHandlerService = serviceContainer.getService(SERVICE.ERROR_HANDLER);
            errorHandlerService.handler(err, req, res, next);
        });
    }

    private checkRegistryForRequiredServices() {
        const dataContext = getUninstantiatedSingleton(SERVICE.DATA_CONTEXT);

        if (!dataContext) throw new RequiredServiceMissingError(SERVICE.DATA_CONTEXT);

        const mediator = getUninstantiatedSingleton(SERVICE.MEDIATOR);

        if (!mediator) throw new RequiredServiceMissingError(SERVICE.MEDIATOR);
    }

    public static async create(config: IFunkalleroPartialConfiguration): Promise<Funkallero> {
        const funkallero = new Funkallero(config);

        await funkallero.setup();

        return funkallero;
    }
}

export default Funkallero;
