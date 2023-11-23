import path from 'path';
import {fileURLToPath} from 'url';
import inquirer from 'inquirer';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const sourceDir  = path.join(__dirname, '../'); // Directory cypress-craft
const targetDir  = path.join(__dirname, '../../../'); // Directory YourProject

const ignoreFiles = [
    '.idea',
    '.git',
    '.gitignore',
    'node_modules',
    'package.json',
    'package-lock.json',
    'CHANGELOG.md',
    'README.md',
    'yarn.lock',
    'TODO.md',
    'LICENSE',
    'scripts'
];


inquirer.prompt([
    {
        type   : 'list',
        choices: ['English', 'Spanish'],
        name   : 'language',
        message: 'choices the language of your project?'
    },
    {
        type   : 'list',
        choices: ['E2E', 'API', 'E2E+API'], //None
        name   : 'typeLogic',
        message: 'Choice type of project?'
    },
    {
        type   : 'confirm',
        name   : 'report',
        message: 'Are you what include report?'
    }
    // más preguntas según sea necesario
]).then(answers => {
    console.log('Respuesta: ' + JSON.stringify(answers))
    const filterFunc = (src) => {
        const basename = path.basename(src);
        return !ignoreFiles.includes(basename);
    };
    fs.copy(sourceDir, targetDir, {overwrite: true, filter: filterFunc}, function (err) {
        if (err) {
            console.error('Error copying files: ', err);
        } else {
            console.log('Files copied successfully.');
        }
    });
    console.log('Template successfully copied to:', targetDir);

});