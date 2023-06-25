import {
    devLogger,
    META_DATA,
    SERVICE,
    HttpException,
    type IAuthorizationService,
    type Constructor,
    type IAuthPoliciesInjection,
    type IAuthenticationService,
    type IControllerService,
} from '@lindeneg/funkallero-core';
import AuthServiceNotFoundError from '../../errors/auth-service-not-found-error';

class RouteAuthHandler {
    public static authPolicyInjectionCache: Map<string, IAuthPoliciesInjection> = new Map();

    private readonly routePath: string;

    constructor(routePath: string) {
        this.routePath = routePath;
    }

    public async handle(
        customController: IControllerService,
        authInjection: IAuthPoliciesInjection,
        services: Map<string, unknown>
    ) {
        const authorizationService = this.getAuthorizationService(services);

        await this.authorizePolicies(authInjection.policies, authorizationService);

        if (authInjection.injectUser) {
            const [key, value] = await this.getInjectContext(authInjection.injectUser, services);

            devLogger(
                'injecting auth user on',
                customController.constructor.name,
                'with context',
                authInjection.injectUser
            );

            (<any>customController)[key] = value;
        }
    }

    private async getInjectContext(
        injectUser: NonNullable<IAuthPoliciesInjection['injectUser']>,
        services: Map<string, unknown>
    ): Promise<[key: string, value: unknown]> {
        const authenticationService = this.getAuthenticationService(services);
        const requestUser = await authenticationService.getUser();

        let key;
        let value = requestUser;

        if (typeof injectUser === 'string') {
            key = injectUser;
        } else {
            key = injectUser.destProperty;
            value = requestUser[injectUser.srcProperty];
        }

        return [key, value];
    }

    private getAuthorizationService(services: Map<string, unknown>): IAuthorizationService {
        const authorizationService = services.get(SERVICE.AUTHORIZATION) as IAuthorizationService;

        if (!authorizationService) {
            devLogger('authorization service not found but is used on route', this.routePath);
            throw new AuthServiceNotFoundError(this.routePath);
        }

        return authorizationService;
    }

    private getAuthenticationService(services: Map<string, unknown>): IAuthenticationService {
        const authenticationService = services.get(SERVICE.AUTHENTICATION) as IAuthenticationService;

        if (!authenticationService) {
            devLogger('authentication service not found but is used on route via user injection', this.routePath);
            throw new AuthServiceNotFoundError(this.routePath, 'authentication');
        }

        return authenticationService;
    }

    private async authorizePolicies(authorizationPolicies: string[], authService: IAuthorizationService) {
        for (const policy of authorizationPolicies) {
            const isAuthorized = await authService.isAuthorized(policy);

            if (!isAuthorized) {
                throw HttpException.unauthorized();
            }
        }
    }

    public static getAuthorizationPolicyInjection(
        CustomController: Constructor<IControllerService>,
        handlerKey: string
    ): IAuthPoliciesInjection {
        const key = CustomController.name + handlerKey;
        const cached = RouteAuthHandler.authPolicyInjectionCache.get(key);

        if (cached) return cached;

        const policyMap = Reflect.get(CustomController.prototype, META_DATA.AUTHORIZATION_POLICIES) || {};
        const injection: IAuthPoliciesInjection = policyMap[handlerKey] || { policies: [], injectUser: null };

        RouteAuthHandler.authPolicyInjectionCache.set(key, injection);

        return injection;
    }
}

export default RouteAuthHandler;
