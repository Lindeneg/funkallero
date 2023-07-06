import { devLogger, isKnownScopedServiceType, META_DATA, isKnownSingletonServiceType, isServiceType, SERVICE_TYPE, SERVICE, HttpException, SingletonService, LOG_LEVEL, injectService, ControllerService, ACTION_RESULT, BaseMediatorAction, HTTP_METHOD, INJECTABLE_ARG, injectArgFactory } from '@lindeneg/funkallero-core';
export { ACTION_RESULT, HTTP_METHOD, HttpException, LOG_LEVEL, MediatorResultFailure, MediatorResultSuccess, MiddlewareScopedService, MiddlewareSingletonService, SERVICE, SERVICE_TYPE, ScopedService, SingletonService, after, before, injectService } from '@lindeneg/funkallero-core';
import express, { Router } from 'express';
import urlJoin from 'url-join';
import { randomUUID } from 'crypto';

class ControllerAlreadyRegisteredError extends Error {
    constructor(controllerName) {
        super(`Controller with name ${controllerName} already registered`);
    }
}

const controllers = new Map();
const getControllers = () => Array.from(controllers.values());
const getController = (name) => controllers.get(name);
const registerController = (controller) => {
    if (controllers.has(controller.name)) {
        throw new ControllerAlreadyRegisteredError(controller.name);
    }
    devLogger(`registering controller with name ${controller.name}`);
    controllers.set(controller.name, controller);
};
const controllerContainer = {
    get: getController,
    getAll: getControllers,
    register: registerController,
};

class ServiceRegisterError extends Error {
    constructor(message) {
        super(message);
    }
    static scopedServiceAsSingletonError(serviceKey) {
        return new ServiceRegisterError(`Cannot register scoped service ${serviceKey} as singleton`);
    }
    static singletonServiceAsScopedError(serviceKey) {
        return new ServiceRegisterError(`Cannot register singleton service ${serviceKey} as scoped`);
    }
    static serviceNotFoundError(serviceKey) {
        return new ServiceRegisterError(`Service with key ${serviceKey} not found`);
    }
}

const uninstantiatedSingletons = new Map();
const singletonServices = new Map();
const scopedServices = new Map();
const registerInstantiatedSingletonService = (serviceKey, service) => {
    if (isKnownScopedServiceType(serviceKey)) {
        throw ServiceRegisterError.scopedServiceAsSingletonError(serviceKey);
    }
    devLogger(`registering instantiated singleton service ${serviceKey}`);
    singletonServices.set(serviceKey, service);
};
const getUninstantiatedSingletons = () => uninstantiatedSingletons.entries();
const getUninstantiatedSingleton = (id) => uninstantiatedSingletons.get(id);
const registerSingletonService$1 = (serviceKey, service) => {
    if (isKnownScopedServiceType(serviceKey)) {
        throw ServiceRegisterError.scopedServiceAsSingletonError(serviceKey);
    }
    devLogger(`registering singleton service ${serviceKey} with injections:`, Reflect.get(service.prototype, META_DATA.SERVICE_INJECTION));
    uninstantiatedSingletons.set(serviceKey, service);
};
const registerScopedService$1 = (serviceKey, service) => {
    if (!service)
        return;
    if (isKnownSingletonServiceType(serviceKey)) {
        throw ServiceRegisterError.singletonServiceAsScopedError(serviceKey);
    }
    devLogger(`registering scoped service ${serviceKey} with injections:`, Reflect.get(service.prototype, META_DATA.SERVICE_INJECTION));
    scopedServices.set(serviceKey, service);
};
const getSingletonService = (serviceKey) => {
    const service = singletonServices.get(serviceKey);
    if (!service)
        return null;
    return service;
};
const getScopedService = (serviceKey) => {
    const service = scopedServices.get(serviceKey);
    if (!service)
        return null;
    return service;
};
const getService = (serviceKey) => {
    const scopedService = getScopedService(serviceKey);
    if (scopedService) {
        return scopedService;
    }
    const singletonService = getSingletonService(serviceKey);
    if (singletonService) {
        return singletonService;
    }
    throw ServiceRegisterError.serviceNotFoundError(serviceKey);
};
const getServiceSafe = (serviceKey) => {
    const scopedService = getScopedService(serviceKey);
    if (scopedService) {
        return scopedService;
    }
    const singletonService = getSingletonService(serviceKey);
    if (singletonService) {
        return singletonService;
    }
    return null;
};
const serviceContainer = {
    registerSingletonService: registerSingletonService$1,
    registerScopedService: registerScopedService$1,
    getService,
    getServiceSafe,
};

const { registerScopedService, registerSingletonService } = serviceContainer;
const publicServiceRegister = {
    registerScopedService,
    registerSingletonService,
};

