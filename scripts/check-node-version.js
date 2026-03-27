#!/usr/bin/env node

/**
 * Check Node.js version and exit with error if not compatible
 */

const nodeVersion = process.version;
const major = parseInt(nodeVersion.slice(1).split('.')[0]);
const minor = parseInt(nodeVersion.slice(1).split('.')[1]);

// Check if version is 20.19+ or 22.12+
const isCompatible = 
  (major === 20 && minor >= 19) ||
  (major === 22 && minor >= 12) ||
  major > 22;

if (!isCompatible) {
  console.error(`\n❌ Node.js version ${nodeVersion} is not supported.`);
  console.error(`   Vite requires Node.js 20.19+ or 22.12+.`);
  console.error(`\n   To fix this, run in your terminal:`);
  console.error(`   \x1b[32mnvm use\x1b[0m`);
  console.error(`\n   Or if Node.js 22.17.1 is not installed:`);
  console.error(`   \x1b[32mnvm install 22.17.1 && nvm use\x1b[0m\n`);
  process.exit(1);
}

