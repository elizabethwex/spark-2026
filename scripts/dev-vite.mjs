#!/usr/bin/env node
/**
 * Starts Vite after verifying dependencies exist (clearer than a missing .bin/vite error).
 */
import { existsSync } from "node:fs";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const viteCli = join(root, "node_modules", "vite", "bin", "vite.js");

console.log(`
  SPARK dev server — this app uses port 5175 by default (not Vite’s 5173).
  If the port is busy, Vite picks the next free port; use the “Local” URL printed below.
`);

if (!existsSync(viteCli)) {
  console.error(`
Cannot start dev server: dependencies are not installed (vite is missing).

This project uses @wexinc-healthbenefits/ben-ui-kit from WEX Artifactory.
Configure npm per .npmrc, then install (pick one):

  export ARTIFACTORY_NPM_TOKEN='<token>' && npm install
  npm run install:deps   # uses .npm-artifactory-token file (gitignored)

Then run: npm run dev
`);
  process.exit(1);
}

const child = spawn(process.execPath, [viteCli, ...process.argv.slice(2)], {
  stdio: "inherit",
  cwd: root,
});
child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 1);
});
