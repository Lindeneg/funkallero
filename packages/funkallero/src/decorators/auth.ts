import { META_DATA, devLogger, type IAuthPoliciesInjection } from '@lindeneg/funkallero-core';
import { ensureStringArray } from './shared';

const auth = (policy: string | string[], injectUser: IAuthPoliciesInjection['injectUser'] = null) => {
    return function (target: any, key: string, _: PropertyDescriptor) {
        const policies = ensureStringArray(policy);
        let authPoliciesMap: Record<string, IAuthPoliciesInjection> = Reflect.get(
            target,
            META_DATA.AUTHORIZATION_POLICIES
        );

        if (!authPoliciesMap) {
            authPoliciesMap = {};
            Reflect.defineProperty(target, META_DATA.AUTHORIZATION_POLICIES, {
                get: () => authPoliciesMap,
            });
        }

        if (Array.isArray(authPoliciesMap[key])) {
            const current = authPoliciesMap[key];

            current.policies.push(...policies);

            if (injectUser !== null && current.injectUser === null) {
                current.injectUser = injectUser;
            }

            devLogger('auth policies on', key, current);

            return;
        }

        const injection: IAuthPoliciesInjection = {
            policies,
            injectUser,
        };

        authPoliciesMap[key] = injection;

        devLogger('auth policies on', key, authPoliciesMap[key]);
    };
};

export default auth;
