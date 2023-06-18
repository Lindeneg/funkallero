import { randomUUID } from 'crypto';
import { Application as Express, Router } from 'express';
import urlJoin from 'url-join';
import {
    META_DATA,
    SERVICE,
    LOG_LEVEL,
    HttpException,
    type IArgumentInjection,
    type IFunkalleroBase,
    type ILoggerService,
    type IControllerService,
    type IAuthorizationService,
    type IFunkalleroPartialConfiguration,
    type Constructor,
    type ControllerFn,
    type IRoute,
    type Request,
    type Validation,
    type InjectableArgUnion,
} from '@lindeneg/funkallero-core';
import devLogger from '../dev-logger';
import serviceContainer, { getUninstantiatedSingleton } from '../container/service-container';
import AuthServiceNotFoundError from '../errors/auth-service-not-found-error';
import ControllerDependencyInjection from '../injection/controller-dependency-injection';
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
        const basePath = urlJoin(this.config?.basePath || '', controllerPath);

        devLogger(`configuring ${CustomController.name} with baseRoute ${basePath}`);

        for (const route of routes) {
            const router = Router();
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

    protected setupConfiguration() {
        const configService = serviceContainer.getService<any>(SERVICE.CONFIGURATION);

        configService.port = this.config.port || 3000;
        configService.basePath = this.config.basePath || '';
        configService.logLevel =
            !this.config.logLevel && this.config.logLevel !== LOG_LEVEL.ERROR ? LOG_LEVEL.INFO : this.config.logLevel;
        configService.https = this.config.https || null;
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
        router[route.method](route.path, async (_request, response, next) => {
            const request = this.configureRequest(_request as Request);
            const logger = serviceContainer.getService(SERVICE.LOGGER);

            const hasAuthPolicy = route.authorizationPolicy.length > 0;
            const argumentInjections = Object.entries(
                (Reflect.get(CustomController.prototype, META_DATA.ARGUMENT_INJECTION)[route.handlerKey] ||
                    {}) as Record<InjectableArgUnion, IArgumentInjection>
            ).sort((a, b) => a[1].index - b[1].index) as [InjectableArgUnion, IArgumentInjection][];

            logger.info({
                msg: `${route.method.toUpperCase()} ${routePath}`,
                source: CustomController.name,
                requestId: request.id,
                hasAuthPolicy,
                argumentInjections,
            });

            const [customController, services] = await new ControllerDependencyInjection(
                request,
                response,
                CustomController,
                hasAuthPolicy
            ).inject();

            try {
                if (hasAuthPolicy) {
                    await this.authorizePolicies(route.authorizationPolicy, routePath, services);
                }

                let handlerArgs: any[] = [];

                for (const [key, value] of argumentInjections) {
                    const target = request[key];
                    console.log({ key, value });
                }

                // if (validation) {
                //     handlerArgs = await this.handleValidation(request, validation, logger, request.id);
                // }

                await (customController[<keyof typeof customController>route.handlerKey] as unknown as ControllerFn)(
                    ...handlerArgs
                );
            } catch (err) {
                next(err);
            }
        });
    }

    private async handleValidation(
        request: Request,
        validation: Validation,
        logger: ILoggerService,
        requestId: string
    ) {
        const validationService = serviceContainer.getService(SERVICE.VALIDATION);
        const handlerArgs: unknown[] = [];
        const errors: Record<string, string>[] = [];
        const validators = Object.entries(validation);

        for (const [property, schema] of validators) {
            const result = await validationService.validate(request, property, schema);
            if (result.success) {
                handlerArgs.push(result.data);
            } else {
                errors.push(result.error);
            }
        }

        if (errors.length) {
            logger.verbose({
                msg: 'request validation failed',
                requestId,
                errors,
            });
            throw HttpException.malformedBody(null, errors);
        }

        logger.verbose({
            msg: 'request validation succeeded',
            requestId,
            handlerArgs,
        });

        return handlerArgs;
    }

    private configureRequest(request: Request) {
        request.id = randomUUID();
        return request as Request;
    }

    private async authorizePolicies(authorizationPolicies: string[], routePath: string, services: Map<any, any>) {
        const authorizationService = services.get(SERVICE.AUTHORIZATION) as IAuthorizationService;

        if (!authorizationService) {
            devLogger('authorization service not found but is used on route', routePath);
            throw new AuthServiceNotFoundError(authorizationPolicies.join(','), routePath);
        }

        for (const policy of authorizationPolicies) {
            await this.authorizePolicy(authorizationService, policy);
        }
    }

    private async authorizePolicy(service: IAuthorizationService, authorizationPolicy: string) {
        const isAuthorized = await service.isAuthorized(authorizationPolicy);

        if (!isAuthorized) {
            throw HttpException.unauthorized();
        }
    }
}

export default FunkalleroBase;
