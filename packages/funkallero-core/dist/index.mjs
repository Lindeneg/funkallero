const SINGLETON_SERVICE = Object.freeze({
    MEDIATOR: 'MEDIATOR',
    DATA_CONTEXT: 'DATA_CONTEXT',
    EXPRESS: 'EXPRESS',
    CONFIGURATION: 'CONFIGURATION',
    LOGGER: 'LOGGER',
    ERROR_HANDLER: 'ERROR_HANDLER',
    SCHEMA_PARSER: 'SCHEMA_PARSER',
    TOKEN: 'TOKEN',
});

const SCOPED_SERVICE = Object.freeze({
    AUTHORIZATION: 'AUTHORIZATION',
    AUTHENTICATION: 'AUTHENTICATION',
});

const SERVICE = Object.freeze({
    ...SINGLETON_SERVICE,
    ...SCOPED_SERVICE,
});

const SERVICE_TYPE = Object.freeze({
    SINGLETON: 'SINGLETON',
    SCOPED: 'SCOPED',
});

const LOG_LEVEL = {
    ERROR: 0,
    WARNING: 1,
    INFO: 2,
    VERBOSE: 3,
    SILENT: 4,
};

const HTTP_METHOD = Object.freeze({
    GET: 'get',
    POST: 'post',
    PUT: 'put',
    PATCH: 'patch',
    DELETE: 'delete',
});

const ACTION_SUCCESS_RESULT = Object.freeze({
    UNIT: '',
    SUCCESS_CREATE: 'SUCCESS_CREATE',
    SUCCESS_UPDATE: 'SUCCESS_UPDATE',
    SUCCESS_DELETE: 'SUCCESS_DELETE',
});

const ACTION_ERROR_RESULT = Object.freeze({
    ERROR_BAD_PAYLOAD: 'ERROR_BAD_PAYLOAD',
    ERROR_UNAUTHENTICATED: 'ERROR_UNAUTHENTICATED',
    ERROR_UNAUTHORIZED: 'ERROR_UNAUTHORIZED',
    ERROR_UNPROCESSABLE: 'ERROR_UNPROCESSABLE',
    ERROR_NOT_FOUND: 'ERROR_NOT_FOUND',
    ERROR_INTERNAL_ERROR: 'ERROR_INTERNAL_ERROR',
});

const ACTION_RESULT = Object.freeze({
    ...ACTION_SUCCESS_RESULT,
    ...ACTION_ERROR_RESULT,
});

const META_DATA = {
    SERVICE_INJECTION: 'funkallero:service-injection',
    ARGUMENT_INJECTION: 'funkallero:argument-injection',
    CONTROLLER_ROUTES: 'funkallero:controller-routes',
    CONTROLLER_PATH: 'funkallero:controller-path',
    MIDDLEWARE_AFTER: 'funkallero:middleware-after',
    MIDDLEWARE_BEFORE: 'funkallero:middleware-before',
    AUTHORIZATION_POLICIES: 'funkallero:authorization-policies',
};

const INJECTABLE_ARG = {
    BODY: 'body',
    QUERY: 'query',
    PARAMS: 'params',
    HEADERS: 'headers',
};

function injectService(serviceKey) {
    return function (target, instanceMember) {
        const origin = target.constructor.name;
        let serviceMetaData = Reflect.get(target, META_DATA.SERVICE_INJECTION);
        if (!serviceMetaData) {
            serviceMetaData = {};
            Reflect.defineProperty(target, META_DATA.SERVICE_INJECTION, {
                get: () => serviceMetaData,
            });
        }
        if (!Array.isArray(serviceMetaData[origin])) {
            serviceMetaData[origin] = [];
        }
        const serviceInjection = {
            serviceKey,
            instanceMember,
        };
        serviceMetaData[origin].push(serviceInjection);
        return target;
    };
}

const shouldLog = process.env.FUNKALLERO_DEBUG_MODE === 'on';
const devLogger = (msg, ...context) => {
    if (shouldLog)
        console.log('DEV LOGGER:', msg, ...context);
};

function injectArgFactory(targetProperty, schema, properties, transform) {
    return function (target, propertyKey, index) {
        devLogger('inject factory for', propertyKey, 'on', targetProperty, 'produced config', {
            properties,
            schema: !!schema,
            transform: !!transform,
        });
        let argumentMetaData = Reflect.get(target, META_DATA.ARGUMENT_INJECTION);
        if (!argumentMetaData) {
            argumentMetaData = {};
            Reflect.defineProperty(target, META_DATA.ARGUMENT_INJECTION, {
                get: () => argumentMetaData,
            });
        }
        if (!argumentMetaData[propertyKey]) {
            argumentMetaData[propertyKey] = {};
        }
        const argumentInjection = {
            index,
            schema,
            transform,
            properties,
        };
        argumentMetaData[propertyKey][targetProperty] = argumentInjection;
    };
}

