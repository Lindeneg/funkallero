import typescript from 'rollup-plugin-typescript2';
import cleaner from 'rollup-plugin-cleaner';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default () => {
    return {
        input: './src/__mock__/index.ts',
        output: {
            file: './__mock__/index.mjs',
            format: 'esm',
            exports: 'named',
        },
        external: [
            '@lindeneg/funkallero',
            '@lindeneg/funkallero-auth-service',
            '@lindeneg/funkallero-prisma-service',
            '@lindeneg/funkallero-zod-service',
            '@prisma/client',
            'express',
            'handlebars',
            'zod',
            'cookie-parser',
        ],
        plugins: [
            cleaner({
                targets: ['./__mock__'],
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
