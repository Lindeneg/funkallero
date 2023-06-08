import chalk from 'chalk';
import { LOG_LEVEL } from '@lindeneg/funkallero-core';

const LOG_LEVEL_COLOR = {
    [LOG_LEVEL.INFO]: chalk.white,
    [LOG_LEVEL.WARNING]: chalk.yellow,
    [LOG_LEVEL.ERROR]: chalk.bgRed,
    [LOG_LEVEL.VERBOSE]: chalk.cyan,
    [LOG_LEVEL.SILENT]: chalk.hidden,
} as const;

export default LOG_LEVEL_COLOR;
