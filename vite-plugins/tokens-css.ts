/**
 * Vite plugin to generate CSS from design-tokens.json at build time
 * This allows the app to import JSON directly and get CSS automatically
 */

import type { Plugin } from 'vite';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function generateCSSFromJSON(theme: { light: Record<string, string>; dark: Record<string, string> }) {
  let css = `/* ============================================================
   WEX TOKEN EMISSION LAYER
   ============================================================
   AUTO-GENERATED from design-tokens.json - DO NOT EDIT
   ============================================================ */

:root {
`;

  // Light mode tokens
  Object.entries(theme.light)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([token, value]) => {
      css += `  ${token}: ${value};\n`;
    });

  css += `}

.dark {
`;

  // Dark mode tokens
  Object.entries(theme.dark)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([token, value]) => {
      css += `  ${token}: ${value};\n`;
    });

  css += `}
`;

  return css;
}

function loadBridgeFiles() {
  const bridgesRoot = join(__dirname, '..', 'packages', 'design-tokens');
  const shadcnBridge = join(bridgesRoot, 'shadcn-bridge.css');
  const componentsBridge = join(bridgesRoot, 'components-bridge.css');
  
  let bridgeCSS = '';
  
  if (existsSync(shadcnBridge)) {
    bridgeCSS += readFileSync(shadcnBridge, 'utf-8') + '\n';
  }
  
  if (existsSync(componentsBridge)) {
    bridgeCSS += readFileSync(componentsBridge, 'utf-8') + '\n';
  }
  
  return bridgeCSS;
}

export function tokensCSSPlugin(): Plugin {
  const tokensJSONPath = join(__dirname, '..', 'packages', 'design-tokens', 'design-tokens.json');
  const virtualModuleId = '\0virtual:@wex/design-tokens.css';
  const bridgesRoot = join(__dirname, '..', 'packages', 'design-tokens');
  const shadcnBridgePath = join(bridgesRoot, 'shadcn-bridge.css');
  const componentsBridgePath = join(bridgesRoot, 'components-bridge.css');
  
  return {
    name: 'tokens-css',
    enforce: 'pre', // Run before other plugins
    resolveId(id) {
      // Intercept @wex/design-tokens imports
      if (id === '@wex/design-tokens' || id === '@wex/design-tokens/css') {
        return virtualModuleId;
      }
      return null;
    },
    load(id) {
      // Handle virtual module
      if (id === virtualModuleId) {
        if (!existsSync(tokensJSONPath)) {
          throw new Error(`design-tokens.json not found at ${tokensJSONPath}`);
        }
        
        const theme = JSON.parse(readFileSync(tokensJSONPath, 'utf-8'));
        const tokensCSS = generateCSSFromJSON(theme);
        const bridgeCSS = loadBridgeFiles();
        
        return tokensCSS + '\n' + bridgeCSS;
      }
      return null;
    },
    configureServer(server) {
      // Explicitly watch the token files for changes
      server.watcher.add(tokensJSONPath);
      server.watcher.add(shadcnBridgePath);
      server.watcher.add(componentsBridgePath);
    },
    handleHotUpdate({ file, server }) {
      // Normalize paths for comparison (Vite may pass relative or absolute paths)
      const normalizedFile = normalize(resolve(file));
      const normalizedTokensPath = normalize(tokensJSONPath);
      const normalizedShadcnBridge = normalize(shadcnBridgePath);
      const normalizedComponentsBridge = normalize(componentsBridgePath);
      
      // Check if this is a token file we care about
      const isTokenFile = normalizedFile === normalizedTokensPath || 
                          normalizedFile.endsWith('design-tokens.json');
      const isBridgeFile = normalizedFile === normalizedShadcnBridge || 
                           normalizedFile === normalizedComponentsBridge ||
                           normalizedFile.endsWith('shadcn-bridge.css') ||
                           normalizedFile.endsWith('components-bridge.css');
      
      if (isTokenFile || isBridgeFile) {
        console.log(`[tokens-css] File changed: ${file}`);
        
        // Get the virtual module
        const module = server.moduleGraph.getModuleById(virtualModuleId);
        
        if (module) {
          console.log(`[tokens-css] Invalidating virtual module and ${module.importers.size} importers`);
          // Invalidate the virtual module
          server.moduleGraph.invalidateModule(module);
          
          // Also invalidate all modules that import it
          const importers = Array.from(module.importers);
          importers.forEach((importer) => {
            server.moduleGraph.invalidateModule(importer);
          });
          
          // Return modules to trigger HMR
          return [module, ...importers];
        } else {
          console.log(`[tokens-css] Virtual module not found, searching for dependent modules...`);
          // Module doesn't exist yet - find modules that import @wex/design-tokens
          const allModules = Array.from(server.moduleGraph.idToModuleMap.values());
          const dependentModules = allModules.filter((mod) => {
            if (!mod?.importers) return false;
            // Check if this module imports @wex/design-tokens
            return Array.from(mod.importers).some((importer) => {
              const importerId = importer?.id || importer?.url || '';
              return importerId.includes('@wex/design-tokens') || 
                     importerId.includes('main.tsx') ||
                     importerId.includes('App.tsx');
            });
          });
          
          console.log(`[tokens-css] Found ${dependentModules.length} dependent modules`);
          
          // Invalidate all dependent modules to force reload
          dependentModules.forEach((mod) => {
            if (mod) server.moduleGraph.invalidateModule(mod);
          });
          
          return dependentModules;
        }
      }
      
      return undefined;
    },
  };
}