const publicServiceGetter = {
    getSingletonService,
};

class RequiredServiceMissingError extends Error {
    constructor(serviceName) {
        super(`Required service ${serviceName} is missing. Did you forget to register it?`);
    }
}

class NoControllersFoundError extends Error {
    constructor() {
        super('No controllers found! Did you use the controller decorator? ' +
            'Did you import the controller in your entry file?');
    }
}

const baseInjectionRegex = /^Base[a-zA-Z]+Service|Action$/;
class DependencyInjection {
    static injectionCache = new Map();
    getServiceInjections(Service) {
        const cached = DependencyInjection.injectionCache.get(Service.name);
        if (cached)
            return cached;
        const injections = [...this.getBaseServiceInjection(Service), ...this.getSpecificInjections(Service)];
        const filteredInjections = this.filterServiceKeys(injections);
        DependencyInjection.injectionCache.set(Service.name, filteredInjections);
        return filteredInjections;
    }
    filterServiceKeys(injections) {
        const seen = [];
        return injections.filter((injection) => {
            if (seen.includes(injection.serviceKey))
                return false;
            seen.push(injection.serviceKey);
            return true;
        });
    }
    getBaseServiceInjection(Service) {
        const serviceInjections = Reflect.get(Service.prototype, META_DATA.SERVICE_INJECTION);
        const keys = serviceInjections ? Object.keys(serviceInjections) : [];
        for (const key of keys) {
            if (baseInjectionRegex.test(key)) {
                const baseInjections = this.getSpecificInjections(Service, key);
                devLogger('found base injection for target', Service.name, baseInjections);
                return baseInjections;
            }
        }
        return [];
    }
    getSpecificInjections(Service, name) {
        const key = name || Service.name;
        const serviceInjections = Reflect.get(Service.prototype, META_DATA.SERVICE_INJECTION);
        const specificInjections = serviceInjections ? serviceInjections[key] : [];
        return specificInjections || [];
    }
}

class SingletonInjectionError extends Error {
    constructor(injectionSource, injectionTarget) {
        super(`Cannot inject ${injectionSource} (scoped) into ${injectionTarget} (singleton)`);
    }
}

class SingletonDependencyInjection extends DependencyInjection {
    mappedSingletonServices = new Map();
    async inject() {
        await this.prepare();
        for (const [_, { injections, service }] of this.mappedSingletonServices) {
            for (const injection of injections) {
                const injectedService = serviceContainer.getService(injection.serviceKey);
                if (isServiceType(injectedService, SERVICE_TYPE.SINGLETON)) {
                    devLogger(`injecting ${injectedService.constructor.name} into ${service.constructor.name}`);
                    service[injection.instanceMember] = injectedService;
                }
                else {
                    throw new SingletonInjectionError(injection.serviceKey, service.constructor.name);
                }
            }
        }
    }
    async prepare() {
        const uninstantiatedSingletons = await this.getFilteredUninstantiatedSingletons();
        for (const [serviceKey, Service] of uninstantiatedSingletons) {
            const service = new Service();
            const injections = this.getServiceInjections(Service);
            this.mappedSingletonServices.set(serviceKey, {
                injections,
                service,
            });
            registerInstantiatedSingletonService(serviceKey, service);
        }
    }
    async getFilteredUninstantiatedSingletons() {
        const filteredMap = new Map();
        const uninstantiatedSingletons = getUninstantiatedSingletons();
        for (const [serviceKey, Service] of uninstantiatedSingletons) {
            if (filteredMap.has(serviceKey)) {
                continue;
            }
            const existingService = serviceContainer.getServiceSafe(serviceKey);
            if (!existingService)
                filteredMap.set(serviceKey, Service);
        }
        return filteredMap.entries();
    }
}

