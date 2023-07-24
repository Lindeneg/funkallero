import {
    joinPath,
    createGenerator,
    modulePrompt,
    createDirectory,
    concatActions,
    installNpmDependencies,
    formatWithPrettier,
    getModuleDependencies,
    isDirectory,
    packageManager,
    exitWithMessage,
} from '@lindeneg/scaffold-core';
import * as mod from '@/modules';
import HELP from './help';
import preparation from './preparation';
import type { InitGeneratorAnswers } from './preparation';
import configure from './configure';

const initGenerator = createGenerator<InitGeneratorAnswers>({
    name: 'init',
    formattedName: 'Initialize',
    description: 'initialize a new project',
    enabled: true,
    help: HELP,

    modules: Object.values(mod),

    async setAnswersFromArgumentVector(answers, [name, ...optionals]) {
        answers.optionals = optionals;

        if (name && !name.startsWith('--')) {
            if (name.startsWith('--')) {
                answers.optionals.push(name);
            } else {
                const isDir = await isDirectory(name);

                if (isDir) {
                    return exitWithMessage({
                        source: 'generator.init.setAnswersFromArgumentVector',
                        msg: 'Directory already exists. Please choose a different name.',
                    });
                }

                answers.name = name;
            }
        }
    },

    hasRequiredAnswers(answers) {
        return !!answers.name;
    },

    async setAnswersFromInquirer(answers, prompt) {
        if (!answers.name) {
            answers.name = (
                await prompt({
                    type: 'input',
                    name: 'name',
                    message: 'Project Name',
                    async validate(dir) {
                        const isDir = await isDirectory(dir);
                        if (isDir) return 'Directory already exists. Please choose a different name';
                        return true;
                    },
                })
            ).name;
        }

        answers.optionals = answers.optionals || [];

        if (
            !answers.optionals.includes(packageManager.npm.name) &&
            !answers.optionals.includes(packageManager.yarn.name)
        ) {
            const result = await prompt([
                {
                    type: 'list',
                    name: 'manager',
                    message: 'Configure package manager',
                    choices: modulePrompt(packageManager.yarn, packageManager.npm),
                },
                {
                    type: 'checkbox',
                    name: 'addons',
                    message: 'Configure Addons',
                    choices: modulePrompt(mod.prisma, mod.zod, mod.authServices),
                },
            ]);

            answers.optionals.push(result.manager, ...result.addons);
        }
    },

    async getActionsFromAnswers(...args) {
        const [cxt, configureModule] = preparation(...args);

        configure.core(configureModule);
        configure.baseServices(configureModule);
        configure.api(configureModule);
        configure.application(configureModule);

        if (cxt.hasProperty.prisma) configure.prisma(configureModule);
        if (cxt.hasProperty.zod) configure.zod(configureModule);
        if (cxt.hasProperty.auth) configure.auth(configureModule);

        return concatActions(
            createDirectory.prepare({
                dirPaths: [
                    cxt.projectRoot,
                    cxt.projectSrc,
                    joinPath(cxt.projectSrc, 'api'),
                    joinPath(cxt.projectSrc, 'application'),
                    joinPath(cxt.projectSrc, 'services'),
                    joinPath(cxt.projectSrc, 'enums'),
                ],
            }),

            cxt.customActions.get(),

            installNpmDependencies.prepare({
                projectRoot: cxt.projectRoot,
                dependencies: getModuleDependencies(cxt.dependantModules),
                manager: cxt.manager,
            }),

            mod.core.actions.sortPackageJson.prepare({
                rootDir: cxt.projectRoot,
            }),

            formatWithPrettier.prepare({
                dirPath: cxt.projectRoot,
            })
        );
    },
});

export default initGenerator;
