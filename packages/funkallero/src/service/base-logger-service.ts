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

export type BaseLoggerPaletteColor = string;
export type BaseLoggerPaletteColorExtended = BaseLoggerPaletteColor | ((msg: string) => string);
export type BaseLoggerPaletteObj = Record<LogLevelUnion, BaseLoggerPaletteColorExtended>;
export type BaseLoggerPalette = Map<LogLevelUnion, BaseLoggerPaletteColorExtended>;

const DISABLE_LOGGER = process.argv[2] === '--disable-funkallero-logger';

const EMPTY_PALETTE = {
    [LOG_LEVEL.INFO]: '',
    [LOG_LEVEL.WARNING]: '',
    [LOG_LEVEL.ERROR]: '',
    [LOG_LEVEL.VERBOSE]: '',
    [LOG_LEVEL.SILENT]: '',
} as const;

export class BaseLoggerServicePalette {
    private static readonly palette: BaseLoggerPalette = new Map();

    public static getColor(level: LogLevelUnion, msg = ''): BaseLoggerPaletteColor {
        const match = BaseLoggerServicePalette.palette.get(level);

        if (typeof match === 'function') {
            return match(msg);
        }

        if (typeof match === 'string') {
            return match + ' ' + msg;
        }

        return msg;
    }

    public static setPalette(palette: Partial<BaseLoggerPaletteObj>) {
        const colors = Object.entries(palette);
        for (const [level, color] of colors) {
            BaseLoggerServicePalette.palette.set(Number.parseInt(level) as LogLevelUnion, color);
        }
    }

    public static resetPalette() {
        BaseLoggerServicePalette.setPalette(EMPTY_PALETTE);
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
        if (DISABLE_LOGGER) return;
        if (typeof payload === 'string') return this.log({ msg: payload, level });
        this.log({ ...payload, level });
    }

    private log({ msg, level, force = false, ...rest }: ILoggerPayloadWithLevel) {
        if (this.configService.logLevel === LOG_LEVEL.SILENT || level === LOG_LEVEL.SILENT) return;

        if (force || this.configService.logLevel >= level) {
            const coloredMsg = BaseLoggerServicePalette.getColor(level, msg);
            const args: Array<string | Record<string, unknown>> = coloredMsg ? [coloredMsg] : [];

            if (this.configService.logLevel === LOG_LEVEL.VERBOSE && Object.keys(rest).length > 0) {
                args.push({ ...rest });
            }

            console.log(...args);
        }
    }
}

export default BaseLoggerService;
