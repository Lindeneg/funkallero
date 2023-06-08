import typescript from 'rollup-plugin-typescript2';
import cleaner from 'rollup-plugin-cleaner';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default () => {
    return {
        input: './src/index.ts',
        output: {
            file: './dist/esm/index.mjs',
            format: 'esm',
            exports: 'named',
        },
        external: ['@lindeneg/funkallero-core', 'bcryptjs', 'jsonwebtoken'],
        plugins: [
            cleaner({
                targets: ['./dist'],
            }),
            nodeResolve(),
            commonjs(),
            typescript({
                tsconfig: './tsconfig.json',
                clean: true,
            }),
        ],
    };
};
