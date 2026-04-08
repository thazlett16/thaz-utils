import { defineConfig } from 'vite-plus';

export default defineConfig({
    run: {
        tasks: {
            build: {
                command: 'vp pack',
                dependsOn: [
                    '@thazstack/config#build',
                    '@thazstack/temporal-dayjs-util#build',
                    '@thazstack/temporal-valibot-util#build',
                ],
            },
        },
    },
    pack: {
        dts: true,
        exports: {
            customExports: {
                '.': {
                    types: './dist/index.d.mts',
                    import: './dist/index.mjs',
                },
            },
        },
    },
    lint: {
        options: {
            typeAware: true,
            typeCheck: true,
        },
    },
});
