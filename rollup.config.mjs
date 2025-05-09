import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import postcss from 'rollup-plugin-postcss'
import svgr from '@svgr/rollup'
import url from '@rollup/plugin-url'
import packageJson from './package.json' assert { type: 'json' }

export default {
    input: 'src/index.ts',
    output: [
        {
            file: packageJson.main,
            format: 'cjs',
            sourcemap: true,
        },
        {
            file: packageJson.module,
            format: 'esm',
            sourcemap: true,
        },
    ],
    plugins: [
        peerDepsExternal(),
        resolve(),
        commonjs(),
        typescript({
            useTsconfigDeclarationDir: true,
            tsconfigOverride: {
                exclude: ['**/__tests__', '**/*.test.ts', '**/*.stories.tsx'],
            },
        }),
        postcss({
            extract: true,
            modules: true,
            extensions: ['.css', '.scss'],
            use: ['sass'],
        }),
        url(),
        svgr(),
    ],
}
