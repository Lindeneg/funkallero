import { SingletonService, type LogLevelUnion, type ILoggerService, type LoggerPayload } from '@lindeneg/funkallero-core';
export type BaseLoggerPaletteColor = string | ((msg: string) => string);
export type BaseLoggerPaletteObj = Record<LogLevelUnion, BaseLoggerPaletteColor>;
export type BaseLoggerPalette = Map<LogLevelUnion, BaseLoggerPaletteColor>;
export declare class BaseLoggerServicePalette {
    private static readonly palette;
    static getColor(level: LogLevelUnion, msg?: string): Array<string | Record<string, unknown>>;
    static setPalette(palette: Partial<BaseLoggerPaletteObj>): void;
    static useEmptyPalette(): void;
    static useDefaultPalette(): void;
}
declare class BaseLoggerService extends SingletonService implements ILoggerService {
    private readonly configService;
    info(payload: LoggerPayload | string): void;
    warning(payload: LoggerPayload | string): void;
    error(payload: LoggerPayload | string): void;
    verbose(payload: LoggerPayload | string): void;
    private prepare;
    private log;
}
export default BaseLoggerService;
