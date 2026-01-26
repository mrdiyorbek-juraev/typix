import { defineConfig, type Options } from 'tsup';

export function createExtensionConfig(options?: Options) {
    return defineConfig({
        format: ['cjs', 'esm'],
        dts: true,
        splitting: false,
        sourcemap: true,
        clean: true,
        treeshake: true,
        target: 'es2022',
        platform: 'browser',
        external: [
            'react',
            'react-dom',
            'lexical',
            '@lexical/*',
            '@typix/*'
        ],
        ...options,
    });
}