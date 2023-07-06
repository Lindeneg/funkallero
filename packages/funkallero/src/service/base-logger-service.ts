import {
    SERVICE,
    LOG_LEVEL,
    injectService,
    SingletonService,
    type LogLevelUnion,
    type IConfigurationService,
    type ILoggerService,
    type ILoggerPayloadWithLevel,
    type LoggerPayload,
} from '@lindeneg/funkallero-core';

export type BaseLoggerPaletteColor = string | ((msg: string) => string);
export type BaseLoggerPaletteObj = Record<LogLevelUnion, BaseLoggerPaletteColor>;
export type BaseLoggerPalette = Map<LogLevelUnion, BaseLoggerPaletteColor>;

const EMPTY_PALETTE = {
    [LOG_LEVEL.INFO]: '',
    [LOG_LEVEL.WARNING]: '',
    [LOG_LEVEL.ERROR]: '',
    [LOG_LEVEL.VERBOSE]: '',
    [LOG_LEVEL.SILENT]: '',
} as const;

const DEFAULT_PALETTE = {
    [LOG_LEVEL.INFO]: '\x1b[32m%s\x1b[0m',
    [LOG_LEVEL.WARNING]: '\x1b[33m%s\x1b[0m',
    [LOG_LEVEL.ERROR]: '\x1b[31m%s\x1b[0m',
    [LOG_LEVEL.VERBOSE]: '\x1b[36m%s\x1b[0m',
    [LOG_LEVEL.SILENT]: '',
} as const;

export class BaseLoggerServicePalette {
    private static readonly palette: BaseLoggerPalette = new Map();

    public static getColor(level: LogLevelUnion, msg = ''): Array<string | Record<string, unknown>> {
        const match = BaseLoggerServicePalette.palette.get(level);

        if (typeof match === 'function') {
            return [match(msg)];
        }

        if (typeof match === 'string') {
            return [match, msg];
        }

        return [msg];
    }

    public static setPalette(palette: Partial<BaseLoggerPaletteObj>) {
        const colors = Object.entries(palette);
        for (const [level, color] of colors) {
            BaseLoggerServicePalette.palette.set(Number.parseInt(level) as LogLevelUnion, color);
        }
    }

    public static useEmptyPalette() {
        BaseLoggerServicePalette.setPalette(EMPTY_PALETTE);
    }

    public static useDefaultPalette() {
        BaseLoggerServicePalette.setPalette(DEFAULT_PALETTE);
    }
}

class BaseLoggerService extends SingletonService implements ILoggerService {
    @injectService(SERVICE.CONFIGURATION)
    private readonly configService: IConfigurationService;

    public info(payload: LoggerPayload | string) {
        this.prepare(payload, LOG_LEVEL.INFO);
    }

    public warning(payload: LoggerPayload | string) {
        this.prepare(payload, LOG_LEVEL.WARNING);
    }

    public error(payload: LoggerPayload | string) {
        this.prepare(payload, LOG_LEVEL.ERROR);
    }

    public verbose(payload: LoggerPayload | string) {
        this.prepare(payload, LOG_LEVEL.VERBOSE);
    }

    private prepare(payload: LoggerPayload | string, level: LogLevelUnion) {
        if (typeof payload === 'string') return this.log({ msg: payload, level });
        this.log({ ...payload, level });
    }

    private log({ msg, level, force = false, ...rest }: ILoggerPayloadWithLevel) {
        if (this.configService.logLevel === LOG_LEVEL.SILENT || level === LOG_LEVEL.SILENT) return;

        if (force || this.configService.logLevel >= level) {
            const args = BaseLoggerServicePalette.getColor(level, msg);

            if (this.configService.logLevel === LOG_LEVEL.VERBOSE && Object.keys(rest).length > 0) {
                args.push({ ...rest });
            }

            console.log(...args);
        }
    }
}

export default BaseLoggerService;
