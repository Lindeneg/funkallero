import { Application as Express, Router } from 'express';
import urlJoin from 'url-join';
import {
    devLogger,
    META_DATA,
    SERVICE,
    LOG_LEVEL,
    type IFunkalleroBase,
    type IControllerService,
    type IFunkalleroPartialConfiguration,
    type Constructor,
    type IRoute,
    type Request,
    type Response,
} from '@lindeneg/funkallero-core';
import serviceContainer, { getUninstantiatedSingleton } from '../container/service-container';
import RouteHandler from './route-handler';
import BaseConfigurationService from '../service/base-configuration-service';
import BaseLoggerService from '../service/base-logger-service';
import BaseExpressService from '../service/base-express-service';
import BaseRequestErrorHandlerService from '../service/base-error-handler-service';

abstract class FunkalleroBase implements IFunkalleroBase {
    protected readonly config: Omit<IFunkalleroPartialConfiguration, 'setup' | 'startup'>;
    protected readonly customSetup: IFunkalleroPartialConfiguration['setup'];
    protected readonly customStartup: IFunkalleroPartialConfiguration['startup'];

    protected constructor({ setup, startup, ...config }: IFunkalleroPartialConfiguration) {
        this.config = config;
        this.customSetup = setup;
        this.customStartup = startup;
    }

    public abstract start(): Promise<void>;

    protected configureController(app: Express, CustomController: Constructor<IControllerService>) {
        const routes: IRoute[] = Reflect.get(CustomController.prototype, META_DATA.CONTROLLER_ROUTES);
        const controllerPath: string = Reflect.get(CustomController, META_DATA.CONTROLLER_PATH);
        const basePath = urlJoin(this.config?.basePath || '/', controllerPath);

        devLogger(`configuring ${CustomController.name} with baseRoute ${basePath}`);

        for (const route of routes) {
            const router = Router(route.routerOptions);
            const routePath = urlJoin(basePath, route.path);

            this.configureRouteHandler(router, CustomController, route, routePath);

            devLogger(
                `registering route ${route.method.toUpperCase()} ${routePath} on controller ${CustomController.name}`
            );

            app.use(basePath, router);
        }
    }

    protected async ensureRequiredServicesRegistered() {
        await Promise.all([
            this.ensureRegisteredSingletonService(SERVICE.CONFIGURATION, BaseConfigurationService),
            this.ensureRegisteredSingletonService(SERVICE.LOGGER, BaseLoggerService),
            this.ensureRegisteredSingletonService(SERVICE.EXPRESS, BaseExpressService),
            this.ensureRegisteredSingletonService(SERVICE.ERROR_HANDLER, BaseRequestErrorHandlerService),
        ]);
    }

    protected async setupConfiguration() {
        const configService = serviceContainer.getService<any>(SERVICE.CONFIGURATION);

        configService.port = this.config.port || 3000;
        configService.basePath = this.config.basePath || '/';
        configService.logLevel =
            !this.config.logLevel && this.config.logLevel !== LOG_LEVEL.ERROR ? LOG_LEVEL.INFO : this.config.logLevel;
        configService.https =
            typeof this.config.https === 'function' ? await this.config.https() : this.config.https || null;
        configService.globalHeaders = this.config.globalHeaders || null;
        configService.meta = this.config.meta || {};

        const { type, injection, ...config } = configService;
        devLogger('configuration service', config);
    }

    private async ensureRegisteredSingletonService(serviceKey: string, BaseService: Constructor<any>) {
        const Service = getUninstantiatedSingleton(serviceKey);

        if (!Service) {
            devLogger(`using default ${serviceKey} service`);
            serviceContainer.registerSingletonService(serviceKey, BaseService);
        }
    }

    private configureRouteHandler(
        router: Router,
        CustomController: Constructor<IControllerService>,
        route: IRoute,
        routePath: string
    ) {
        router[route.method](route.path, async (request, response, next) => {
            await new RouteHandler(
                CustomController,
                route,
                routePath,
                request as Request,
                response as Response,
                next
            ).handle();
        });
    }
}

export default FunkalleroBase;
