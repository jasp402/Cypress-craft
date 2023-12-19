#!/usr/bin/env node
const fs   = require('fs-extra');
const path = require('path');
const logo = require('./logo');
const sourceDir   = path.join(__dirname, '../');         // Directory cypress-craft
const targetDir   = path.join(__dirname, '../../../');   // Directory YourProject
const cypressDir  = path.join(targetDir, 'cypress/e2e'); // Directory cypress/e2e
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
    'Writerside'
];

function init(language, typeTest){
    const filterFunc = (src) => {
        const basename = path.basename(src);
        return !ignoreFiles.includes(basename);
    }
    if (fs.existsSync(cypressDir)) {
        console.log('Cypress/e2e directory already exists. Skipping file copy.');
    } else {
        fs.copy(sourceDir, targetDir, { overwrite: true, filter: filterFunc }, function (err) {
            if (err) {
                console.error('Error copying files: ', err);
            } else {
                console.log('Files copied successfully.');
            }
        });
    }
    console.log('Template successfully copied to:', targetDir);
}
async function main() {
    const inquirer = await import('inquirer');
    const prompt = inquirer.default.prompt;
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
            name   : 'typeLogic',
            message: 'Choice type of project?',
            default: 'API'
        },
        {
            type   : 'confirm',
            name   : 'report',
            message: 'Are you what include report?',
            default: true
        }
        // más preguntas según sea necesario
    ]).then(answers => {
        init(answers.language, answers.type);
        console.log('Respuesta: ' + JSON.stringify(answers))
        console.log('Template successfully copied to:', targetDir);
    });
}


async function insertContent(filePath, marker, content) {
    try {
        // Lee el contenido actual del archivo
        let fileContent = await fs.readFile(filePath, 'utf-8');
        let regexMap = {
            API: /(\/\/add steps API\r?\n)/,
            E2E: /(\/\/add steps E2E\r?\n)/
        }
        // Construye un patrón regex para encontrar el marcador
        const regex = new RegExp(regexMap[marker], 'm');
        fileContent = fileContent.replace(regex, `${content}\n`);

        // Escribe el contenido modificado de vuelta en el archivo
        await fs.writeFile(filePath, fileContent);
        console.log(`${filePath} actualizado con éxito.`);
    } catch (error) {
        console.error(`Error al actualizar ${filePath}:`, error);
    }
}

async function mergeStepDefinitions(language, type) {
    const basePath = '../cypress/common'; // Asegúrate que esta sea la ruta correcta a tus archivos
    const stepDefinitionPath = path.join(basePath, 'stepDefinition.js');

    // Define los nombres de los archivos basados en el idioma y tipo
    let filesToMerge = [];
    if (type === 'API' || type === 'API+E2E') {
        filesToMerge.push(`api_${language === 'Spanish' ? 'es' : 'en'}_steps.txt`);
    }
    if (type === 'E2E' || type === 'API+E2E') {
        filesToMerge.push(`e2e_${language === 'Spanish' ? 'es' : 'en'}_steps.txt`);
    }

    // Lee y combina el contenido de los archivos seleccionados
    for (const fileName of filesToMerge) {
        const filePath = path.join(basePath, fileName);
        const content = await fs.readFile(filePath, 'utf8');
        const sectionMarker = fileName.includes('api_') ? 'API' : 'E2E';
        await insertContent(stepDefinitionPath, sectionMarker, content);
    }

    console.log('Los contenidos de stepDefinition.js han sido actualizados.');
}


const args = process.argv.slice(2);
const params = args.reduce((acc, arg) => {
    const [key, value] = arg.split(':');
    acc[key.replace('--', '')] = value;
    return acc;
}, {});
console.log(logo)
if (!params.language || !params.type) {
    main();
} else {
    init(params.language, params.type);
}



