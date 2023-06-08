import type { LogLevelUnion } from '../enums/log-level';

export type LoggerPayload = {
    readonly msg: string;
    readonly source?: string;
    readonly force?: boolean;
} & Record<string, unknown>;

export declare function Logger(payload: LoggerPayload): void;
export declare function Logger(payload: string): void;

export type LoggerFn = typeof Logger;

export interface ILoggerPayloadWithLevel extends LoggerPayload {
    readonly level: LogLevelUnion;
}

interface ILoggerService {
    info: LoggerFn;
    warning: LoggerFn;
    error: LoggerFn;
    verbose: LoggerFn;
}

export default ILoggerService;
