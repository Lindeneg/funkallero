import type { Promisify } from '../types';

interface IAuthorizationService {
    isAuthorized(policyName: string): Promisify<boolean>;
}

export default IAuthorizationService;
