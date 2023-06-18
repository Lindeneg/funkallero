import 'reflect-metadata';
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
        if (!Reflect.hasMetadata(META_DATA.CONTROLLER_ROUTES, target)) {
            Reflect.defineMetadata(META_DATA.CONTROLLER_ROUTES, [], target);
        }

        const routes = Reflect.getMetadata(META_DATA.CONTROLLER_ROUTES, target);
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
        Reflect.defineMetadata(META_DATA.CONTROLLER_PATH, basePath, target);
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
