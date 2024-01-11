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
const updateFiles = [
    'main.pom.js',
    'setupNodeEvents.js',
    'helpers.js',
    'commands.js'
    ]


async function renameFolder(oldPath, newPath) {
    try {
        await fs.rename(oldPath, newPath);
    } catch (error) {
        console.error('Error al renombrar la carpeta:', error);
    }
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

    //remane index /pom
    const indexPomPath       = path.join(cwd, 'cypress', 'pom', `${type}_index.js`);
    if(fs.existsSync(indexPomPath)) {
        console.log('si existe: indexPomPath', indexPomPath);
        await renameFolder(indexPomPath, path.join(cwd, 'cypress', 'pom', `index.js`));
    }else{
        console.log('no existe: indexPomPath', indexPomPath);
    }
    await renameFolder(testsFolderOld, testsFolder);
}


function init(language, typeTest, reports) {
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

    if (fs.existsSync(cypressDir)) {
        fs.copy(sourceDir, targetDir, {overwrite: true, filter: updateFilter}, function (err) {
            if (err) {
                console.error('Error update files: ', err);
            }
        });
    } else {
        fs.copy(sourceDir, targetDir, {overwrite: true, filter: filterFunc}, function (err) {
            if (err) {
                console.error('Error copying files: ', err);
            } else {
                if (fs.existsSync(cypressDir)) {
                    mergeStepDefinitions(language, typeTest, languageDir);
                }
            }
        });
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
            message: 'Language of your project?',
            default: 'Spanish'
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
        // más preguntas según sea necesario
    ]).then(answers => {
        init(answers.language, answers.typeTest, answers.report);
    });
}

function install(){
    console.log(logo)

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
        console.log('-- Invalid parameters. Try again with wizard install --');
        main();
    }

    if (Object.keys(params).length === 0) {
        main();
    } else {
        console.log(params);
        if(['Spanish','ES','es','English', 'EN', 'en'].includes(params[Object.keys(params)[0]])
            && ['E2E', 'e2e', 'API', 'api', 'e2e+api', 'api+e2e', 'E2E+API'].includes(params[Object.keys(params)[1]])
            && ['true', 'false', 'Y', 'y', 'N', 'n'].includes(params[Object.keys(params)[2]])
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
            if(['false', 'N', 'n'].includes(params[Object.keys(params)[2]])){
                addReport = false;
            }

            if (language === null || typeTest === null || addReport === null){
                console.log('-- Invalid parameters. Try again with wizard install --');
                main();
            }

            init(language, typeTest, addReport);
        }else{
            console.log('-- Invalid parameters. Try again with wizard install --');
            main();
        }

    }
}

install();
