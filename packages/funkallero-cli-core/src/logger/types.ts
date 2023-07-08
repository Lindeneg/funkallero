export type LoggerPayload = {
    readonly msg: string;
    readonly source?: string;
} & Record<string, unknown>;