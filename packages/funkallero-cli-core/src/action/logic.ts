import { exec } from 'child_process';
import { lstat } from 'fs/promises';
import { promisify } from 'util';
import type { ActionType } from 'plop';
import logger from '../logger';

const _asyncExec = promisify(exec);

export const asyncExec = async (...args: Parameters<typeof _asyncExec>): Promise<void> => {
    try {
        const { stderr } = await _asyncExec(...args);

        if (stderr) {
            logger.warning({
                msg: 'stderr output while executing command',
                source: 'action.logic.asyncExec',
                args,
                stderr,
            });
        }
    } catch (err) {
        logger.error({
            msg: 'failed to execute command',
            source: 'action.logic.asyncExec',
            args,
            err,
        });
        return;
    }
};

export const concatActions = (...actions: Array<readonly ActionType[]>): readonly ActionType[] => {
    return actions.reduce((arr, cur) => arr.concat(...cur), []);
};

export const isDirectory = async (target: string): Promise<boolean> => {
    try {
        const stat = await lstat(target);
        return stat.isDirectory();
    } catch (err) {
        if ((err as Record<'code', string>)?.code !== 'ENOENT') {
            logger.error({
                msg: 'error while checking existence of directory',
                source: 'action.logic.isDirectory',
                target,
                err,
            });
        }
    }
    return false;
};