const middlewareFactory = (metaKey) => {
    return function (...serviceKeys) {
        return function (target, key, _) {
            let middleware = Reflect.get(target, metaKey);
            if (!middleware) {
                middleware = {};
                Reflect.defineProperty(target, metaKey, {
                    get: () => middleware,
                });
            }
            if (Array.isArray(middleware[key])) {
                middleware[key].push(...serviceKeys);
            }
            middleware[key] = serviceKeys;
            devLogger('middleware factory for', metaKey, 'on', key, 'produced', middleware[key]);
        };
    };
};
const after = middlewareFactory(META_DATA.MIDDLEWARE_AFTER);
const before = middlewareFactory(META_DATA.MIDDLEWARE_BEFORE);

const isServiceType = (service, type) => {
    return service?.type === type || service?.prototype?.type === type;
};
const isKnownScopedServiceType = (serviceKey) => {
    return SCOPED_SERVICE[serviceKey] !== undefined;
};
const isKnownSingletonServiceType = (serviceKey) => {
    return SINGLETON_SERVICE[serviceKey] !== undefined;
};

const MESSAGES = {
    malformedBody: 'The requested action could not be exercised due to malformed syntax.',
    unauthorized: 'The provided credentials are either invalid or has insufficient privilege to perform the requested action.',
    notFound: 'The requested resource could not be found.',
    illegalMethod: 'The requested action is made using an illegal method.',
    unprocessable: 'The request was well-formed but not honored. Perhaps the action trying to be performed has already been done?',
    internal: 'Something went wrong. Please try again later.',
};
class HttpException extends Error {
    statusCode;
    error;
    constructor(message, statusCode, error) {
        super(message);
        this.statusCode = statusCode;
        this.error = error;
    }
    toResponse() {
        const response = {
            message: this.message,
        };
        if (typeof this.error !== 'undefined') {
            response.error = this.error;
        }
        return response;
    }
    static malformedBody(message = null, error) {
        return new HttpException(message || MESSAGES.malformedBody, 400, error);
    }
    static unauthorized(message = null, error) {
        return new HttpException(message || MESSAGES.unauthorized, 401, error);
    }
    static forbidden(message = null, error) {
        return new HttpException(message || MESSAGES.unauthorized, 403, error);
    }
    static notFound(message = null, error) {
        return new HttpException(message || MESSAGES.notFound, 404, error);
    }
    static illegalMethod(message = null, error) {
        return new HttpException(message || MESSAGES.illegalMethod, 405, error);
    }
    static unprocessable(message = null, error) {
        return new HttpException(message || MESSAGES.unprocessable, 422, error);
    }
    static internal(message = null, error) {
        return new HttpException(message || MESSAGES.internal, 500, error);
    }
}

class ScopedService {
    type = SERVICE_TYPE.SCOPED;
    request;
}
ScopedService.prototype.type = SERVICE_TYPE.SCOPED;

class SingletonService {
    type = SERVICE_TYPE.SINGLETON;
}
SingletonService.prototype.type = SERVICE_TYPE.SINGLETON;

class MiddlewareScopedService extends ScopedService {
    async beforeRequestHandler(response) { }
    async afterRequestHandler(response, result) {
        return result;
    }
}

class MiddlewareSingletonService extends SingletonService {
    async beforeRequestHandler(request, response) { }
    async afterRequestHandler(request, response, result) {
        return result;
    }
}

class ControllerService extends ScopedService {
    response;
}

class MediatorResultSuccess {
    success = true;
    value;
    context;
    constructor(value, context) {
        this.value = value;
        this.context = context;
    }
}
class MediatorResultFailure {
    success = false;
    error;
    context;
    constructor(err, context) {
        this.error = err;
        this.context = context;
    }
}
class BaseMediatorAction extends SingletonService {
    async execute(..._) {
        throw new Error('MediatorAction.execute method is not implemented');
    }
}

export { ACTION_RESULT, BaseMediatorAction, ControllerService, HTTP_METHOD, HttpException, INJECTABLE_ARG, LOG_LEVEL, META_DATA, MediatorResultFailure, MediatorResultSuccess, MiddlewareScopedService, MiddlewareSingletonService, SERVICE, SERVICE_TYPE, ScopedService, SingletonService, after, before, devLogger, injectArgFactory, injectService, isKnownScopedServiceType, isKnownSingletonServiceType, isServiceType };
