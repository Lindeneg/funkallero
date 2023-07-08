import logger from '../../logger';
import createAction from '../create-action';
import { asyncExec } from '../logic';
import type { ScaffoldPackageManager, ScaffoldPackageDependency } from '../../package-manager/types';

interface InstallDependenciesPayload {
    projectRoot: string;
    dependencies: ScaffoldPackageDependency[];
    manager: ScaffoldPackageManager;
}

type SortedDependencies = Record<ScaffoldPackageDependency['type'], string[]>;

const installDependencies = (cwd: string, installCmd: string, dependencies: string[]) => {
    const cmd = `${installCmd} ${dependencies.join(' ')}`;

    logger.verbose({
        msg: 'installing dependencies',
        source: 'commonActions.installNpmDependencies.installDependencies',
        cmd,
    });

    return asyncExec(cmd, { cwd });
};

const installSortedDependencies = async (
    dir: string,
    manager: ScaffoldPackageManager,
    { normal, dev, peer }: SortedDependencies
) => {
    await Promise.all([
        normal.length ? installDependencies(dir, manager.construct.addExact, normal) : Promise.resolve(),
        dev.length ? installDependencies(dir, manager.construct.addExactDev, dev) : Promise.resolve(),
        peer.length ? installDependencies(dir, manager.construct.addExactPeer, peer) : Promise.resolve(),
    ]);

    return normal.length + dev.length + peer.length;
};

const sortDependencies = (dependencies: ScaffoldPackageDependency[]): SortedDependencies => {
    return dependencies.reduce(
        (obj, cur) => {
            obj[cur.type].push(`${cur.name}@${cur?.version || 'latest'}`);
            return obj;
        },
        { normal: [], dev: [], peer: [] } as SortedDependencies
    );
};

export default createAction<InstallDependenciesPayload>(
    'install-npm-dependencies',
    async (_, { projectRoot, dependencies, manager }) => {
        const sortedDependencies = sortDependencies(dependencies);

        try {
            logger.info({
                msg: 'installing dependencies.. please wait..',
                source: 'commonActions.installNpmDependencies',
                projectRoot,
                dependencies,
                manager: manager.name,
            });

            const amountInstalled = await installSortedDependencies(projectRoot, manager, sortedDependencies);

            return `installed ${amountInstalled} packages.`;
        } catch (err) {
            const msg = 'failed to install dependencies';

            logger.error({
                source: 'commonActions.installNpmDependencies',
                msg,
                err,
            });

            throw msg;
        }
    }
);