class ScopedDependencyInjection extends DependencyInjection {
    Service;
    request;
    controllerOptions;
    scopedServices;
    filteredServiceInjections;
    constructor(request, Service, scopedServices, controllerOptions = null) {
        super();
        this.Service = Service;
        this.scopedServices = scopedServices;
        this.request = request;
        this.controllerOptions = controllerOptions;
        this.filteredServiceInjections = this.getServiceInjections(this.Service);
    }
    async inject() {
        await this.prepare();
        const service = new this.Service();
        service.injections = this.filteredServiceInjections;
        this.injectScopedServices();
        this.injectServicesIntoService(service);
        return service;
    }
    async prepare() {
        for (const injection of this.filteredServiceInjections) {
            this.setScopedDependencies(injection);
        }
        this.setDefaultAuthorizationServiceIfNeeded();
    }
    injectScopedServices() {
        for (const [_, service] of this.scopedServices) {
            for (const injection of service.injections) {
                const injectedService = this.scopedServices.get(injection.serviceKey);
                if (injectedService) {
                    devLogger('injecting', injectedService.constructor.name, 'into', service.constructor.name, 'on request', this.request.id);
                    service[injection.instanceMember] = injectedService;
                }
            }
        }
    }
    injectServicesIntoService(service) {
        service.request = this.request;
        if (!!this.controllerOptions?.response) {
            service.response = this.controllerOptions.response;
        }
        for (const injection of this.filteredServiceInjections) {
            const baseService = serviceContainer.getService(injection.serviceKey);
            let actualService = baseService;
            if (isServiceType(baseService, SERVICE_TYPE.SCOPED)) {
                const injectedService = this.scopedServices.get(injection.serviceKey);
                if (injectedService) {
                    actualService = injectedService;
                }
            }
            devLogger('injecting', actualService.constructor.name, 'into', this.Service.name, 'on request', this.request.id);
            service[injection.instanceMember] = actualService;
        }
    }
    setScopedDependencies(injection, injections = []) {
        const Service = serviceContainer.getService(injection.serviceKey);
        if (isServiceType(Service, SERVICE_TYPE.SCOPED) && !this.scopedServices.has(injection.serviceKey)) {
            const service = new Service();
            service.injections = this.getServiceInjections(Service);
            service.request = this.request;
            this.injectSingletonDependencies(service);
            this.scopedServices.set(injection.serviceKey, service);
            for (const injection of service.injections) {
                this.setScopedDependencies(injection, injections);
            }
        }
    }
    injectSingletonDependencies(service) {
        for (const injection of service.injections) {
            const injectedService = serviceContainer.getService(injection.serviceKey);
            if (isServiceType(injectedService, SERVICE_TYPE.SINGLETON)) {
                devLogger('injecting', injectedService.constructor.name, 'into', service.constructor.name, 'on request', this.request.id);
                service[injection.instanceMember] = injectedService;
            }
        }
    }
    setDefaultAuthorizationServiceIfNeeded() {
        if (!!this.controllerOptions?.hasAuthPolicies && !this.scopedServices.has(SERVICE.AUTHORIZATION)) {
            this.setScopedDependencies({
                serviceKey: SERVICE.AUTHORIZATION,
                instanceMember: '__authorizationService',
            });
        }
    }
}

class RouteMiddlewareHandler {
    static middlewareCache = new Map();
    logger;
    services;
    request;
    response;
    beforeMiddleware;
    afterMiddleware;
    hasBeforeMiddleware;
    hasAfterMiddleware;
    hasMiddleware;
    constructor(request, response, services, [before, after]) {
        this.logger = serviceContainer.getService(SERVICE.LOGGER);
        this.request = request;
        this.response = response;
        this.services = services;
        this.beforeMiddleware = before;
        this.afterMiddleware = after;
    }
    async runBeforeMiddleware() {
        await Promise.all(this.beforeMiddleware.map((middlewareKey) => this.runMiddleware(middlewareKey, 'beforeRequestHandler')));
    }
    async runAfterMiddleware(result) {
        let amendedResult = result;
        for (const middlewareKey of this.afterMiddleware) {
            amendedResult = await this.runMiddleware(middlewareKey, 'afterRequestHandler', amendedResult);
        }
        return amendedResult;
    }
    async runMiddleware(middlewareServiceKey, method, result) {
        const singletonService = getSingletonService(middlewareServiceKey);
        if (singletonService) {
            result = await singletonService[method](this.request, this.response, result);
            this.logger.verbose({
                msg: 'singleton middleware result',
                middlewareServiceKey,
                method,
                requestId: this.request.id,
                result,
            });
            return result;
        }
        let scopedService = this.services.get(middlewareServiceKey);
        if (!scopedService) {
            const Service = getScopedService(middlewareServiceKey);
            if (!Service)
                throw new RequiredServiceMissingError(middlewareServiceKey);
            scopedService = await new ScopedDependencyInjection(this.request, Service, this.services).inject();
            this.services.set(middlewareServiceKey, scopedService);
        }
        result = await scopedService[method](this.response, result);
        this.logger.verbose({
            msg: 'scoped middleware result',
            method,
            requestId: this.request.id,
            middlewareServiceKey,
            result,
        });
        return result;
    }
    static getMiddleware(CustomController, handlerKey) {
        const key = CustomController.name + handlerKey;
        const cached = RouteMiddlewareHandler.middlewareCache.get(key);
        if (cached)
            return cached;
        const [[before, hasBeforeMiddleware], [after, hasAfterMiddleware]] = [
            this.getMiddlewareTuple(CustomController, handlerKey, META_DATA.MIDDLEWARE_BEFORE),
            this.getMiddlewareTuple(CustomController, handlerKey, META_DATA.MIDDLEWARE_AFTER),
        ];
        const result = {
            middleware: [before, after],
            hasBeforeMiddleware,
            hasAfterMiddleware,
            hasMiddleware: hasBeforeMiddleware || hasAfterMiddleware,
        };
        RouteMiddlewareHandler.middlewareCache.set(key, result);
        return result;
    }
    static getMiddlewareTuple(CustomController, handlerKey, key) {
        const map = Reflect.get(CustomController.prototype, key) || {};
        const specificMiddleware = map[handlerKey] || [];
        const hasSpecificMiddleware = specificMiddleware.length > 0;
        return [specificMiddleware, hasSpecificMiddleware];
    }
}

