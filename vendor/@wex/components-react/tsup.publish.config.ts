import { defineConfig } from 'tsup';
import path from 'path';

/**
 * Publish Build Config for @wex/components-react
 * 
 * Builds all entry points (index.ts, actions/index.ts, etc.) to dist/
 * This config is used during GitHub Actions publish workflow to build
 * JavaScript files that will replace TypeScript source files at root.
 */
export default defineConfig({
  // Build all entry points separately to preserve subpath exports
  entry: [
    'index.ts',
    'actions/index.ts',
    'form-inputs/index.ts',
    'form-structure/index.ts',
    'layout/index.ts',
    'data-display/index.ts',
    'feedback/index.ts',
    'navigation/index.ts',
    'overlays/index.ts',
  ],
  // Use ESM format only - Node.js and bundlers can handle ESM for both import and require
  // via package.json "exports" field
  format: ['esm'],
  dts: false, // No type definitions needed for built files
  splitting: false, // Bundle each entry point into a single file
  sourcemap: true,
  clean: true,
  // Output to dist/ directory (will be copied to root by publish script)
  // Use outExtension to ensure .js extension and preserve directory structure
  outDir: 'dist',
  outExtension({ format }) {
    return {
      js: `.js`,
    };
  },
  external: [
    'react',
    'react-dom',
    'tailwindcss',
    // Mark all UI component imports as external - these are provided by consuming apps
    /^@\/components\/ui\/.*/,
    /^@\/lib\/.*/,
  ],
  treeshake: true,
  minify: false,
  esbuildOptions(options) {
    options.jsx = 'automatic';
    // Resolve @wex/components-react to source files during build to avoid circular dependency
    options.alias = {
      '@wex/components-react': path.resolve(__dirname, './index.ts'),
    };
  },
});
