import dns from 'dns';
import path from 'path';
import { defineConfig } from 'vite';

import react from '@vitejs/plugin-react';

dns.setDefaultResultOrder('verbatim');

// https://vitejs.dev/config/
export default defineConfig({
    base: process.env.BASE_URL,
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },
    server: {
        host: true,
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: '@import "@/styles/mixin.scss";'
            },
        },
    }
});
