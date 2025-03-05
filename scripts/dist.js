import typescript from 'rollup-plugin-typescript2'
import terser from '@rollup/plugin-terser'
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pkg = require('../package.json');

export default {
    input: 'src/index.ts',
    output: [
        {
            file: pkg.main,
            format: 'esm',
            name: pkg.name,
            sourcemap: true,
        },
        {
            file: 'dist/index.min.js',
            format: 'esm',
            name: pkg.name,
            sourcemap: true,
            plugins: [
                terser({
                    compress: {
                        drop_console: true,
                    },
                    output: {
                        comments: false,
                    },
                    keep_classnames: false,
                    keep_fnames: false,
                }),
            ],
        },
    ],
    plugins: [
        typescript({
            tsconfig: "tsconfig.json",
            useTsconfigDeclarationDir: true
        }),
    ],
}
