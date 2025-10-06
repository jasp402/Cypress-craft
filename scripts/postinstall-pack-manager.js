#!/usr/bin/env node
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

(function main(){
  try {
    const pkgRoot = path.join(__dirname, '..');

    // Skip heavy postinstall work in CI/publish environments
    const isCI = !!process.env.CI || /true/i.test(process.env.GITHUB_ACTIONS || '') || /true/i.test(process.env.GITLAB_CI || '');
    if (isCI) {
      console.log('[cypress-craft] Detected CI environment. Skipping postinstall for pack-manager/Gherkin Builder.');
      return;
    }

    const cmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    const run = (cwd) => (args, opts = {}) => new Promise((resolve) => {
      const child = spawn(cmd, args, { cwd, stdio: 'inherit', shell: true, ...opts });
      child.on('close', (code) => resolve(code));
    });

    // --- Pack Manager build (existing) ---
    const pmDir = path.join(pkgRoot, 'pack-manager');
    const pmPkg = path.join(pmDir, 'package.json');
    if (fs.existsSync(pmDir) && fs.existsSync(pmPkg)) {
      const pmNodeModules = path.join(pmDir, 'node_modules');
      const pmFrontendDist = path.join(pmDir, 'frontend', 'dist');
      const pmNeedsInstall = !fs.existsSync(pmNodeModules);
      const pmRun = run(pmDir);
      const pmMaybeBuild = async () => {
        if (!fs.existsSync(pmFrontendDist)) {
          console.log('[cypress-craft] Building pack-manager frontend (vite build)...');
          const code = await pmRun(['run', 'pm:build']);
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
        if (pmNeedsInstall) {
          console.log('[cypress-craft] Installing internal dependencies for pack-manager...');
          const installCode = await pmRun(['install', '--no-audit', '--no-fund']);
          if (installCode !== 0) {
            console.warn('[cypress-craft] Warning: failed to install pack-manager dependencies (exit code ' + installCode + '). CLI may not work until you install them manually.');
          } else {
            console.log('[cypress-craft] pack-manager dependencies installed.');
            await pmMaybeBuild();
          }
        } else {
          await pmMaybeBuild();
        }
      })();
    }

    // --- Gherkin Builder build (new) ---
    const gbDir = path.join(pkgRoot, 'GherkinBuilder');
    const gbPkg = path.join(gbDir, 'package.json');
    if (fs.existsSync(gbDir) && fs.existsSync(gbPkg)) {
      const gbNodeModules = path.join(gbDir, 'node_modules');
      const gbDist = path.join(gbDir, 'dist');
      const gbNeedsInstall = !fs.existsSync(gbNodeModules);
      const gbRun = run(gbDir);
      const gbMaybeBuild = async () => {
        if (!fs.existsSync(gbDist)) {
          console.log('[cypress-craft] Building Gherkin Builder frontend (vite build)...');
          const code = await gbRun(['run', 'build']);
          if (code !== 0) {
            console.warn('[cypress-craft] Warning: failed to build Gherkin Builder frontend (exit code ' + code + '). You may need to run "npm run build" manually inside GherkinBuilder.');
          } else {
            console.log('[cypress-craft] Gherkin Builder frontend built successfully.');
          }
        } else {
          console.log('[cypress-craft] Gherkin Builder frontend build already present.');
        }
      };
      (async () => {
        if (gbNeedsInstall) {
          console.log('[cypress-craft] Installing internal dependencies for Gherkin Builder...');
          const installCode = await gbRun(['install', '--no-audit', '--no-fund']);
          if (installCode !== 0) {
            console.warn('[cypress-craft] Warning: failed to install Gherkin Builder dependencies (exit code ' + installCode + '). CLI may not work until you install them manually.');
          } else {
            console.log('[cypress-craft] Gherkin Builder dependencies installed.');
            await gbMaybeBuild();
          }
        } else {
          await gbMaybeBuild();
        }
      })();
    }

  } catch (e) {
    console.warn('[cypress-craft] Warning: postinstall for pack-manager/Gherkin Builder failed:', e && e.message);
  }
})();
