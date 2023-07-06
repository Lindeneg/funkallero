declare const LOG_LEVEL: {
    readonly ERROR: 0;
    readonly WARNING: 1;
    readonly INFO: 2;
    readonly VERBOSE: 3;
    readonly SILENT: 4;
};
export type LogLevelUnion = typeof LOG_LEVEL[keyof typeof LOG_LEVEL];
export default LOG_LEVEL;
