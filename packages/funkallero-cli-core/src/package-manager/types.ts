import type { AnyScaffoldModule } from '../module/types';

export interface ScaffoldPackageManager extends Pick<AnyScaffoldModule, 'name' | 'formattedName' | 'enabled'> {
    installCommand: string;
    addCommand: string;
    runCommand: string;
    devFlag: string;
    peerFlag: string;
    exactFlag: string;
    argvFlagSeparator?: string;

    construct: {
        install: string;
        add: string;
        addExact: string;
        addDev: string;
        addExactDev: string;
        addPeer: string;
        addExactPeer: string;
        run: string;
    };
}

export interface ScaffoldPackageDependency {
    readonly type: 'normal' | 'dev' | 'peer';
    readonly name: string;
    readonly version?: string;
}
