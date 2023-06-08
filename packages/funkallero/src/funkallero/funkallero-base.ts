import { randomUUID } from 'crypto';
import { Application as Express, Router } from 'express';
import urlJoin from 'url-join';
import {
    SERVICE,
    LOG_LEVEL,
    HttpException,
    type IFunkalleroBase,
    type ILoggerService,
    type IExpressService,
    type IControllerService,
    type IAuthorizationService,
    type IConfigurationService,
    type IFunkalleroPartialConfiguration,
    type Constructor,
    type ControllerFn,
    type IRoute,
    type Request,
    type IExpressErrorhandlerService,
    type Validation,
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
        const routes = CustomController.prototype.routes;
        const baseRoute = urlJoin(this.config?.basePath || '', CustomController.prototype.baseRoute);

        devLogger(`configuring ${CustomController.name} with baseRoute ${baseRoute}`);

        for (const route of routes) {
            const router = Router();
            const routePath = urlJoin(baseRoute, route.route);

            this.configureRouteHandler(router, CustomController, route, routePath);

            devLogger(
                `registering route ${route.method.toUpperCase()} ${routePath} on controller ${CustomController.name}`
            );

            app.use(baseRoute, router);
        }
    }

    protected async ensureRequiredServicesRegistered() {
        await Promise.all([
            this.ensureConfigurationRegistered(),
            this.ensureLoggerRegistered(),
            this.ensureExpressRegistered(),
            this.ensureErrorHandlerRegistered(),
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

    private async ensureExpressRegistered() {
        const ExpressService = getUninstantiatedSingleton(SERVICE.EXPRESS) as Constructor<IExpressService> | undefined;

        if (!ExpressService) {
            devLogger('using default express service');
            serviceContainer.registerSingletonService(SERVICE.EXPRESS, BaseExpressService);
        }
    }

    private ensureErrorHandlerRegistered() {
        const RequestErrorHandlerService = getUninstantiatedSingleton(SERVICE.ERROR_HANDLER) as
            | Constructor<IExpressErrorhandlerService>
            | undefined;

        if (!RequestErrorHandlerService) {
            devLogger('using default request error handler service');
            serviceContainer.registerSingletonService(SERVICE.ERROR_HANDLER, BaseRequestErrorHandlerService);
        }
    }

    private async ensureLoggerRegistered() {
        const LoggerService = getUninstantiatedSingleton(SERVICE.LOGGER) as Constructor<ILoggerService> | undefined;

        if (!LoggerService) {
            devLogger('using default logger service');
            serviceContainer.registerSingletonService(SERVICE.LOGGER, BaseLoggerService);
        }
    }

    private async ensureConfigurationRegistered() {
        const ConfigurationService = getUninstantiatedSingleton(SERVICE.CONFIGURATION) as
            | Constructor<IConfigurationService>
            | undefined;

        if (!ConfigurationService) {
            serviceContainer.registerSingletonService(SERVICE.CONFIGURATION, BaseConfigurationService);
        }
    }

    private configureRouteHandler(
        router: Router,
        CustomController: Constructor<IControllerService>,
        route: IRoute,
        routePath: string
    ) {
        router[route.method](route.route, async (_request, response, next) => {
            const request = this.configureRequest(_request as Request);
            const logger = serviceContainer.getService(SERVICE.LOGGER);
            const controllerValidation = CustomController.prototype.validation;
            const validation = controllerValidation ? controllerValidation[route.handlerKey] : null;
            const hasAuthPolicy = route.authorizationPolicy.length > 0;

            logger.info({
                msg: `${route.method.toUpperCase()} ${routePath}`,
                source: CustomController.name,
                requestId: request.id,
                hasValidation: !!validation,
                hasAuthPolicy,
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

                if (validation) {
                    handlerArgs = await this.handleValidation(request, validation, logger, request.id);
                }

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
