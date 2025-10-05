#!/usr/bin/env node
const fs   = require('fs-extra');
const path = require('path');
// const logo = require('./logo'); // Removed logo import

const cwd        = process.cwd();               // Directory YourProject
const sourceDir  = path.join(__dirname, '../'); // Directory cypress-craft
const targetDir  = path.join(cwd);              // Directory YourProject
const cypressDir = path.join(cwd, 'cypress');   // Directory cypress/e2e

const ignoreFiles = [
    '.idea',
    '.github',
    '.git',
    '.gitignore',
    'node_modules',
    'package.json',
    'package-lock.json',
    'CHANGELOG.md',
    'README.md',
    'yarn.lock',
    'TODO.md',
    'CODE_OF_CONDUCT.md',
    'CONTRIBUTING.md',
    'qodana.yaml',
    'SECURITY.md',
    'LICENSE',
    'scripts',
    'Writerside',
    'buidersTestCase',
    'pack-manager',
    'api_en_steps.txt',
    'api_es_steps.txt',
    'e2e_en_steps.txt',
    'e2e_es_steps.txt',
    'common_en_steps.txt',
    'common_es_steps.txt',
    'stepDefinition.core.js',
    'cli.js'
];
const updateFiles = [
    'main.pom.js',
    'setupNodeEvents.js',
    'helpers.js',
    'commands.js'
    ]


