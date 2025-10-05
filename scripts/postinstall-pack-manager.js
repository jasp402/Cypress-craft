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
    const needsInstall = !fs.existsSync(pmNodeModules);

    if (needsInstall) {
      const cmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
      console.log('[cypress-craft] Installing internal dependencies for pack-manager...');
      const child = spawn(cmd, ['install', '--no-audit', '--no-fund'], { cwd: pmDir, stdio: 'inherit', shell: true });
      child.on('close', (code) => {
        if (code !== 0) {
          console.warn('[cypress-craft] Warning: failed to install pack-manager dependencies (exit code ' + code + '). CLI may not work until you install them manually.');
        } else {
          console.log('[cypress-craft] pack-manager dependencies installed.');
        }
      });
    }
  } catch (e) {
    console.warn('[cypress-craft] Warning: postinstall for pack-manager failed:', e && e.message);
  }
})();
