import type { RouterOptions } from 'express';
import {
    META_DATA,
    HTTP_METHOD,
    type HttpMethodUnion,
    type IControllerService,
    type IControllerSettings,
    type IRoute,
    type Constructor,
} from '@lindeneg/funkallero-core';
import controllerContainer from '../container/controller-container';

const createRoute = (
    method: HttpMethodUnion,
    path: string,
    handlerKey: string,
    authorizationPolicy: string[],
    routerOptions: RouterOptions = {}
): IRoute => ({
    method,
    path,
    handlerKey,
    authorizationPolicy,
    routerOptions,
});

const routeDecoratorFactory = (route: string, opts: IControllerSettings, method: HttpMethodUnion) => {
    return function (target: any, key: string, _: PropertyDescriptor) {
        let routes = Reflect.get(target, META_DATA.CONTROLLER_ROUTES);

        if (!routes) {
            routes = [];
            Reflect.defineProperty(target, META_DATA.CONTROLLER_ROUTES, {
                get: () => routes,
            });
        }

        let authPolicies: string[] = [];

        if (typeof opts.authPolicy === 'string') {
            authPolicies = [opts.authPolicy];
        } else if (Array.isArray(opts.authPolicy)) {
            authPolicies = opts.authPolicy;
        }

        routes.push(createRoute(method, route, key, authPolicies, opts.options));
    };
};

export function controller<T extends Constructor<IControllerService>>(basePath = '') {
    return function (target: T) {
        Reflect.defineProperty(target, META_DATA.CONTROLLER_PATH, {
            get: () => basePath,
        });
        controllerContainer.register(target);
    };
}

export function httpGet(route = '', opts: IControllerSettings = {}) {
    return routeDecoratorFactory(route, opts, HTTP_METHOD.GET);
}

export function httpPost(route = '', opts: IControllerSettings = {}) {
    return routeDecoratorFactory(route, opts, HTTP_METHOD.POST);
}

export function httpPut(route = '', opts: IControllerSettings = {}) {
    return routeDecoratorFactory(route, opts, HTTP_METHOD.PUT);
}

export function httpPatch(route = '', opts: IControllerSettings = {}) {
    return routeDecoratorFactory(route, opts, HTTP_METHOD.PATCH);
}

export function httpDelete(route = '', opts: IControllerSettings = {}) {
    return routeDecoratorFactory(route, opts, HTTP_METHOD.DELETE);
}
