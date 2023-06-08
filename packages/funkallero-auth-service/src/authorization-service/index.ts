import {
    SERVICE,
    injectService,
    ScopedService,
    type Request,
    type IAuthenticationService,
    type IAuthorizationService,
    type ILoggerService,
    type ITokenService,
    type Promisify,
} from '@lindeneg/funkallero-core';

export type PolicyHandlerPayload<TCustomArgs, TAuthModel = any> = {
    decodedToken: TAuthModel;
    request: Request;
} & TCustomArgs;

export interface IAuthorizationPolicy<TCustomArgs, TAuthModel = any> {
    name: string;
    handler(context: PolicyHandlerPayload<TCustomArgs, TAuthModel>): Promisify<boolean>;
}

export type AuthorizationPolicyHandlerFn<TCustomArgs, TAuthModel = any> = (
    context: PolicyHandlerPayload<TCustomArgs, TAuthModel>
) => Promisify<boolean>;

abstract class BaseAuthorizationService<TAuthHandlerFn extends AuthorizationPolicyHandlerFn<any, any>>
    extends ScopedService
    implements IAuthorizationService
{
    private static policies: IAuthorizationPolicy<any>[] = [];

    @injectService(SERVICE.AUTHENTICATION)
    protected readonly authService: IAuthenticationService<any>;

    @injectService(SERVICE.TOKEN)
    protected readonly tokenService: ITokenService<any>;

    @injectService(SERVICE.LOGGER)
    private readonly logger: ILoggerService;

    public static addPolicy(...policies: [name: string, handler: AuthorizationPolicyHandlerFn<any>][]) {
        policies.forEach(([name, handler]) => BaseAuthorizationService.policies.push({ name, handler }));
        return BaseAuthorizationService;
    }

    protected abstract getCustomPolicyArgs(): Promisify<
        Omit<Parameters<TAuthHandlerFn>[0], 'decodedToken' | 'request'>
    >;

    public async isAuthorized(policyName: string) {
        const policy = BaseAuthorizationService.policies.find((p) => p.name === policyName);

        if (!policy) {
            this.logger.error({
                msg: `BaseAuthorizationServiceError: policy '${policyName}' not found`,
                requestId: this.request.id,
            });
            return false;
        }

        const decodedToken = await this.authService.getDecodedTokenSafe();

        if (!decodedToken) return false;

        const handlerArgs = await this.getCustomPolicyArgs();

        const authorized = await policy.handler({
            ...handlerArgs,
            decodedToken,
            request: this.request,
        });

        this.logger.verbose({
            msg: 'authorization policy result',
            requestId: this.request.id,
            policyName,
            authorized,
        });

        return authorized;
    }
}

export default BaseAuthorizationService;
