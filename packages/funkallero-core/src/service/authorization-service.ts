import type { Promisify } from '../types';

interface IAuthorizationService {
    isAuthorized(contextKey: string): Promisify<boolean>;
}

export default IAuthorizationService;
