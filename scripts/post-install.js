#!/usr/bin/env node
const fs   = require('fs-extra');
const path = require('path');
const { buildProject } = require('./builder');

const cwd        = process.cwd();               // Directory YourProject
const sourceDir  = path.join(__dirname, '../'); // Directory cypress-craft
let targetDir  = path.join(cwd);              // Directory YourProject
let cypressDir = path.join(cwd, 'cypress');   // Directory cypress/e2e

const isDebugMode = process.argv.includes('--debug');

// Reporting helpers
const symbols = {success: '✔', info: 'ℹ', warning: '⚠', error: '✖'};
const reportRows = [];
const relPath = (p) => path.relative(cwd, p);

// 1.- Se inicia el Formulario Wizard para que el usuario completa con los datos.
//     (language, TypeTest, reportStyle, ciCdStyle, exampleDemo)
async function initWizardInstall() {
    const inquirer  = await import('inquirer');
    const chalk     = (await import('chalk')).default;
    const prompt    = inquirer.default.prompt;

    console.log('\nWelcome to the Cypress-Craft Project Initialization Wizard!');
    console.log('This wizard will guide you through setting up a new Cypress project from scratch,');
    console.log('integrating Cucumber for BDD and a Page Object Model (POM) structure.');
    console.log("You'll be able to choose your preferred language and test type (E2E, API, or both).");
    console.log("Let's get your test automation framework ready!\n");

    const answers = await prompt([
        // 🔹 Section: language project (ES, EN, etc)
        {
            type: 'list',
            name: 'language',
            message: 'Language of your project?',
            default: 'English',
            choices: [
                {
                    name: `English ${chalk.gray('(Scenario, Given, When, Then)')}`,
                    value: 'English',
                },
                {
                    name: `Spanish ${chalk.gray('(Escenario, Dado, Cuando, Entonces)')}`,
                    value: 'Spanish',
                },
            ],
        },
        // 🔹 Section: Test Types (E2E, API, BD, AWS, GCP, MOBILE, etc)
        {
            type: 'checkbox',
            name: 'typeTest',
            message: 'Select project types:',
            choices: [
                {
                    name: `E2E ${chalk.gray('– End-to-End testing for full user journeys')}`,
                    value: 'E2E',
                    short: 'E2E'
                },
                {
                    name: `API ${chalk.gray('– Integration & microservices testing')}`,
                    value: 'API',
                    short: 'API'
                },
                {
                    name: `BD ${chalk.gray('– Database validation & data integrity checks')}`,
                    value: 'BD',
                    short: 'BD'
                },
                {
                    name: `AWS ${chalk.gray('– Cloud workflows: Lambda, EventBridge, CloudWatch')}`,
                    value: 'AWS',
                    short: 'AWS'
                },
            ],
            default: ['E2E', 'API'],
        },
        // 🔹 Section: Fast question, Include Report? [Y/N]
        {
            type: 'confirm',
            name: 'report',
            message: 'Do you want to include report?',
            default: true
        },
        // 🔹 Section: Reporter Style, (Mochawesome, Cucumber HTML, Allure)
        {
            type: 'list',
            name: 'reporterStyle',
            message: 'Select reporter style:',
            choices: [
                {
                    name: `Mochawesome ${chalk.gray('– Simple and elegant HTML report')}`,
                    value: 'mochawesome'
                },
                {
                    name: `Cucumber HTML ${chalk.gray('– Detailed feature-based report')}`,
                    value: 'cucumber-html-reporter'
                },
                {
                    name: `Allure ${chalk.gray('– Advanced and interactive dashboard')}`,
                    value: 'allure'
                },
            ],
            default: 'mochawesome',
            when: (answers) => answers.report === true,
        },
        // 🔹 Section: Fast question, Include CI/CD? [Y/N]
        {
            type: 'confirm',
            name: 'ciCd',
            message: 'Do you want to include CI/CD config file?',
            default: true
        },
        // 🔹 Section: CI/CD Integration Style, (GitHub Actions, GitLab CI, Jenkins)
        {
            type: 'list',
            name: 'ciCdStyle',
            message: 'Integrate with CI/CD?',
            choices: [
                {
                    name: `GitHub Actions ${chalk.gray('– Creates .github/workflows/test.yml')}`,
                    value: 'github'
                },
                {
                    name: `GitLab CI ${chalk.gray('– Creates .gitlab-ci.yml')}`,
                    value: 'gitlab'
                },
                {
                    name: `Jenkins ${chalk.gray('– Adds Jenkinsfile configuration')}`,
                    value: 'jenkins'
                }

            ],
            default: 'none',
            when: (answers) => answers.ciCd === true,

        },
        // 🔹 Section: Initialize Examples? (Basic, None)
        {
            type: 'list',
            name: 'exampleInit',
            message: 'Initialize example tests?',
            choices: [
                {
                    name: `Basic ${chalk.gray('– Minimal test to confirm setup works')}`,
                    value: 'basic'
                },
                {
                    name: `None ${chalk.gray('– Start with empty project')}`,
                    value: 'none'
                },
            ],
            default: 'basic'
        },
    ]);

    console.log(chalk.cyan('\n✨ Great! These are all your selected configurations:'));
    console.log(chalk.gray('──────────────────────────────────────────────'));
    console.log(chalk.green('🚀 Setup complete! Your Cypress-Craft project is ready to be generated.'));
    console.log(chalk.yellow('Let’s craft your testing experience to the next level! 💪\n'));
    const showResult = {
        ...answers,
        typeTest: answers.typeTest.join(', ')
    };
    console.table(showResult);

    // Se requiere - Confirmar instalación
    const { confirmInstall } = await prompt([
        {
            type: 'confirm',
            name: 'confirmInstall',
            message: chalk.yellow('✅ Is everything correct and ready to start the installation?'),
            default: true,
        },
    ]);

    if (confirmInstall) {
        console.log(chalk.green('\n🚀 Starting installation... Get ready to create magic with Cypress-Craft! ⚙️\n'));

        // 1. Construye la estructura del proyecto en la carpeta temporal .build
        await buildProject(answers.language, answers.typeTest,{addReport, relPath});

        // 2. Transfiere la estructura construida desde .build al proyecto del usuario
        const buildDir = path.join(sourceDir, '.build');
        if (fs.existsSync(buildDir)) {
            console.log(chalk.blue('Finalizing installation by copying files to your project...'));
            await fs.copy(buildDir, targetDir, { overwrite: true });
            addReport('success', 'Project files transferred', `${relPath(buildDir)} → ${relPath(targetDir)}`);
            await fs.remove(buildDir); // Limpia la carpeta temporal
        }

        await ensurePackageScripts();
        printReport('Installation Summary');
        console.log(chalk.cyan('\n✨ Cypress-Craft setup complete! You are ready to start testing. ✨'));
        console.log('To open Cypress, run:\n  npm start\n');
    } else {
        console.log(chalk.red('\n🔁 Process canceled. Restarting the wizard....\n'));
        await initWizardInstall(); // reiniciamos el proceso
    }
}

