const LOG_LEVEL = {
    ERROR: 0,
    WARNING: 1,
    INFO: 2,
    VERBOSE: 3,
    SILENT: 4,
} as const;

export type LogLevelUnion = typeof LOG_LEVEL[keyof typeof LOG_LEVEL];

export default LOG_LEVEL;
