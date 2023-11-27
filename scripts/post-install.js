const fs   = require('fs-extra');
const path = require('path');

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
    'scripts'
];

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