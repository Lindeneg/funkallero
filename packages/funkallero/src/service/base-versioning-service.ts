import urlJoin from 'url-join';
import controllerContainer from '../container/controller-container';
import {
    devLogger,
    SERVICE,
    META_DATA,
    injectService,
    SingletonService,
    HttpException,
    type Constructor,
    type IConfigurationService,
    type IControllerService,
    type IVersioningService,
    type IVersioningContext,
    type IVersioningPathContext,
    type IRoute,
} from '@lindeneg/funkallero-core';

class BaseVersioningService extends SingletonService implements IVersioningService {
    private static readonly controllerVersioningCache: Map<string, IVersioningContext> = new Map();

    @injectService(SERVICE.CONFIGURATION)
    private readonly config: IConfigurationService;

    public getContextFromHeaderVersioning(
        CustomController: Constructor<IControllerService>,
        customControllerPath: string,
        customControllerVersion: string | null,
        requestedVersion: string,
        route: IRoute,
        routes: IRoute[]
    ): IVersioningContext | HttpException {
        const cacheKey = `${CustomController.name}-${customControllerPath}-${requestedVersion}-${route.path}-${route.method}-${route.version}-${customControllerVersion}`;
        const cached = BaseVersioningService.controllerVersioningCache.get(cacheKey);

        if (cached) {
            devLogger('using cached header versioning context', cacheKey);
            return cached;
        }

        const matchedRoute = this.matchRoute(
            routes,
            route,
            requestedVersion,
            customControllerVersion === requestedVersion
        );

        let result: IVersioningContext | HttpException;

        if (matchedRoute) {
            result = {
                CustomController,
                route: matchedRoute,
            };
        } else {
            result = this.findRouteFromForeignControllers(
                CustomController,
                customControllerPath,
                requestedVersion,
                route
            );
        }

        devLogger('header versioning result', cacheKey, result);

        if (!(result instanceof HttpException)) {
            BaseVersioningService.controllerVersioningCache.set(cacheKey, result);
        }

        return result;
    }

    public getPathContext(
        route: IRoute,
        controllerPath: string,
        controllerVersion: string | null
    ): IVersioningPathContext {
        const basePath = this.config?.basePath || '/';
        const controllerVs = controllerVersion || '';

        if (this.config.versioning?.type === 'url') {
            const routeVersion = route.version
                ? route.version.startsWith('/')
                    ? route.version
                    : `/${route.version}`
                : '';
            if (routeVersion) {
                return {
                    routePath: urlJoin(routeVersion, route.path),
                    basePath: urlJoin(basePath, controllerPath),
                };
            } else {
                return {
                    routePath: route.path,
                    basePath: urlJoin(basePath, controllerVs, controllerPath),
                };
            }
        }

        const version = route.version || controllerVs;

        return {
            routePath: route.path,
            basePath: urlJoin(basePath, controllerPath),
            version:
                this.config.versioning?.type === 'header' && version
                    ? `${this.config.versioning.headerName}=>${version}`
                    : undefined,
        };
    }

    private cmpStrWithoutForwardSlash(s1: string, s2: string): boolean {
        return s1.replaceAll('/', '') === s2.replaceAll('/', '');
    }

    private matchRoute(
        routes: IRoute[],
        originRoute: IRoute,
        requestedVersion: string,
        controllerVersionMatch: boolean
    ) {
        return routes.find(
            (route) =>
                this.cmpStrWithoutForwardSlash(route.path, originRoute.path) &&
                route.method === originRoute.method &&
                (route.version === requestedVersion || (!route.version && controllerVersionMatch))
        );
    }

    private findRouteFromForeignControllers(
        CustomController: Constructor<IControllerService>,
        customControllerPath: string,
        requestedVersion: string,
        route: IRoute
    ) {
        const controllers = controllerContainer.getAll();

        for (const CurrentController of controllers) {
            const currentControllerPath = Reflect.get(CurrentController, META_DATA.CONTROLLER_PATH) || '/';
            if (
                CurrentController === CustomController ||
                !this.cmpStrWithoutForwardSlash(currentControllerPath, customControllerPath)
            ) {
                continue;
            }

            const controllerVersion: string | null = Reflect.get(CurrentController, META_DATA.CONTROLLER_VERSION);

            const controllerVersionMatch = controllerVersion === requestedVersion;

            const currentRoutes: IRoute[] = Reflect.get(CurrentController.prototype, META_DATA.CONTROLLER_ROUTES);

            const matchedRoute = this.matchRoute(currentRoutes, route, requestedVersion, controllerVersionMatch);

            if (matchedRoute) {
                return {
                    CustomController: CurrentController,
                    route: matchedRoute,
                };
            }
        }

        return HttpException.notFound(`route not found for version ${requestedVersion}`);
    }
}

export default BaseVersioningService;