class AuthServiceNotFoundError extends Error {
    constructor(routePath, service = 'authorization') {
        super(`No ${service} service registered yet it is consumed by ${routePath}`);
    }
}

class RouteAuthHandler {
    static authPolicyInjectionCache = new Map();
    routePath;
    constructor(routePath) {
        this.routePath = routePath;
    }
    async handle(customController, authInjection, services) {
        const authorizationService = this.getAuthorizationService(services);
        await this.authorizePolicies(authInjection.policies, authorizationService);
        if (authInjection.injectUser) {
            const [key, value] = await this.getInjectContext(authInjection.injectUser, services);
            devLogger('injecting auth user on', customController.constructor.name, 'with context', authInjection.injectUser);
            customController[key] = value;
        }
    }
    async getInjectContext(injectUser, services) {
        const authenticationService = this.getAuthenticationService(services);
        const requestUser = await authenticationService.getUser();
        let key;
        let value = requestUser;
        if (typeof injectUser === 'string') {
            key = injectUser;
        }
        else {
            key = injectUser.destProperty;
            value = requestUser[injectUser.srcProperty];
        }
        return [key, value];
    }
    getAuthorizationService(services) {
        const authorizationService = services.get(SERVICE.AUTHORIZATION);
        if (!authorizationService) {
            devLogger('authorization service not found but is used on route', this.routePath);
            throw new AuthServiceNotFoundError(this.routePath);
        }
        return authorizationService;
    }
    getAuthenticationService(services) {
        const authenticationService = services.get(SERVICE.AUTHENTICATION);
        if (!authenticationService) {
            devLogger('authentication service not found but is used on route via user injection', this.routePath);
            throw new AuthServiceNotFoundError(this.routePath, 'authentication');
        }
        return authenticationService;
    }
    async authorizePolicies(authorizationPolicies, authService) {
        for (const policy of authorizationPolicies) {
            const isAuthorized = await authService.isAuthorized(policy);
            if (!isAuthorized) {
                throw HttpException.unauthorized();
            }
        }
    }
    static getAuthorizationPolicyInjection(CustomController, handlerKey) {
        const key = CustomController.name + handlerKey;
        const cached = RouteAuthHandler.authPolicyInjectionCache.get(key);
        if (cached)
            return cached;
        const policyMap = Reflect.get(CustomController.prototype, META_DATA.AUTHORIZATION_POLICIES) || {};
        const injection = policyMap[handlerKey] || { policies: [], injectUser: null };
        RouteAuthHandler.authPolicyInjectionCache.set(key, injection);
        return injection;
    }
}

