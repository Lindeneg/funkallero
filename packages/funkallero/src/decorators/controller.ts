import type { RouterOptions } from 'express';
import {
    META_DATA,
    HTTP_METHOD,
    type HttpMethodUnion,
    type IControllerService,
    type ControllerSettings,
    type IRoute,
    type Constructor,
} from '@lindeneg/funkallero-core';
import controllerContainer from '../container/controller-container';

const createRoute = (
    method: HttpMethodUnion,
    path: string,
    handlerKey: string,
    routerOptions?: RouterOptions
): IRoute => ({
    method,
    path,
    handlerKey,
    routerOptions,
});

const routeDecoratorFactory = (route: string, method: HttpMethodUnion, opts?: ControllerSettings) => {
    return function (target: any, key: string, _: PropertyDescriptor) {
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

export function controller<T extends Constructor<IControllerService>>(basePath = '') {
    return function (target: T) {
        Reflect.defineProperty(target, META_DATA.CONTROLLER_PATH, {
            get: () => basePath,
        });
        controllerContainer.register(target);
    };
}

export function httpGet(route = '', opts?: ControllerSettings) {
    return routeDecoratorFactory(route, HTTP_METHOD.GET, opts);
}

export function httpPost(route = '', opts?: ControllerSettings) {
    return routeDecoratorFactory(route, HTTP_METHOD.POST, opts);
}

export function httpPut(route = '', opts?: ControllerSettings) {
    return routeDecoratorFactory(route, HTTP_METHOD.PUT, opts);
}

export function httpPatch(route = '', opts?: ControllerSettings) {
    return routeDecoratorFactory(route, HTTP_METHOD.PATCH, opts);
}

export function httpDelete(route = '', opts?: ControllerSettings) {
    return routeDecoratorFactory(route, HTTP_METHOD.DELETE, opts);
}
