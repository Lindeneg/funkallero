import type { NextFunction } from 'express';
import type { Request, Response } from '../types';
export type ExpressErrorHandlerFn = (err: any, request: Request, response: Response, next: NextFunction) => void;
export type ExpressErrorHandlerFnArgs = Parameters<ExpressErrorHandlerFn>;
interface IExpressErrorHandlerService {
    handler: ExpressErrorHandlerFn;
}
export default IExpressErrorHandlerService;
