import { type IAuthPoliciesInjection } from '@lindeneg/funkallero-core';
declare const auth: (policy: string | string[], injectUser?: IAuthPoliciesInjection['injectUser']) => (target: any, key: string, _: PropertyDescriptor) => void;
export default auth;
