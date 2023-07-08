import fs from 'fs/promises';
import createAction from '../create-action';
import logger from '../../logger';

interface CreateDirectoryPayload {
    dirPath: string;
    recursive?: boolean;
}

export default createAction<CreateDirectoryPayload>('create-directory', async (_, { dirPath, recursive = false }) => {
    try {
        await fs.mkdir(dirPath, { recursive });

        return 'successful';
    } catch (err) {
        const msg = 'failed to create directory';

        logger.error({
            source: 'commonActions.createDirectory',
            msg,
            err,
            dirPath,
            recursive,
        });

        throw msg;
    }
});
