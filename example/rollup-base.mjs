import path from 'path';
import typescript from 'rollup-plugin-typescript2';
import cleaner from 'rollup-plugin-cleaner';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default (input, outputDir, outputFile) => {
    return {
        input,
        output: {
            file: path.join(outputDir, outputFile),
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
                targets: [outputDir],
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
