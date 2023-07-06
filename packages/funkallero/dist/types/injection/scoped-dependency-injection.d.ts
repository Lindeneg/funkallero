import { type IScopedService, type Constructor, type Request, type Response, type IControllerService } from '@lindeneg/funkallero-core';
import DependencyInjection from './dependency-injection';
type ControllerOptions = {
    response: Response;
    hasAuthPolicies: boolean;
} | null;
declare class ScopedDependencyInjection<TService extends IScopedService | IControllerService> extends DependencyInjection {
    private readonly Service;
    private readonly request;
    private readonly controllerOptions;
    private readonly scopedServices;
    private readonly filteredServiceInjections;
    constructor(request: Request, Service: Constructor<TService>, scopedServices: Map<string, IScopedService>, controllerOptions?: ControllerOptions);
    inject(): Promise<TService>;
    private prepare;
    private injectScopedServices;
    private injectServicesIntoService;
    private setScopedDependencies;
    private injectSingletonDependencies;
    private setDefaultAuthorizationServiceIfNeeded;
}
export default ScopedDependencyInjection;
