import { ScopedService, type Request, type IAuthenticationService, type IAuthorizationService, type ITokenService, type Promisify } from '@lindeneg/funkallero-core';
export type PolicyHandlerPayload<TCustomArgs, TAuthModel = any> = {
    decodedToken: TAuthModel;
    request: Request;
} & TCustomArgs;
export interface IAuthorizationPolicy<TCustomArgs, TAuthModel = any> {
    name: string;
    handler(context: PolicyHandlerPayload<TCustomArgs, TAuthModel>): Promisify<boolean>;
}
export type AuthorizationPolicyHandlerFn<TCustomArgs, TAuthModel = any> = (context: PolicyHandlerPayload<TCustomArgs, TAuthModel>) => Promisify<boolean>;
declare abstract class BaseAuthorizationService<TAuthHandlerFn extends AuthorizationPolicyHandlerFn<any, any>> extends ScopedService implements IAuthorizationService {
    private static policies;
    protected readonly authService: IAuthenticationService<any>;
    protected readonly tokenService: ITokenService<any>;
    private readonly logger;
    static addPolicy(...policies: [name: string, handler: AuthorizationPolicyHandlerFn<any>][]): typeof BaseAuthorizationService;
    protected abstract getCustomPolicyArgs(): Promisify<Omit<Parameters<TAuthHandlerFn>[0], 'decodedToken' | 'request'>>;
    isAuthorized(policyName: string): Promise<boolean>;
}
export default BaseAuthorizationService;
