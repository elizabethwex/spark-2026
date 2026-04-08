import { defineConfig } from 'tsup';
import path from 'path';

export default defineConfig({
  entry: ['index.ts'],
  format: ['esm', 'cjs'],
  // Disable DTS generation - we're shipping source code (index.ts)
  // Consuming applications will compile TypeScript directly
  // This avoids issues with resolving @/components/ui/* imports which are external
  dts: false,
  splitting: false,
  sourcemap: true,
  clean: true,
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

