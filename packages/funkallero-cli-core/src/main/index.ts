import type { NodePlopAPI } from 'node-plop';
import {
    initializeGenerator,
    initializeScaffoldRegister,
    initializeCommonActions,
    initializeCommonHelpers,
} from './initialize';
import logger, { detectLogLevel } from '../logger';
import argvState from '../argv-flags/state';
import type { AnyScaffoldGenerator } from '../generator/types';

type Generators = Record<string, AnyScaffoldGenerator>;

const setPlopGenerators = (plop: NodePlopAPI, generators: Generators, destPath: string, argv: string[]) => {
    const register = initializeScaffoldRegister(plop);
    const boundInitializeGenerator = initializeGenerator.bind(null, plop, destPath, argv, register);

    Object.values(generators).forEach((generator) => {
        if (!generator.enabled) {
            logger.verbose({
                msg: 'skipping generator',
                generator,
                source: 'main.setPlopGenerators',
            });
            return;
        }
        boundInitializeGenerator(generator);
    });
};

const setupEnvironment = (plop: NodePlopAPI) => {
    const destPath = plop.getDestBasePath();
    const argv = process.argv.slice(3);

    argvState.set(argv);
    detectLogLevel();

    logger.verbose({
        msg: 'verbose mode detected.' + ' run with lower log-level for cleaner output..',
    });

    plop.setWelcomeMessage('Welcome to Scaffold. Please choose a generator.');

    initializeCommonActions(plop);
    initializeCommonHelpers(plop);

    return [destPath, argv] as const;
};

export default (generators: Generators): ((plop: NodePlopAPI) => void) =>
    (plop) => {
        const [destPath, argv] = setupEnvironment(plop);

        setPlopGenerators(plop, generators, destPath, argv);
    };
