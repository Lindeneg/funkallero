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
import LOG_LEVEL_COLOR from '../enums/log-level-color';

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
            const color = LOG_LEVEL_COLOR[level];
            const args: Array<string | Record<string, unknown>> = [color(msg)];

            if (this.configService.logLevel === LOG_LEVEL.VERBOSE && Object.keys(rest).length > 0) {
                args.push({ ...rest });
            }

            console.log(...args);
        }
    }
}

export default BaseLoggerService;
