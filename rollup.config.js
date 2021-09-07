import { terser } from 'rollup-plugin-terser';
import babel from 'rollup-plugin-babel';

export default {
    input: './lib/index.js',
    output: [
        {
            file: './build/cirnostream.js',
            format: 'umd',
            name: 'CirnoStream',
            plugins: [terser({ keep_classnames: true, keep_fnames: true })],
        },
        {
            file: './build/cirnostream.min.js',
            format: 'umd',
            name: 'CirnoStream',
            plugins: [terser()],
        },
    ],
    plugins: [
        babel({
            exclude: 'node_modules/**',
        }),
    ],
};
