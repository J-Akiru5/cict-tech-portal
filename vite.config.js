import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.tsx',
            refresh: true,
        }),
        react(),
    ],
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    gsap: ['gsap'],
                    charts: ['recharts'],
                    ui: ['framer-motion', '@headlessui/react'],
                },
            },
        },
        minify: 'terser',
        cssMinify: true,
        sourcemap: false,
    },
});
