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

const getRouteBasePath = (basePathOpt: ControllerSettings['basePath']) => {
    if (basePathOpt === false) return '/';
    if (typeof basePathOpt === 'string') return basePathOpt;
    return null;
};

const createRoute = (method: HttpMethodUnion, path: string, handlerKey: string, opts?: ControllerSettings): IRoute => ({
    method,
    path,
    handlerKey,
    version: opts?.version || null,
    basePath: getRouteBasePath(opts?.basePath),
    html: opts?.html || false,
    routerOptions: opts?.options,
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

export function controller<T extends Constructor<IControllerService>>(basePath = '', version: string | null = null) {
    return function (target: T) {
        Reflect.defineProperty(target, META_DATA.CONTROLLER_PATH, {
            get: () => basePath,
        });
        Reflect.defineProperty(target, META_DATA.CONTROLLER_VERSION, {
            get: () => version,
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

export function view(
    route = '',
    opts: ControllerSettings = {
        basePath: false,
        html: true,
    }
) {
    return routeDecoratorFactory(route, HTTP_METHOD.GET, opts);
}