function addReport(level, action, detail) {
    console.log('[DEBUG] --- addReport() ---', {level, action, detail});
    reportRows.push({level, action, detail});
}
function printReport(title = 'Post-install summary') {
    console.log('[DEBUG] --- printReport() ---', {title});
    if (reportRows.length === 0) return;
    console.log(`\n${title}:`);
    for (const r of reportRows) {
        const icon = symbols[r.level] || '•';
        const action = `${icon} ${r.action}`;
        if (r.detail) {
            console.log(`  - ${action}: ${r.detail}`);
        } else {
            console.log(`  - ${action}`);
        }
    }
}

async function ensurePackageScripts() {
    if(isDebugMode) console.log('[DEBUG] --- ensurePackageScripts() ---');
    try {
        const pkgPath = path.join(cwd, 'package.json');
        if (!fs.existsSync(pkgPath)) {
            addReport('warning', 'Missing', 'package.json (no scripts added)');
            return;
        }
        const pkgRaw = await fs.readFile(pkgPath, 'utf8');
        const pkg = JSON.parse(pkgRaw);
        pkg.scripts = pkg.scripts || {};

        const desired = [
            { key: 'start', value: 'cypress open' },
            { key: 'cypress-craft', value: 'cypress-craft' }
        ];

        for (const { key, value } of desired) {
            if (pkg.scripts[key]) {
                addReport('info', 'Skipped (exists)', `script "${key}": ${pkg.scripts[key]}`);
            } else {
                pkg.scripts[key] = value;
                addReport('success', 'Added npm script', `"${key}": "${value}"`);
            }
        }

        await fs.writeFile(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
    } catch (err) {
        addReport('error', 'Scripts update failed', err.message);
    }
}

async function init(language, typeTest, reports) {
    const languageDir   = language === 'English' ? 'tests_es'  : 'tests_en' ;

    const filterFunc = (src) => {
        const basename = path.basename(src);

        if(!reports && basename === 'report-cucumber.js'){
            return false;
        }

        //Si no esta en la lista de archivos a tranferir | return false.
        if (!includeFile.includes(basename)) {
            return false;
        }

        //Exclude language [ES / EN]
        if (basename.includes(languageDir)) {
            return false;
        }

        //Exclude type test [E2E / API]
        if (typeTest !== 'E2E+API') {
            const testTypePath = (typeTest === 'API') ? 'e2e' : 'api';
            if (basename.includes(testTypePath)) {
                if(src.indexOf(`cypress\\support\\${testTypePath}.js`)===-1){
                    return false;
                }
            }
        }

        // index POM
        if(typeTest === 'E2E+API'){
            if(['API_index.js', 'E2E_index.js'].includes(basename)) {
                return false;
            }
        }
        else if(typeTest === 'E2E') {
            if(['API_index.js', 'index.js'].includes(basename)) {
                return false;
            }
        }
        else if(typeTest === 'API'){
            if(['E2E_index.js', 'index.js'].includes(basename)) {
                return false;
            }
        }

        return true;
    };
    const updateFilter = (src) => {
        if (updateFiles.includes(path.basename(src))) {
            return true;
        }else{
            return  false;
        }
    }

    try {
        if (fs.existsSync(cypressDir)) {
            await fs.copy(sourceDir, targetDir, {overwrite: true, filter: updateFilter});
            console.log('\n✨ Cypress-Craft files updated! ✨');
        } else {
            await fs.copy(sourceDir, targetDir, {overwrite: true, filter: filterFunc});
            await mergeStepDefinitions(language, typeTest);
            console.log('\n✨ Cypress-Craft setup complete! ✨');
            console.log('You are ready to start testing. To open Cypress, run:');
            console.log('\n  npx cypress open\n');
        }
        await ensurePackageScripts();
        printReport();
    } catch (err) {
        console.error('Error during initialization: ', err);
    }
}



initWizardInstall();
