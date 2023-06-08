import {
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
    route: string,
    handlerKey: string,
    authorizationPolicy: string[]
): IRoute => ({
    method,
    route,
    handlerKey,
    authorizationPolicy,
});

const routeDecoratorFactory = (route: string, { authPolicy }: IControllerSettings, method: HttpMethodUnion) => {
    return function (target: any, key: string, _: PropertyDescriptor) {
        if (!Array.isArray(target.routes)) {
            target.routes = [];
        }

        let authPolicies: string[] = [];

        if (typeof authPolicy === 'string') {
            authPolicies = [authPolicy];
        } else if (Array.isArray(authPolicy)) {
            authPolicies = authPolicy;
        }

        target.routes.push(createRoute(method, route, key, authPolicies));
    };
};

export function controller<T extends Constructor<IControllerService>>(baseRoute: string) {
    return function (target: T) {
        target.prototype.baseRoute = baseRoute;
        controllerContainer.register(target);
    };
}

export function httpGet(route = '', { authPolicy }: IControllerSettings = {}) {
    return routeDecoratorFactory(route, { authPolicy }, HTTP_METHOD.GET);
}

export function httpPost(route = '', { authPolicy }: IControllerSettings = {}) {
    return routeDecoratorFactory(route, { authPolicy }, HTTP_METHOD.POST);
}

export function httpPut(route = '', { authPolicy }: IControllerSettings = {}) {
    return routeDecoratorFactory(route, { authPolicy }, HTTP_METHOD.PUT);
}

export function httpPatch(route = '', { authPolicy }: IControllerSettings = {}) {
    return routeDecoratorFactory(route, { authPolicy }, HTTP_METHOD.PATCH);
}

export function httpDelete(route = '', { authPolicy }: IControllerSettings = {}) {
    return routeDecoratorFactory(route, { authPolicy }, HTTP_METHOD.DELETE);
}