class RouteHandler {
    logger;
    CustomController;
    route;
    routePath;
    request;
    response;
    next;
    constructor(CustomController, route, routePath, request, response, next) {
        this.logger = serviceContainer.getService(SERVICE.LOGGER);
        this.CustomController = CustomController;
        this.route = route;
        this.routePath = routePath;
        this.request = this.configureRequest(request);
        this.response = response;
        this.next = next;
    }
    async handle() {
        const authInjection = RouteAuthHandler.getAuthorizationPolicyInjection(this.CustomController, this.route.handlerKey);
        const middlewareContext = RouteMiddlewareHandler.getMiddleware(this.CustomController, this.route.handlerKey);
        const hasAuthPolicies = authInjection.policies.length > 0;
        this.logger.info({
            msg: `${this.route.method.toUpperCase()} ${this.routePath}`,
            source: this.CustomController.name,
            requestId: this.request.id,
            hasAuthPolicies,
            hasMiddleware: middlewareContext.hasMiddleware,
        });
        const scopedServices = new Map();
        const customController = await new ScopedDependencyInjection(this.request, this.CustomController, scopedServices, {
            hasAuthPolicies,
            response: this.response,
        }).inject();
        try {
            if (hasAuthPolicies) {
                await new RouteAuthHandler(this.routePath).handle(customController, authInjection, scopedServices);
            }
            let middlewareHandler = null;
            if (middlewareContext.hasMiddleware) {
                middlewareHandler = new RouteMiddlewareHandler(this.request, this.response, scopedServices, middlewareContext.middleware);
            }
            if (middlewareHandler && middlewareContext.hasBeforeMiddleware) {
                await middlewareHandler.runBeforeMiddleware();
            }
            const handlerArgs = await this.getHandlerArgs();
            let result = await customController[this.route.handlerKey](...handlerArgs);
            if (middlewareHandler && middlewareContext.hasAfterMiddleware) {
                result = await middlewareHandler.runAfterMiddleware(result);
            }
            await customController.handleResult(result);
        }
        catch (err) {
            this.next(err);
        }
    }
    getFilteredTarget(target, properties) {
        if (properties.length === 0)
            return target;
        if (properties.length === 1)
            return target[properties[0]];
        return properties.reduce((acc, cur) => {
            const value = target[cur];
            if (value) {
                acc[cur] = value;
            }
            return acc;
        }, {});
    }
    getArgumentInjections() {
        const metaInjections = Reflect.get(this.CustomController.prototype, META_DATA.ARGUMENT_INJECTION);
        const argumentInjections = (metaInjections ? metaInjections[this.route.handlerKey] : {});
        const entries = Object.entries(argumentInjections || {}).sort((a, b) => a[1].index - b[1].index);
        return entries;
    }
    async getHandlerArgs() {
        const argumentInjections = this.getArgumentInjections();
        let handlerArgs = [];
        if (argumentInjections.length > 0) {
            handlerArgs = await this.getValidatedHandlerArgs(argumentInjections);
        }
        return handlerArgs;
    }
    async getValidatedHandlerArgs(argumentInjections) {
        const validationService = serviceContainer.getService(SERVICE.SCHEMA_PARSER);
        const handlerArgs = [];
        const errors = [];
        for (const [key, opts] of argumentInjections) {
            const target = this.getFilteredTarget(this.request[key], opts.properties);
            devLogger('argument injection target', this.route.handlerKey, 'on request id', this.request.id, 'has filtered target', target, 'with schema:', !!opts.schema);
            if (!opts.schema) {
                handlerArgs.push(opts.transform ? opts.transform(target) : target);
                continue;
            }
            const result = await validationService.parse(target, opts.schema);
            if (result.success) {
                handlerArgs.push(opts.transform ? opts.transform(result.data) : result.data);
            }
            else {
                errors.push(result.error);
            }
        }
        if (errors.length) {
            this.logger.verbose({
                msg: 'request validation failed',
                requestId: this.request.id,
                errors,
            });
            throw HttpException.malformedBody(null, errors);
        }
        this.logger.verbose({
            msg: 'request validation succeeded',
            requestId: this.request.id,
            handlerArgs,
        });
        return handlerArgs;
    }
    configureRequest(request) {
        request.id = randomUUID();
        return request;
    }
}

class BaseConfigurationService extends SingletonService {
    port;
    basePath;
    logLevel;
    https;
    meta;
}

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

const EMPTY_PALETTE = {
    [LOG_LEVEL.INFO]: '',
    [LOG_LEVEL.WARNING]: '',
    [LOG_LEVEL.ERROR]: '',
    [LOG_LEVEL.VERBOSE]: '',
    [LOG_LEVEL.SILENT]: '',
};
const DEFAULT_PALETTE = {
    [LOG_LEVEL.INFO]: '\x1b[32m%s\x1b[0m',
    [LOG_LEVEL.WARNING]: '\x1b[33m%s\x1b[0m',
    [LOG_LEVEL.ERROR]: '\x1b[31m%s\x1b[0m',
    [LOG_LEVEL.VERBOSE]: '\x1b[36m%s\x1b[0m',
    [LOG_LEVEL.SILENT]: '',
};
class BaseLoggerServicePalette {
    static palette = new Map();
    static getColor(level, msg = '') {
        const match = BaseLoggerServicePalette.palette.get(level);
        if (typeof match === 'function') {
            return [match(msg)];
        }
        if (typeof match === 'string') {
            return [match, msg];
        }
        return [msg];
    }
    static setPalette(palette) {
        const colors = Object.entries(palette);
        for (const [level, color] of colors) {
            BaseLoggerServicePalette.palette.set(Number.parseInt(level), color);
        }
    }
    static useEmptyPalette() {
        BaseLoggerServicePalette.setPalette(EMPTY_PALETTE);
    }
    static useDefaultPalette() {
        BaseLoggerServicePalette.setPalette(DEFAULT_PALETTE);
    }
}
class BaseLoggerService extends SingletonService {
    configService;
    info(payload) {
        this.prepare(payload, LOG_LEVEL.INFO);
    }
    warning(payload) {
        this.prepare(payload, LOG_LEVEL.WARNING);
    }
    error(payload) {
        this.prepare(payload, LOG_LEVEL.ERROR);
    }
    verbose(payload) {
        this.prepare(payload, LOG_LEVEL.VERBOSE);
    }
    prepare(payload, level) {
        if (typeof payload === 'string')
            return this.log({ msg: payload, level });
        this.log({ ...payload, level });
    }
    log({ msg, level, force = false, ...rest }) {
        if (this.configService.logLevel === LOG_LEVEL.SILENT || level === LOG_LEVEL.SILENT)
            return;
        if (force || this.configService.logLevel >= level) {
            const args = BaseLoggerServicePalette.getColor(level, msg);
            if (this.configService.logLevel === LOG_LEVEL.VERBOSE && Object.keys(rest).length > 0) {
                args.push({ ...rest });
            }
            console.log(...args);
        }
    }
}
__decorate([
    injectService(SERVICE.CONFIGURATION)
], BaseLoggerService.prototype, "configService", void 0);

