import typescript from 'rollup-plugin-typescript2';
import cleaner from 'rollup-plugin-cleaner';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default () => {
    return {
        input: './src/index.ts',
        output: {
            file: './dist/index.mjs',
            format: 'esm',
            exports: 'named',
        },
        external: [
            '@lindeneg/funkallero',
            '@lindeneg/funkallero-auth-service',
            '@lindeneg/funkallero-prisma-service',
            '@lindeneg/funkallero-zod-service',
            '@prisma/client',
            'chalk',
            'zod',
            'cookie-parser',
        ],
        plugins: [
            cleaner({
                targets: ['./dist'],
            }),
            nodeResolve({
                preferBuiltins: true,
            }),
            commonjs(),
            typescript({
                tsconfig: './tsconfig.json',
                clean: true,
            }),
        ],
    };
};
