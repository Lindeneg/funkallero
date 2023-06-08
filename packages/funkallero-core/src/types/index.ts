import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';

export type Request = ExpressRequest & Record<'id', string> & Record<string, any>;
export type Response = ExpressResponse;
export type Constructor<T> = new () => T;

export interface IDomain<TId = string> {
    id: TId;
}

export interface Injection {
    serviceKey: string;
    instanceMember: string;
}

export type InjectionContext = Record<string, Injection[]>;

export type Promisify<T> = T | Promise<T>;