const setJsonContentTypeMiddleware = (_, res, next) => {
    res.set('Content-Type', 'application/json');
    next();
};
class BaseExpressService extends SingletonService {
    config;
    logger;
    app = express();
    server;
    protocol = 'http';
    async setup() {
        this.app.use(express.json());
        if (this.config.https) {
            this.protocol = 'https';
            const https = await import('https');
            this.server = https.createServer(this.config.https, this.app);
        }
        else {
            const http = await import('http');
            this.server = http.createServer(this.app);
        }
    }
    startup() {
        const url = urlJoin(`${this.protocol}://localhost:${this.config.port}`, this.config.basePath);
        this.server.listen(this.config.port, () => {
            this.logger.info(`Server listening on ${url}`);
        });
    }
    useJsonContentType() {
        this.app.use(setJsonContentTypeMiddleware);
    }
}
__decorate([
    injectService(SERVICE.CONFIGURATION)
], BaseExpressService.prototype, "config", void 0);
__decorate([
    injectService(SERVICE.LOGGER)
], BaseExpressService.prototype, "logger", void 0);

class BaseRequestErrorHandlerService extends SingletonService {
    logger;
    handler(...[err, req, res, next]) {
        if (res.headersSent)
            return next(err);
        this.logger.error({
            msg: `${err?.statusCode || 500} ${req.method.toUpperCase()}: ${req.originalUrl}`,
            source: 'BaseRequestErrorHandlerService',
            requestId: req.id,
            error: err,
        });
        if (err instanceof HttpException) {
            res.status(err.statusCode).json(err.toResponse());
        }
        else {
            res.status(500).json({
                message: 'Something went wrong. Please try again.',
            });
        }
    }
}
__decorate([
    injectService(SERVICE.LOGGER)
], BaseRequestErrorHandlerService.prototype, "logger", void 0);

class FunkalleroBase {
    config;
    customSetup;
    customStartup;
    constructor({ setup, startup, ...config }) {
        this.config = config;
        this.customSetup = setup;
        this.customStartup = startup;
    }
    configureController(app, CustomController) {
        const routes = Reflect.get(CustomController.prototype, META_DATA.CONTROLLER_ROUTES);
        const controllerPath = Reflect.get(CustomController, META_DATA.CONTROLLER_PATH);
        const basePath = urlJoin(this.config?.basePath || '', controllerPath);
        devLogger(`configuring ${CustomController.name} with baseRoute ${basePath}`);
        for (const route of routes) {
            const router = Router(route.routerOptions);
            const routePath = urlJoin(basePath, route.path);
            this.configureRouteHandler(router, CustomController, route, routePath);
            devLogger(`registering route ${route.method.toUpperCase()} ${routePath} on controller ${CustomController.name}`);
            app.use(basePath, router);
        }
    }
    async ensureRequiredServicesRegistered() {
        await Promise.all([
            this.ensureRegisteredSingletonService(SERVICE.CONFIGURATION, BaseConfigurationService),
            this.ensureRegisteredSingletonService(SERVICE.LOGGER, BaseLoggerService),
            this.ensureRegisteredSingletonService(SERVICE.EXPRESS, BaseExpressService),
            this.ensureRegisteredSingletonService(SERVICE.ERROR_HANDLER, BaseRequestErrorHandlerService),
        ]);
    }
    async setupConfiguration() {
        const configService = serviceContainer.getService(SERVICE.CONFIGURATION);
        configService.port = this.config.port || 3000;
        configService.basePath = this.config.basePath || '';
        configService.logLevel =
            !this.config.logLevel && this.config.logLevel !== LOG_LEVEL.ERROR ? LOG_LEVEL.INFO : this.config.logLevel;
        configService.https =
            typeof this.config.https === 'function' ? await this.config.https() : this.config.https || null;
        configService.meta = this.config.meta || {};
        const { type, injection, ...config } = configService;
        devLogger('configuration service', config);
    }
    async ensureRegisteredSingletonService(serviceKey, BaseService) {
        const Service = getUninstantiatedSingleton(serviceKey);
        if (!Service) {
            devLogger(`using default ${serviceKey} service`);
            serviceContainer.registerSingletonService(serviceKey, BaseService);
        }
    }
    configureRouteHandler(router, CustomController, route, routePath) {
        router[route.method](route.path, async (request, response, next) => {
            await new RouteHandler(CustomController, route, routePath, request, response, next).handle();
        });
    }
}

