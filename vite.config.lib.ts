import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const r = (p: string) => resolve(dirname(fileURLToPath(import.meta.url)), p);

// Library build for the UI99 kit. Separate file so the app's vite.config.ts
// (managed by the platform) stays untouched.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist-kit',
    emptyOutDir: true,
    minify: true,
    cssCodeSplit: false,
    lib: {
      entry: {
        index: r('src/components/ui/kit.ts'),
      },
      formats: ['es', 'cjs'],
      cssFileName: 'safa-ui',
    },
    rollupOptions: {
      external: [/node_modules/],
    },
  },
  resolve: {
    alias: {},
  },
});
