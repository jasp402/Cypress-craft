#!/usr/bin/env node
const fs   = require('fs-extra');
const path = require('path');
const logo = require('./logo');

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
    'api_en_steps.txt',
    'api_es_steps.txt',
    'e2e_en_steps.txt',
    'e2e_es_steps.txt',
    'stepDefinition.core.js'
];


function init(language, typeTest) {
    const languageDir   = language === 'English' ? 'tests_es'  : 'tests_en' ;

    const filterFunc = (src) => {
        const basename = path.basename(src);

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
                return false;
            }
        }
        return true;
    };

    if (fs.existsSync(cypressDir)) {
        console.log('Target directory already exists. Skipping file copy.');
    } else {
        fs.copy(sourceDir, targetDir, {overwrite: true, filter: filterFunc}, function (err) {
            if (err) {
                console.error('Error copying files: ', err);
            } else {
                console.log('Files copied successfully.');
                if (fs.existsSync(cypressDir)) {
                    mergeStepDefinitions(language, typeTest, languageDir);
                }
            }
        });
    }
    console.log('Template successfully copied to:', targetDir);
}

async function renameFolder(oldPath, newPath) {
    console.log(`Intentando renombrar de: ${oldPath.split('/').pop()} a: ${newPath.split('/').pop()}`); // Log antes de intentar renombrar
    try {
        await fs.rename(oldPath, newPath);
        console.log(`La carpeta ha sido renombrada de ${oldPath} a ${newPath}`);
    } catch (error) {
        console.error('Error al renombrar la carpeta:', error);
    }
}

async function main() {
    const inquirer = await import('inquirer');
    const prompt   = inquirer.default.prompt;
    prompt([
        {
            type   : 'list',
            choices: ['English', 'Spanish'],
            name   : 'language',
            message: 'choices the language of your project?',
            default: 'Spanish'
        },
        {
            type   : 'list',
            choices: ['E2E', 'API', 'E2E+API'], //None
            name   : 'typeTest',
            message: 'Choice type of project?',
            default: 'E2E+API'
        },
        {
            type   : 'confirm',
            name   : 'report',
            message: 'Are you what include report?',
            default: true
        }
        // más preguntas según sea necesario
    ]).then(answers => {
        console.log('Respuesta: ' + JSON.stringify(answers));
        init(answers.language, answers.typeTest);
    });
}

async function insertContent(filePath, marker, content) {
    try {
        // Lee el contenido actual del archivo
        let fileContent = await fs.readFile(filePath, 'utf-8');
        let regexMap    = {
            API: /(\/\/add steps API\r?\n)/,
            E2E: /(\/\/add steps E2E\r?\n)/
        }
        // Construye un patrón regex para encontrar el marcador
        const regex     = new RegExp(regexMap[marker], 'm');
        fileContent     = fileContent.replace(regex, `${content}\n`);

        // Escribe el contenido modificado de vuelta en el archivo
        await fs.writeFile(filePath, fileContent);
        console.log(`${filePath} actualizado con éxito.`);
    } catch (error) {
        console.error(`Error al actualizar ${filePath}:`, error);
    }
}

async function mergeStepDefinitions(language, type) {
    const languageCode       = language === 'Spanish' ? 'es' : 'en';
    const basePath           = cwd + '/node_modules/cypress-craft/cypress/common';
    const stepDefinitionPath = path.join(cwd, 'cypress', 'common', 'stepDefinition.js');
    const testsFolderOld     = path.join(cwd, 'cypress', `tests_${languageCode}`);
    const testsFolder        = path.join(cwd, 'cypress', `tests`);

    // Define los nombres de los archivos basados en el idioma y tipo
    let filesToMerge = [];
    if (type === 'API' || type === 'E2E+API') {
        filesToMerge.push(`api_${language === 'Spanish' ? 'es' : 'en'}_steps.txt`);
    }
    if (type === 'E2E' || type === 'E2E+API') {
        filesToMerge.push(`e2e_${language === 'Spanish' ? 'es' : 'en'}_steps.txt`);
    }
    // Lee y combina el contenido de los archivos seleccionados
    for (const fileName of filesToMerge) {
        const filePath      = path.join(basePath, fileName);
        const content       = await fs.readFile(filePath, 'utf8');
        const sectionMarker = fileName.includes('api_') ? 'API' : 'E2E';
        await insertContent(stepDefinitionPath, sectionMarker, content);
    }

    await renameFolder(testsFolderOld, testsFolder);
    console.log('Los contenidos de stepDefinition.js han sido actualizados.');
}

const args   = process.argv.slice(2);
const params = args.reduce((acc, arg) => {
    let [key, value] = arg.split(':');
    key              = key.replace('--', '').toLowerCase();
    console.log(key);
    if (!['l', 'language', 't', 'typeTest', 'r', 'report'].includes(key)) throw new Error('Invalid parameter: ' + key);
    if (key === 'language') key = 'l';
    if (key === 'typeTest') key = 't';
    if (key === 'report') key = 'r';
    acc[key] = value;
    return acc;
}, {});
console.log(logo)
console.log(params);
if (Object.keys(params).length === 0) {
    main();
} else {
    console.log(params[Object.keys(params)[0]]);
    init(params[Object.keys(params)[0]], params[Object.keys(params)[1]]);
}