class Funkallero extends FunkalleroBase {
    constructor(config) {
        super(config);
    }
    async start() {
        if (typeof this.customStartup === 'function') {
            await this.customStartup(publicServiceGetter);
        }
        const expressService = serviceContainer.getService(SERVICE.EXPRESS);
        await expressService.startup();
    }
    async setup() {
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
        for (const CustomController of controllers) {
            this.configureController(app, CustomController);
        }
        app.use((err, req, res, next) => {
            const errorHandlerService = serviceContainer.getService(SERVICE.ERROR_HANDLER);
            errorHandlerService.handler(err, req, res, next);
        });
    }
    checkRegistryForRequiredServices() {
        const dataContext = getUninstantiatedSingleton(SERVICE.DATA_CONTEXT);
        if (!dataContext)
            throw new RequiredServiceMissingError(SERVICE.DATA_CONTEXT);
        const mediator = getUninstantiatedSingleton(SERVICE.MEDIATOR);
        if (!mediator)
            throw new RequiredServiceMissingError(SERVICE.MEDIATOR);
    }
    static async create(config) {
        const funkallero = new Funkallero(config);
        await funkallero.setup();
        return funkallero;
    }
}

class BaseControllerService extends ControllerService {
    mediator;
    logger;
    // just a default implementation, meant to be overridden..
    async handleResult(result) {
        if (!result.success) {
            return this.handleError(result.error);
        }
        const hasPayload = !!result.value;
        let statusCode = 200;
        if (result.context === ACTION_RESULT.SUCCESS_CREATE) {
            statusCode = 201;
        }
        if (!hasPayload &&
            (result.context === ACTION_RESULT.SUCCESS_UPDATE || result.context === ACTION_RESULT.SUCCESS_DELETE)) {
            statusCode = 204;
        }
        this.logger.verbose({
            msg: 'request handled successfully',
            statusCode,
            requestId: this.request.id,
        });
        this.response.status(statusCode);
        if (hasPayload) {
            this.response.json({ data: result.value });
        }
        this.response.end();
    }
    async handleError(err) {
        switch (err) {
            case ACTION_RESULT.ERROR_BAD_PAYLOAD:
                throw HttpException.malformedBody();
            case ACTION_RESULT.ERROR_UNAUTHORIZED:
                throw HttpException.unauthorized();
            case ACTION_RESULT.ERROR_UNAUTHENTICATED:
                throw HttpException.forbidden();
            case ACTION_RESULT.ERROR_NOT_FOUND:
                throw HttpException.notFound();
            case ACTION_RESULT.ERROR_UNPROCESSABLE:
                throw HttpException.unprocessable();
            default:
                throw HttpException.internal();
        }
    }
}
__decorate([
    injectService(SERVICE.MEDIATOR)
], BaseControllerService.prototype, "mediator", void 0);
__decorate([
    injectService(SERVICE.LOGGER)
], BaseControllerService.prototype, "logger", void 0);

class MediatorActionDependencyInjection extends DependencyInjection {
    Action;
    action;
    constructor(action) {
        super();
        this.Action = action;
        this.action = new this.Action();
    }
    async inject() {
        const injections = this.getServiceInjections(this.Action);
        for (const injection of injections) {
            const injectedService = serviceContainer.getService(injection.serviceKey);
            if (injectedService) {
                if (isServiceType(injectedService, SERVICE_TYPE.SCOPED)) {
                    throw new SingletonInjectionError(injection.serviceKey, this.Action.name);
                }
                devLogger(`injecting ${injectedService.constructor.name} into ${this.Action.name}`);
                this.action[injection.instanceMember] = injectedService;
            }
        }
        return this.action;
    }
}

