import type { Express } from 'express';
import type { Promisify } from '../types';

interface IExpressService {
    app: Express;
    setup(): Promisify<void>;
    startup(): Promisify<void>;
    onLastRouteAdded?(): Promisify<void>;
}

export default IExpressService;