// Reporting helpers
const symbols = {success: '✔', info: 'ℹ', warning: '⚠', error: '✖'};
const reportRows = [];
const relPath = (p) => path.relative(cwd, p);
function addReport(level, action, detail) {
    reportRows.push({level, action, detail});
}
function printReport(title = 'Post-install summary') {
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

async function renameFolder(oldPath, newPath, opts = {}) {
    const { level = 'success', action = 'Renamed' } = opts;
    try {
        await fs.rename(oldPath, newPath);
        addReport(level, action, `${relPath(oldPath)} → ${relPath(newPath)}`);
    } catch (error) {
        addReport('error', 'Rename failed', `${relPath(oldPath)} → ${relPath(newPath)} (${error.message})`);
        console.error('Error renaming folder:', error);
    }
}

async function insertContent(filePath, marker, content, opts = {}) {
    const { languageCode, sourceFileName } = opts;
    try {
        // Read current file content
        let fileContent = await fs.readFile(filePath, 'utf-8');

        // Idempotency: if the content already exists, skip to avoid duplicates
        if (fileContent.includes(content.trim())) {
            addReport('info', `Skipped (duplicate)`, `${marker} → ${path.basename(filePath)}`);
            return;
        }

        // Correct patterns: match the marker line ending with CRLF or LF
        const regexMap = {
            COMMON: /\/\/add steps COMMON\r?\n/,
            API: /\/\/add steps API\r?\n/,
            E2E: /\/\/add steps E2E\r?\n/
        };
        const regex = regexMap[marker];
        // Insert content AFTER the marker, preserving the marker and using a real newline
        fileContent = fileContent.replace(regex, (match) => match + content + '\n');

        // Write modified content back to the file
        await fs.writeFile(filePath, fileContent);

        // Custom reporting per section/marker
        const langLabel = languageCode ? languageCode.toUpperCase() : '';
        if (marker === 'COMMON') {
            const detail = sourceFileName ? `${langLabel} (${sourceFileName})` : relPath(filePath);
            addReport('info', 'Inserted COMMON steps', detail);
        } else if (marker === 'API' || marker === 'E2E') {
            // Destination info row
            addReport('info', `Inserted (${marker}) steps`, relPath(filePath));
            // Source info row
            if (sourceFileName) {
                addReport('info', `Inserted ${marker} steps`, `${langLabel} (${sourceFileName})`);
            }
        } else {
            // Fallback
            addReport('success', 'Updated', relPath(filePath));
        }
    } catch (error) {
        addReport('error', 'Update failed', `${relPath(filePath)} (${error.message})`);
        console.error(`Error updating ${filePath}:`, error);
    }
}

async function mergeStepDefinitions(language, type) {
    const languageCode       = language === 'Spanish' ? 'es' : 'en';
    const basePath           = path.join(cwd, 'node_modules', 'cypress-craft', 'cypress', 'common');
    const stepDefinitionPath = path.join(cwd, 'cypress', 'common', 'stepDefinition.js');
    const testsFolderOld     = path.join(cwd, 'cypress', `tests_${languageCode}`);
    const testsFolder        = path.join(cwd, 'cypress', `tests`);

    // Define file names based on language and type
    const filesToMerge = [];
    // 1) Common steps per language (always first)
    filesToMerge.push(`common_${languageCode}_steps.txt`);
    // 2) API steps if applicable
    if (type === 'API' || type === 'E2E+API') {
        filesToMerge.push(`api_${languageCode}_steps.txt`);
    }
    // 3) E2E steps if applicable
    if (type === 'E2E' || type === 'E2E+API') {
        filesToMerge.push(`e2e_${languageCode}_steps.txt`);
    }

    // Read and insert each section at its corresponding marker
    for (const fileName of filesToMerge) {
        const filePath      = path.join(basePath, fileName);
        const content       = await fs.readFile(filePath, 'utf8');
        let sectionMarker   = 'COMMON';
        if (fileName.startsWith('api_')) sectionMarker = 'API';
        if (fileName.startsWith('e2e_')) sectionMarker = 'E2E';
        await insertContent(stepDefinitionPath, sectionMarker, content, { languageCode, sourceFileName: fileName });
    }

    // Rename index /pom according to selected type
    const pomDir = path.join(cwd, 'cypress', 'pom');
    if (type === 'E2E+API') {
        const combinedIndex = path.join(pomDir, 'index.js');
        if (fs.existsSync(combinedIndex)) {
            addReport('info', 'Using (E2E+API) POM', relPath(combinedIndex));
        } else {
            addReport('warning', 'Missing', `Expected combined POM ${relPath(combinedIndex)}`);
        }
    } else {
        const typeIndex = path.join(pomDir, `${type}_index.js`);
        const finalIndex = path.join(pomDir, 'index.js');
        if (fs.existsSync(typeIndex)) {
            addReport('info', `Using ${type} POM`, relPath(typeIndex));
            await renameFolder(typeIndex, finalIndex, { level: 'info', action: 'renamed' });
        } else {
            addReport('warning', 'Missing', `indexPomPath ${relPath(typeIndex)}`);
        }
    }
    await renameFolder(testsFolderOld, testsFolder);
}


async function ensurePackageScripts() {
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

        //Ignore files
        if (ignoreFiles.includes(basename)) {
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

async function main() {
    const inquirer = await import('inquirer');
    const prompt   = inquirer.default.prompt;

    console.log('\nWelcome to the Cypress-Craft Project Initialization Wizard!');
    console.log('This wizard will guide you through setting up a new Cypress project from scratch,');
    console.log('integrating Cucumber for BDD and a Page Object Model (POM) structure.');
    console.log("You'll be able to choose your preferred language and test type (E2E, API, or both).");
    console.log("Let's get your test automation framework ready!\n");

    const answers = await prompt([
        {
            type   : 'list',
            choices: ['English', 'Spanish'],
            name   : 'language',
            message: 'Language of your project?',
            default: 'English' // Changed default to English
        },
        {
            type   : 'list',
            choices: ['E2E', 'API', 'E2E+API'], //None
            name   : 'typeTest',
            message: 'Type of project?',
            default: 'E2E+API'
        },
        {
            type   : 'confirm',
            name   : 'report',
            message: 'Do you want to include report?',
            default: true
        }
        // more questions as needed
    ]);
    await init(answers.language, answers.typeTest, answers.report);
}

async function install(){
    // console.log(logo) // Removed logo display

    const args   = process.argv.slice(2);
    let errorParams = false;
    const params = args.reduce((acc, arg) => {
        let [key, value] = arg.split(':');
        key              = key.replace('--', '').toLowerCase();
        if (!['l', 'language', 't', 'typeTest', 'r', 'report'].includes(key)){
            errorParams = true;
        }
        if (key === 'language') key = 'l';
        if (key === 'typeTest') key = 't';
        if (key === 'report') key = 'r';
        acc[key] = value;
        return acc;
    }, {});

    if (errorParams){
        console.log('-- Invalid parameters. Please try again with the wizard install --');
        await main();
        return;
    }

    if (Object.keys(params).length === 0) {
        await main();
    } else {
        console.log(params);
        if(['Spanish','ES','es','English', 'EN', 'en'].includes(params[Object.keys(params)[0]])
            && ['E2E', 'e2e', 'API', 'api', 'e2e+api', 'api+e2e', 'E2E+API'].includes(params[Object.keys(params)[1]])
            && ['true', 'false', 'Y', 'y'].includes(params[Object.keys(params)[2]])
        ){
            let language = null;
            let typeTest = null;
            let addReport = null;

            if(['ES','es'].includes(params[Object.keys(params)[0]])){
                language = 'Spanish'
            }
            if(['EN','en'].includes(params[Object.keys(params)[0]])){
                language = 'English'
            }

            if(['e2e', 'api'].includes(params[Object.keys(params)[1]])){
                typeTest = params[Object.keys(params)[1]].toUpperCase();
            }
            if(['e2e+api', 'api+e2e', 'E2E+API'].includes(params[Object.keys(params)[1]])){
                typeTest = 'E2E+API';
            }
            if(['true', 'Y', 'y'].includes(params[Object.keys(params)[2]])){
                addReport = true;
            }
            if(['false', 'N'].includes(params[Object.keys(params)[2]])){
                addReport = false;
            }

            if (language === null || typeTest === null || addReport === null){
                console.log('-- Invalid parameters. Please try again with the wizard install --');
                await main();
            } else {
                await init(language, typeTest, addReport);
            }
        }else{
            console.log('-- Invalid parameters. Please try again with the wizard install --');
            await main();
        }

    }
}

install();
