import logger from '../../logger';
import createAction from '../create-action';
import { asyncExec } from '../logic';

interface FormatFilesPayload {
    dirPath: string;
    npxCommand?: string;
    prettierConfigPath?: string;
}

const getPrettierNpxCommand = (dirPath: string, configPath?: string): string => {
    const options = configPath ? `--config ${configPath}` : '';
    return `npx prettier ${options} --write ${dirPath}`;
};

export default createAction<FormatFilesPayload>(
    'format-with-prettier',
    async (_, { dirPath, npxCommand, prettierConfigPath }) => {
        try {
            const cmd = npxCommand ? npxCommand : getPrettierNpxCommand(dirPath, prettierConfigPath);

            logger.info({
                msg: 'formatting directory files.. please wait..',
                source: 'commonActions.formatWithPrettier',
                cmd,
            });

            await asyncExec(cmd);

            return 'successful';
        } catch (err) {
            const msg = 'failed to format files';

            logger.error({
                source: 'commonActions.formatWithPrettier',
                msg,
                err,
                dirPath,
                npxCommand,
                prettierConfigPath,
            });

            throw msg;
        }
    }
);
