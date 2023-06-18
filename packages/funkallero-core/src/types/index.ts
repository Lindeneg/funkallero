import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';

export type Request = ExpressRequest & Record<'id', string> & Record<string, any>;
export type Response = ExpressResponse;
export type Constructor<T> = new () => T;

export interface IDomain<TId = string> {
    id: TId;
}

export interface IServiceInjection {
    serviceKey: string;
    instanceMember: string;
}

export type ServiceInjectionContext = Record<string, IServiceInjection[]>;

export interface IArgumentInjection<TSchema = any> {
    index: number;
    schema: TSchema | null;
    properties: string[];
}

export type Promisify<T> = T | Promise<T>;
