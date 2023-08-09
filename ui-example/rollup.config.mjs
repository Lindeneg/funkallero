import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';
import cleaner from 'rollup-plugin-cleaner';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
    input: './src/index.ts',

    output: [
        {
            file: './dist/index.mjs',
            format: 'esm',
            exports: 'named',
        },
    ],

    external: ['@lindeneg/funkallero', 'express'],

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
