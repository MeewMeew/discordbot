import { defineConfig } from 'tsup'

export default defineConfig({
  entryPoints: ['src/index.ts', 'src/core/app.ts', 'src/commands/**/*.ts', 'src/events/**/*.ts'],
  format: ['esm'],
  minify: true,
  clean: true,
  bundle: true,
  splitting: false,
  target: 'esnext',
  outDir: 'build',
  silent: true,
  shims: true
})