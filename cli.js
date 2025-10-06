#!/usr/bin/env node

async function start() {
    const { Command } = require('commander');
    const { spawn } = require('child_process');
    const path = require('path');
    const fs = require('fs');

    // Dynamically import ESM modules
    const chalk = (await import('chalk')).default;

    const inquirerModule = await import('inquirer');
    const inquirer = inquirerModule.default;

    const logo = require('./scripts/logo');
    const packageJson = require('./package.json');

    const program = new Command();

    // --- Verification and Utility Functions ---

    const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    const runNpm = (cwd, args, extraEnv = {}) => new Promise((resolve) => {
        const child = spawn(npmCmd, args, { cwd, stdio: 'inherit', shell: true, env: { ...process.env, ...extraEnv } });
        child.on('close', (code) => resolve(code));
    });

    async function ensureGherkinBuilderReady(gherkinBuilderPath) {
        const nodeModules = path.join(gherkinBuilderPath, 'node_modules');
        const distDir = path.join(gherkinBuilderPath, 'dist');

        if (!fs.existsSync(nodeModules)) {
            console.log(chalk.yellow('[cypress-craft] Installing Gherkin Builder dependencies on-demand...'));
            const code = await runNpm(gherkinBuilderPath, ['install', '--no-audit', '--no-fund']);
            if (code !== 0) {
                console.log(chalk.red('[cypress-craft] Failed to install Gherkin Builder dependencies. Please run "npm install" inside GherkinBuilder and retry.'));
                return false;
            }
        }
        if (!fs.existsSync(distDir)) {
            console.log(chalk.yellow('[cypress-craft] Building Gherkin Builder frontend (vite build)...'));
            const code = await runNpm(gherkinBuilderPath, ['run', 'build']);
            if (code !== 0) {
                console.log(chalk.red('[cypress-craft] Failed to build Gherkin Builder. Please run "npm run build" inside GherkinBuilder and retry.'));
                return false;
            }
        }
        return true;
    }

    async function ensurePackManagerReady(packManagerRoot) {
        const nodeModules = path.join(packManagerRoot, 'node_modules');
        const frontendDist = path.join(packManagerRoot, 'frontend', 'dist');

        if (!fs.existsSync(nodeModules)) {
            console.log(chalk.yellow('[cypress-craft] Installing Pack Manager dependencies on-demand...'));
            const code = await runNpm(packManagerRoot, ['install', '--no-audit', '--no-fund']);
            if (code !== 0) {
                console.log(chalk.red('[cypress-craft] Failed to install Pack Manager dependencies. Please run "npm install" inside pack-manager and retry.'));
                return false;
            }
        }
        if (!fs.existsSync(frontendDist)) {
            console.log(chalk.yellow('[cypress-craft] Building Pack Manager frontend (vite build)...'));
            const code = await runNpm(packManagerRoot, ['run', 'pm:build']);
            if (code !== 0) {
                console.log(chalk.red('[cypress-craft] Failed to build Pack Manager frontend. Please run "npm run pm:build" inside pack-manager and retry.'));
                return false;
            }
        }
        return true;
    }

    /**
     * Checks if the project has been initialized by looking for the 'cypress' folder or config files.
     * @returns {boolean}
     */
    function isProjectInitialized() {
        const projectRoot = process.cwd();
        const cypressDir = path.join(projectRoot, 'cypress');
        const cypressConfigJs = path.join(projectRoot, 'cypress.config.js');
        const cypressConfigTs = path.join(projectRoot, 'cypress.config.ts');
        return fs.existsSync(cypressDir) || fs.existsSync(cypressConfigJs) || fs.existsSync(cypressConfigTs);
    }

    const checkInitialization = () => {
        if (!isProjectInitialized()) {
            console.log(chalk.red('Error:') + ' This command requires an initialized project.');
            console.log(`Please run ${chalk.cyan('npx cypress-craft init')} to start.`);
            return false;
        }
        return true;
    };

    /**
     * Starts the interactive setup wizard for a new project.
     */
    function runInit() {
        const initScriptPath = path.join(__dirname, 'scripts', 'post-install.js');
        console.log(chalk.blue('Starting Cypress-Craft setup wizard...'));
        const initProcess = spawn(process.execPath, [initScriptPath], { stdio: 'inherit', shell: false });
        initProcess.on('error', (err) => console.error(chalk.red('Error starting the wizard:'), err));
    }

    /**
     * Starts the UI for creating test cases (.feature files).
     */
    async function runBuildTestCase() {
        if (!checkInitialization()) return;
        const gherkinBuilderPath = path.join(__dirname, 'GherkinBuilder');
        const frontendUrl = 'http://localhost:3002';

        const ok = await ensureGherkinBuilderReady(gherkinBuilderPath);
        if (!ok) return;

        console.log(chalk.blue("Starting 'Gherkin Builder' tool (compiled)..."));
        // Start backend server directly; it serves dist if present (no reliance on vite)
        spawn(process.execPath, ['server.js'], { cwd: gherkinBuilderPath, stdio: 'inherit', shell: false });

        setTimeout(async () => {
            console.log(chalk.green(`Opening browser at ${frontendUrl}`));
            try {
                const open = (await import('open')).default;
                open(frontendUrl);
            } catch (e) {
                console.error(chalk.red('Could not open browser automatically.'), e);
            }
        }, 3000);
    }

    /**
     * Starts the PackManager UI to manage plugins and steps.
     */
    async function runPackManager() {
        if (!checkInitialization()) return;
        const packManagerRoot = path.join(__dirname, 'pack-manager');
        const frontendUrl = 'http://localhost:3001';

        const ok = await ensurePackManagerReady(packManagerRoot);
        if (!ok) return;

        // Ensure the backend knows the user's project root, even when using npm link.
        const userProjectRoot = process.cwd();
        const childEnv = { ...process.env, CYPRESS_CRAFT_USER_CWD: userProjectRoot, INIT_CWD: userProjectRoot };

        console.log(chalk.blue('Starting Cypress-Craft PackManager (compiled)...'));
        // Start backend server directly; it serves frontend/dist if present (no reliance on npm scripts)
        spawn(process.execPath, ['backend/src/server.js'], { cwd: packManagerRoot, stdio: 'inherit', shell: false, env: childEnv });

        setTimeout(async () => {
            console.log(chalk.green(`Opening browser at ${frontendUrl}`));
            const open = (await import('open')).default;
            open(frontendUrl);
        }, 4000);
    }

    /**
     * Starts the tool to generate Cucumber reports.
     */
    function runReporter() {
        if (!checkInitialization()) return;
        console.log(chalk.blue('Generating HTML test report...'));
        const reporterProcess = spawn('npx', ['cypress-cucumber-report-features'], { stdio: 'inherit', shell: true });
        reporterProcess.on('error', (err) => console.error(chalk.red('Error generating report:'), err));
    }

    // --- Main Interactive Menu ---

    async function showMainMenu() {
        console.log(chalk.cyan(logo));
        console.log(chalk.bold.yellow(`  Welcome to Cypress-Craft v${packageJson.version}`), '\n');
        console.log(chalk.white('  Cypress-Craft is a set of tools to enhance your E2E and API tests.'));
        console.log(chalk.white('  Choose an option to begin:'), '\n');

        const { choice } = await inquirer.prompt([
            {
                type: 'list',
                name: 'choice',
                message: 'What would you like to do?',
                choices: [
                    {
                        name: '✨ Initialize a new project (or update an existing one)',
                        value: 'init'
                    },
                    {
                        name: '📝 Create test cases (Gherkin Builder)',
                        value: 'build_test_case'
                    },
                    {
                        name: '📦 Manage plugins and steps (Pack Manager)',
                        value: 'pack_manager'
                    },
                    {
                        name: '📊 Generate an HTML test report',
                        value: 'reporter'
                    },
                    new inquirer.Separator(),
                    {
                        name: '🚪 Exit',
                        value: 'exit'
                    }
                ]
            }
        ]);

        switch (choice) {
            case 'init':
                runInit();
                break;
            case 'build_test_case':
                runBuildTestCase();
                break;
            case 'pack_manager':
                runPackManager();
                break;
            case 'reporter':
                runReporter();
                break;
            case 'exit':
                console.log(chalk.blue('Goodbye!'));
                process.exit(0);
        }
    }

    // --- CLI Command Definitions ---

    program
        .name('cypress-craft')
        .description('CLI for the Cypress-Craft ecosystem. Run without arguments for an interactive menu.')
        .version(packageJson.version);

    program.command('init').description('Starts the setup wizard for a new project.').action(runInit);
    program.command('build-testcase').description('Starts the UI to generate .feature files.').action(runBuildTestCase);
    program.command('pack-manager').description('Starts the UI to manage plugins and steps.').action(runPackManager);
    program.command('generate-report').description('Generates an HTML test report.').action(runReporter);

    // --- Main Logic ---
    if (process.argv.length <= 2) {
        await showMainMenu();
    } else {
        program.parse(process.argv);
    }
}

start().catch(error => {
    console.error('An unexpected error occurred:', error);
    process.exit(1);
});