class BaseMediatorService extends SingletonService {
    actions;
    instantiatedActions;
    constructor(actions) {
        super();
        this.actions = actions;
        this.instantiatedActions = new Map();
    }
    async send(...[action, args]) {
        const instantiatedAction = await this.getInstantiatedAction(action);
        devLogger(`executing mediator action ${instantiatedAction.constructor.name} with payload`, args);
        return instantiatedAction.execute(args);
    }
    async getInstantiatedAction(action) {
        let instantiatedAction = this.instantiatedActions.get(action);
        if (!instantiatedAction) {
            instantiatedAction = await new MediatorActionDependencyInjection(this.actions[action]).inject();
            this.instantiatedActions.set(action, instantiatedAction);
        }
        return instantiatedAction;
    }
}

class BaseZodParserService extends SingletonService {
    async parse(payload, validation) {
        const result = await validation.safeParseAsync(payload);
        if (result.success) {
            return {
                success: true,
                data: result.data,
            };
        }
        const error = {};
        for (const zodErr of result.error.errors) {
            for (const path of zodErr.path) {
                error[path] = zodErr.message;
            }
        }
        return {
            success: false,
            error,
        };
    }
}

class MediatorAction extends BaseMediatorAction {
    dataContext;
}
__decorate([
    injectService(SERVICE.DATA_CONTEXT)
], MediatorAction.prototype, "dataContext", void 0);

const ensureStringArray = (properties) => {
    if (!properties)
        return [];
    if (typeof properties === 'string')
        return [properties];
    return properties;
};

const auth = (policy, injectUser = null) => {
    return function (target, key, _) {
        const policies = ensureStringArray(policy);
        let authPoliciesMap = Reflect.get(target, META_DATA.AUTHORIZATION_POLICIES);
        if (!authPoliciesMap) {
            authPoliciesMap = {};
            Reflect.defineProperty(target, META_DATA.AUTHORIZATION_POLICIES, {
                get: () => authPoliciesMap,
            });
        }
        if (Array.isArray(authPoliciesMap[key])) {
            const current = authPoliciesMap[key];
            current.policies.push(...policies);
            if (injectUser !== null && current.injectUser === null) {
                current.injectUser = injectUser;
            }
            devLogger('auth policies on', key, current);
            return;
        }
        const injection = {
            policies,
            injectUser,
        };
        authPoliciesMap[key] = injection;
        devLogger('auth policies on', key, authPoliciesMap[key]);
    };
};

const createRoute = (method, path, handlerKey, routerOptions) => ({
    method,
    path,
    handlerKey,
    routerOptions,
});
const routeDecoratorFactory = (route, method, opts) => {
    return function (target, key, _) {
        let routes = Reflect.get(target, META_DATA.CONTROLLER_ROUTES);
        if (!routes) {
            routes = [];
            Reflect.defineProperty(target, META_DATA.CONTROLLER_ROUTES, {
                get: () => routes,
            });
        }
        routes.push(createRoute(method, route, key, opts));
    };
};
function controller(basePath = '') {
    return function (target) {
        Reflect.defineProperty(target, META_DATA.CONTROLLER_PATH, {
            get: () => basePath,
        });
        controllerContainer.register(target);
    };
}
function httpGet(route = '', opts) {
    return routeDecoratorFactory(route, HTTP_METHOD.GET, opts);
}
function httpPost(route = '', opts) {
    return routeDecoratorFactory(route, HTTP_METHOD.POST, opts);
}
function httpPut(route = '', opts) {
    return routeDecoratorFactory(route, HTTP_METHOD.PUT, opts);
}
function httpPatch(route = '', opts) {
    return routeDecoratorFactory(route, HTTP_METHOD.PATCH, opts);
}
function httpDelete(route = '', opts) {
    return routeDecoratorFactory(route, HTTP_METHOD.DELETE, opts);
}

const handleArgs = (config, ...args) => {
    for (const arg of args) {
        if (typeof arg === 'object') {
            config.schema = arg;
        }
        else if (typeof arg === 'string' || Array.isArray(arg)) {
            config.properties = arg;
        }
        else if (typeof arg === 'function') {
            config.fn = arg;
        }
    }
};
const injectFactory = (injectableArg) => {
    return function (arg1, arg2, arg3) {
        const config = {
            schema: null,
            fn: null,
            properties: [],
        };
        handleArgs(config, arg1, arg2, arg3);
        return injectArgFactory(injectableArg, config.schema, ensureStringArray(config.properties), config.fn);
    };
};
const body = injectFactory(INJECTABLE_ARG.BODY);
const query = injectFactory(INJECTABLE_ARG.QUERY);
const params = injectFactory(INJECTABLE_ARG.PARAMS);
const headers = injectFactory(INJECTABLE_ARG.HEADERS);

export { BaseExpressService, BaseLoggerService, BaseLoggerServicePalette, BaseZodParserService, BaseControllerService as ControllerService, MediatorAction, BaseMediatorService as MediatorService, auth, body, controller, Funkallero as default, headers, httpDelete, httpGet, httpPatch, httpPost, httpPut, params, query };
