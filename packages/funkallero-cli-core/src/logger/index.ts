import chalk from 'chalk';
import { hasFlag, getFlagValue } from '../argv-flags/logic';
import type { LoggerPayload } from './types';

const LOG_LEVEL = {
    INFO: 0,
    WARNING: 1,
    ERROR: 2,
    VERBOSE: 3,
} as const;

const LOG_LEVEL_COLOR = {
    [LOG_LEVEL.INFO]: chalk.white,
    [LOG_LEVEL.WARNING]: chalk.yellow,
    [LOG_LEVEL.ERROR]: chalk.bgRed,
    [LOG_LEVEL.VERBOSE]: chalk.cyan,
} as const;

type LogLevel = typeof LOG_LEVEL[keyof typeof LOG_LEVEL];

interface LoggerPayloadWithLevel extends LoggerPayload {
    readonly level: LogLevel;
    readonly force?: boolean;
}

const state = {
    logLevel: 0,
};

const log = ({ msg, level, force = false, ...rest }: LoggerPayloadWithLevel) => {
    if (force || state.logLevel >= level) {
        const color = LOG_LEVEL_COLOR[level];
        const args: Array<string | Record<string, unknown>> = [color(msg)];

        if (state.logLevel === LOG_LEVEL.VERBOSE) {
            args.push({ ...rest, level });
        }

        console.log(...args);
    }
};

const info = (payload: LoggerPayload): void => log({ ...payload, level: LOG_LEVEL.INFO });
const warning = (payload: LoggerPayload): void => log({ ...payload, level: LOG_LEVEL.WARNING });
const error = (payload: LoggerPayload): void => log({ ...payload, level: LOG_LEVEL.ERROR });
const verbose = (payload: LoggerPayload): void => log({ ...payload, level: LOG_LEVEL.VERBOSE });

export const detectLogLevel = (): void => {
    if (hasFlag('verbose')) {
        state.logLevel = LOG_LEVEL.VERBOSE;
        return;
    }

    const maybeLogLevel = getFlagValue('log-level');

    if (maybeLogLevel) {
        const parsedLogLevel = Number.parseInt(maybeLogLevel);
        if (parsedLogLevel >= LOG_LEVEL.INFO && parsedLogLevel <= LOG_LEVEL.VERBOSE) {
            state.logLevel = parsedLogLevel;
            return;
        }
        log({
            level: LOG_LEVEL.ERROR,
            force: true,
            msg:
                `Invalid log-level "${maybeLogLevel}".` +
                ` Must be a number between ${LOG_LEVEL.INFO}` +
                ` and ${LOG_LEVEL.VERBOSE}`,
        });
    }

    state.logLevel = LOG_LEVEL.INFO;
};

export default {
    info,
    warning,
    error,
    verbose,
};
