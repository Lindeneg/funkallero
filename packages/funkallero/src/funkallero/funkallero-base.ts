import { Router, type Application as Express } from 'express';
import urlJoin from 'url-join';
import {
    devLogger,
    META_DATA,
    SERVICE,
    LOG_LEVEL,
    HttpException,
    type IFunkalleroBase,
    type IControllerService,
    type IFunkalleroPartialConfiguration,
    type Constructor,
    type IRoute,
    type Request,
    type Response,
    type ILoggerService,
    type IVersioningService,
} from '@lindeneg/funkallero-core';
import serviceContainer, { getUninstantiatedSingleton } from '../container/service-container';
import RouteHandler from './route-handler';
import BaseConfigurationService from '../service/base-configuration-service';
import BaseLoggerService from '../service/base-logger-service';
import BaseExpressService from '../service/base-express-service';
import BaseRequestErrorHandlerService from '../service/base-error-handler-service';
import BaseVersioningService from '../service/base-versioning-service';

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

    protected async configureController(
        app: Express,
        logger: ILoggerService,
        versioningService: IVersioningService,
        CustomController: Constructor<IControllerService>
    ) {
        const routes: IRoute[] = Reflect.get(CustomController.prototype, META_DATA.CONTROLLER_ROUTES);
        const controllerPath: string = Reflect.get(CustomController, META_DATA.CONTROLLER_PATH);
        const controllerVersion: string | null = Reflect.get(CustomController, META_DATA.CONTROLLER_VERSION);

        devLogger(`configuring ${CustomController.name} with path ${controllerPath}`);

        for (const route of routes) {
            const router = Router(route.routerOptions);
            const { routePath, basePath, version } = await versioningService.getPathContext(
                route,
                controllerPath,
                controllerVersion
            );

            this.configureRouteHandler(
                router,
                CustomController,
                controllerPath,
                controllerVersion,
                route,
                routes,
                routePath,
                versioningService
            );

            devLogger(`resolved basePath for ${CustomController.name} on ${route.handlerKey} is ${basePath}`);

            const versionString = version ? `WITH ${version}` : '';

            const loggedRoutePath = !basePath && !routePath ? '/' : urlJoin(basePath, routePath);

            logger.info(`${route.method.toUpperCase()} ${loggedRoutePath} ${versionString}`);

            app.use(basePath, router);
        }
    }

    protected async ensureRequiredServicesRegistered() {
        await Promise.all([
            this.ensureRegisteredSingletonService(SERVICE.CONFIGURATION, BaseConfigurationService),
            this.ensureRegisteredSingletonService(SERVICE.LOGGER, BaseLoggerService),
            this.ensureRegisteredSingletonService(SERVICE.EXPRESS, BaseExpressService),
            this.ensureRegisteredSingletonService(SERVICE.ERROR_HANDLER, BaseRequestErrorHandlerService),
            this.ensureRegisteredSingletonService(SERVICE.VERSIONING, BaseVersioningService),
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
        configService.versioning = this.config.versioning || null;
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
        customControllerPath: string,
        customControllerVersion: string | null,
        route: IRoute,
        routes: IRoute[],
        routePath: string,
        versioningService: IVersioningService
    ) {
        router[route.method](routePath, async (request, response, next) => {
            if (!this.config.versioning || this.config.versioning.type !== 'header') {
                return new RouteHandler(
                    CustomController,
                    route,
                    routePath,
                    request as Request,
                    response as Response,
                    next
                ).handle();
            }

            const version = request.headers[this.config.versioning.headerName];

            const result = await versioningService.getContextFromHeaderVersioning(
                CustomController,
                customControllerPath,
                customControllerVersion,
                version?.toString() || null,
                route,
                routes
            );

            if (result instanceof HttpException) return next(result);

            return new RouteHandler(
                result.CustomController,
                result.route,
                result.route.path,
                request as Request,
                response as Response,
                next
            ).handle();
        });
    }
}

export default FunkalleroBase;
