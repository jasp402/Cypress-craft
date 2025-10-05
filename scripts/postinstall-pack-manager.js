#!/usr/bin/env node
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

(function main(){
  try {
    const pkgRoot = path.join(__dirname, '..');
    const pmDir = path.join(pkgRoot, 'pack-manager');
    const pmPkg = path.join(pmDir, 'package.json');
    if (!fs.existsSync(pmDir) || !fs.existsSync(pmPkg)) {
      return; // nothing to do
    }

    const pmNodeModules = path.join(pmDir, 'node_modules');
    const frontendDist = path.join(pmDir, 'frontend', 'dist');
    const needsInstall = !fs.existsSync(pmNodeModules);

    const cmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

    const run = (args, opts = {}) => new Promise((resolve) => {
      const child = spawn(cmd, args, { cwd: pmDir, stdio: 'inherit', shell: true, ...opts });
      child.on('close', (code) => resolve(code));
    });

    const maybeBuild = async () => {
      if (!fs.existsSync(frontendDist)) {
        console.log('[cypress-craft] Building pack-manager frontend (vite build)...');
        const code = await run(['run', 'pm:build']);
        if (code !== 0) {
          console.warn('[cypress-craft] Warning: failed to build pack-manager frontend (exit code ' + code + '). You may need to run "npm run pm:build" manually inside pack-manager.');
        } else {
          console.log('[cypress-craft] pack-manager frontend built successfully.');
        }
      } else {
        console.log('[cypress-craft] pack-manager frontend build already present.');
      }
    };

    (async () => {
      if (needsInstall) {
        console.log('[cypress-craft] Installing internal dependencies for pack-manager...');
        const installCode = await run(['install', '--no-audit', '--no-fund']);
        if (installCode !== 0) {
          console.warn('[cypress-craft] Warning: failed to install pack-manager dependencies (exit code ' + installCode + '). CLI may not work until you install them manually.');
          return; // cannot proceed to build without deps
        }
        console.log('[cypress-craft] pack-manager dependencies installed.');
        await maybeBuild();
      } else {
        // deps already installed; still ensure build exists
        await maybeBuild();
      }
    })();

  } catch (e) {
    console.warn('[cypress-craft] Warning: postinstall for pack-manager failed:', e && e.message);
  }
})();
