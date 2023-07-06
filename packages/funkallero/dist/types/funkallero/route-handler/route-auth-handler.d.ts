import { type Constructor, type IAuthPoliciesInjection, type IControllerService } from '@lindeneg/funkallero-core';
declare class RouteAuthHandler {
    static authPolicyInjectionCache: Map<string, IAuthPoliciesInjection>;
    private readonly routePath;
    constructor(routePath: string);
    handle(customController: IControllerService, authInjection: IAuthPoliciesInjection, services: Map<string, unknown>): Promise<void>;
    private getInjectContext;
    private getAuthorizationService;
    private getAuthenticationService;
    private authorizePolicies;
    static getAuthorizationPolicyInjection(CustomController: Constructor<IControllerService>, handlerKey: string): IAuthPoliciesInjection;
}
export default RouteAuthHandler;
