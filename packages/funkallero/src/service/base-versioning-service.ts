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
    private static readonly controllerVersioningCache: Map<string, IVersioningContext | HttpException> = new Map();

    @injectService(SERVICE.CONFIGURATION)
    private readonly config: IConfigurationService;

    public getContextFromHeaderVersioning(
        CustomController: Constructor<IControllerService>,
        customControllerPath: string,
        customControllerVersion: string | null,
        requestedVersion: string | null,
        route: IRoute,
        routes: IRoute[]
    ): IVersioningContext | HttpException {
        const cacheKey = this.generateCacheKey(
            CustomController,
            customControllerPath,
            customControllerVersion,
            requestedVersion,
            route
        );
        const cached = BaseVersioningService.controllerVersioningCache.get(cacheKey);

        if (cached) {
            devLogger('using cached header versioning context', cacheKey);
            return cached;
        }

        const matchedRoute = this.matchRoute(routes, route, requestedVersion, customControllerVersion);

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

        BaseVersioningService.controllerVersioningCache.set(cacheKey, result);

        return result;
    }

    public getPathContext(
        route: IRoute,
        controllerPath: string,
        controllerVersion: string | null
    ): IVersioningPathContext {
        const basePath = this.getBasePath(route);
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

    private generateCacheKey(
        CustomController: Constructor<IControllerService>,
        customControllerPath: string,
        customControllerVersion: string | null,
        requestedVersion: string | null,
        route: IRoute
    ) {
        return `${CustomController.name}-${customControllerPath}-${requestedVersion}-${!!route.html}-${route.path}-${
            route.method
        }-${route.basePath}-${route.version}-${customControllerVersion}`;
    }

    private getBasePath(route: IRoute) {
        if (route.basePath !== null) return route.basePath || '/';
        return this.config?.basePath || '/';
    }

    private cmpStrWithoutForwardSlash(s1: string, s2: string): boolean {
        return s1.replaceAll('/', '') === s2.replaceAll('/', '');
    }

    private matchRoute(
        routes: IRoute[],
        originRoute: IRoute,
        requestedVersion: string | null,
        controllerVersion: string | null
    ) {
        return routes.find((route) => {
            const pathMatch = this.cmpStrWithoutForwardSlash(route.path, originRoute.path);
            const basePathMatch = route.basePath === originRoute.basePath;
            const methodMatch = route.method === originRoute.method;
            const noVersions = !route.version && !requestedVersion && !controllerVersion;
            const versionRouteMatch = route.version !== null && route.version === requestedVersion;
            const pureControllerMatch = !route.version && controllerVersion === requestedVersion;

            return (
                pathMatch && methodMatch && basePathMatch && (noVersions || versionRouteMatch || pureControllerMatch)
            );
        });
    }

    private findRouteFromForeignControllers(
        CustomController: Constructor<IControllerService>,
        customControllerPath: string,
        requestedVersion: string | null,
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
            const currentRoutes: IRoute[] = Reflect.get(CurrentController.prototype, META_DATA.CONTROLLER_ROUTES);

            const matchedRoute = this.matchRoute(currentRoutes, route, requestedVersion, controllerVersion);

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
