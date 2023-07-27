import type AuthModel from '../models/auth-model';

declare global {
    namespace Express {
        interface Request {
            userData?: AuthModel;
        }
    }
}
