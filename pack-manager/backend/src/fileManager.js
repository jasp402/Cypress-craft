const fs = require('fs').promises;
const path = require('path');

const USER_PROJECT_ROOT = path.join(__dirname, '..', '..', '..');

async function injectCode(targetFilePath, markerStart, markerEnd, codeContent) {
    const absoluteTargetFilePath = path.join(USER_PROJECT_ROOT, targetFilePath);

    try {
        let fileContent = '';
        try {
            fileContent = await fs.readFile(absoluteTargetFilePath, 'utf8');
        } catch (error) {
            if (error.code === 'ENOENT') {
                console.warn(`El archivo ${absoluteTargetFilePath} no existe, creándolo.`);
                await fs.mkdir(path.dirname(absoluteTargetFilePath), { recursive: true });
                if (targetFilePath.includes('pom.js')) {
                    fileContent = `module.exports = class Main {\n\n}`;
                } else {
                    fileContent = '';
                }
            } else {
                throw error;
            }
        }

        const startMarker = `// ${markerStart}`;
        const endMarker = `// ${markerEnd}`;
        const indentedCode = codeContent.split('\n').map(line => `    ${line}`).join('\n');
        const newCodeBlock = `\n    ${startMarker}\n${indentedCode}\n    ${endMarker}`;

        if (fileContent.includes(startMarker)) {
            const startIndex = fileContent.indexOf(startMarker);
            const endIndex = fileContent.indexOf(endMarker) + endMarker.length;
            const before = fileContent.substring(0, startIndex);
            const after = fileContent.substring(endIndex);
            fileContent = `${before}${newCodeBlock.trim()}${after}`;
            console.log(`Contenido actualizado entre marcadores en ${targetFilePath}`);
        } else {
            if (targetFilePath.includes('pom.js')) {
                const lines = fileContent.split('\n');
                let lastBraceLineIndex = -1;
                for (let i = lines.length - 1; i >= 0; i--) {
                    if (lines[i].trim() === '}') {
                        lastBraceLineIndex = i;
                        break;
                    }
                }
                if (lastBraceLineIndex !== -1) {
                    lines.splice(lastBraceLineIndex, 0, newCodeBlock);
                    fileContent = lines.join('\n');
                    console.log(`Contenido inyectado DENTRO de la clase en ${targetFilePath}`);
                } else {
                    return { success: false, message: `No se pudo encontrar la estructura de clase para inyectar en ${targetFilePath}` };
                }
            } else {
                fileContent += `\n${newCodeBlock.trim()}`;
                console.log(`Contenido añadido al final de ${targetFilePath}`);
            }
        }

        await fs.writeFile(absoluteTargetFilePath, fileContent, 'utf8');
        return { success: true, message: `Código inyectado/actualizado en ${targetFilePath}` };
    } catch (error) {
        console.error(`Error al inyectar código en ${targetFilePath}:`, error.message);
        return { success: false, message: `Error al inyectar código: ${error.message}` };
    }
}

async function removeCode(targetFilePath, markerStart, markerEnd) {
    const absoluteTargetFilePath = path.join(USER_PROJECT_ROOT, targetFilePath);

    try {
        const originalContent = await fs.readFile(absoluteTargetFilePath, 'utf8');
        const lines = originalContent.split(/\r?\n/); // Manejar saltos de línea de Windows y Unix

        let startIndex = -1;
        let endIndex = -1;

        // Encontrar los índices de las líneas de inicio y fin del bloque
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes(markerStart)) {
                startIndex = i;
            }
            if (lines[i].includes(markerEnd)) {
                endIndex = i;
                break; // Salir después de encontrar el primer bloque completo
            }
        }

        if (startIndex !== -1 && endIndex !== -1) {
            // Filtrar las líneas, manteniendo solo las que están FUERA del bloque
            const newLines = lines.filter((_, index) => index < startIndex || index > endIndex);
            
            // Limpiar líneas vacías extra que puedan quedar por la eliminación
            const finalContent = newLines.join('\n').replace(/(\n){3,}/g, '\n\n');

            await fs.writeFile(absoluteTargetFilePath, finalContent, 'utf8');
            console.log(`ÉXITO: Bloque de código ${markerStart} eliminado de ${targetFilePath}.`);
            return { success: true };
        } else {
            console.warn(`ADVERTENCIA: Marcadores para ${markerStart} no encontrados en ${targetFilePath}. No se eliminó nada.`);
            return { success: true }; // Si no hay nada que eliminar, se considera un éxito
        }

    } catch (error) {
        if (error.code === 'ENOENT') {
            console.warn(`ADVERTENCIA: El archivo ${targetFilePath} no existe, no hay nada que eliminar.`);
            return { success: true };
        }
        console.error(`ERROR al eliminar código de ${targetFilePath}:`, error.message);
        return { success: false, message: `Error al eliminar código: ${error.message}` };
    }
}

module.exports = { injectCode, removeCode };
