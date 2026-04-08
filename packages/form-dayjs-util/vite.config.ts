import { defineConfig } from 'vite-plus';

export default defineConfig({
    run: {
        tasks: {
            build: {
                command: 'vp pack',
                dependsOn: [
                    '@thazstack/config#build',
                    '@thazstack/form-util#build',
                    '@thazstack/temporal-dayjs-util#build',
                    '@thazstack/temporal-dayjs-valibot-util#build',
                    '@thazstack/temporal-valibot-util#build',
                    '@thazstack/temporal-util#build',
                ],
            },
            // dev: {
            //     command: 'vp pack --watch',
            // },
            // deploy: {
            //     command: 'vp pack && vp run zip',
            //     cache: false,
            //     // dependsOn: ['build', 'test'],
            // },
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
