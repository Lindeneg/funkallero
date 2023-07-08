import type { NodePlopAPI } from 'node-plop';
import type { HelperDelegate as HandlebarHelperFn } from 'handlebars';
import type { AnyScaffoldAction } from '../action/types';
import logger from '../logger';

export const registerPlopAction = (plop: NodePlopAPI, register: AnyScaffoldAction['register']) => {
    try {
        const [key, fn] = register();

        plop.setActionType(key, fn);

        logger.verbose({
            msg: 'successfully registered plop action',
            source: 'main.registerPlopAction',
            key,
        });
    } catch (err) {
        logger.error({
            msg: 'Failed to register plop action',
            source: 'main.registerPlopAction',
            err,
        });
    }
};

export const registerPlopHelper = (plop: NodePlopAPI, key: string, helper: HandlebarHelperFn) => {
    try {
        plop.setHelper(key, helper);

        logger.verbose({
            msg: 'successfully registered handlebar helper',
            source: 'main.registerPlopHelper',
            key,
        });
    } catch (err) {
        logger.error({
            msg: 'Failed to register handlebar helper',
            source: 'main.registerPlopHelper',
            err,
        });
    }
};
