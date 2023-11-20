const fs   = require('fs');
const path = require('path');

const templateDir = path.join('..');
const destinoDir  = path.join('..', process.cwd());
const ignoreFile = [
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

function copiarRecursivamente(src, dest) {
    const elementos = fs.readdirSync(src);
    const table = {};
    elementos.forEach(elemento => {
        if(ignoreFile.includes(elemento)) return;
        const srcPath = path.join(src, elemento);
        const destPath = path.join(dest, elemento);

        table[srcPath] = srcPath;
        table[destPath] = destPath;


        // // Si es un directorio, hacer una llamada recursiva
        // if (fs.lstatSync(srcPath).isDirectory()) {
        //     copiarRecursivamente(srcPath, destPath);
        // } else {
        //     // Si es un archivo, simplemente copiarlo
        //     fs.copyFileSync(srcPath, destPath);
        // }
    });

    console.table(table);
}


// Iniciar la copia
copiarRecursivamente(templateDir, destinoDir);

console.log('Plantilla copiada con éxito en:', destinoDir);
