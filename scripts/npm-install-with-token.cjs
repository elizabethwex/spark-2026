#!/usr/bin/env node
/**
 * Runs `npm install` with ARTIFACTORY_NPM_TOKEN set from the environment
 * or from a gitignored local file (see repo .gitignore).
 */
const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const tokenFile = path.join(root, ".npm-artifactory-token");

let token = process.env.ARTIFACTORY_NPM_TOKEN;
if (!token && fs.existsSync(tokenFile)) {
  token = fs.readFileSync(tokenFile, "utf8").trim();
}

if (!token) {
  console.error(`
Cannot install: @wexinc-healthbenefits/ben-ui-kit needs WEX Artifactory auth.

Option A — current shell:
  export ARTIFACTORY_NPM_TOKEN='<your JFrog identity token>'
  npm install

Option B — one-line file (gitignored):
  echo -n '<your token>' > .npm-artifactory-token
  node scripts/npm-install-with-token.cjs
`);
  process.exit(1);
}

const result = spawnSync("npm", ["install"], {
  cwd: root,
  stdio: "inherit",
  env: { ...process.env, ARTIFACTORY_NPM_TOKEN: token },
});

process.exit(result.status ?? 1);
