const fs = require('fs-extra');
const path = require('path');

const sourceDir = path.join(__dirname, '../');
const templatesDir = path.join(sourceDir, 'templates');
const scaffoldDir = path.join(sourceDir, 'cypress'); // Directorio para la estructura base de Cypress
const i18nDir = path.join(sourceDir, 'templates', 'i18n');

const TEST_MODULES = {
    E2E: {
        name: 'E2E',
        stepsTemplate: 'steps/e2e_steps.tpl.js',
        featureDir: 'features/e2e',
        destFeatureDir: 'cypress/test/e2e', // Ruta de destino en .build
        supportFile: 'cypress/support/e2e.js'
    },
    API: {
        name: 'API',
        stepsTemplate: 'steps/api_steps.tpl.js',
        featureDir: 'features/api',
        destFeatureDir: 'cypress/test/api', // Ruta de destino en .build
        supportFile: 'cypress/support/api.js'
    },
    BD: {
        name: 'BD',
        stepsTemplate: 'steps/bd_steps.tpl.js',
        featureDir: 'features/db', // Corregido a 'db' para consistencia
        commandsTemplate: 'support/db_commands.tpl.js', // Nuevo: template para comandos de BD
        destFeatureDir: 'cypress/test/bd', // Ruta de destino en .build
        supportFile: 'cypress/support/bd.js'
    },
    AWS: {
        name: 'AWS',
        stepsTemplate: 'steps/aws_steps.tpl.js',
        featureDir: 'features/aws',
        destFeatureDir: 'cypress/test/aws', // Ruta de destino en .build
        supportFile: 'cypress/support/aws.js'
    },
};

const buildDir = path.join(sourceDir, '.build'); // Carpeta temporal para construir los archivos finales
const buildDirCypress = path.join(sourceDir, '.build','cypress'); // Carpeta temporal para construir los archivos finales
let featureDictionaries = {};
let stepDictionaries = {};
try {
    // Carga diccionarios para los archivos .feature
    featureDictionaries = {
        English: require(path.join(i18nDir, 'features', 'en.js')).default,
        Spanish: require(path.join(i18nDir, 'features', 'es.js')).default,
    };
    // Carga diccionarios para los archivos de steps
    stepDictionaries = {
        English: require(path.join(i18nDir, 'steps', 'en.js')).default,
        Spanish: require(path.join(i18nDir, 'steps', 'es.js')).default,
    };
} catch (e) {
    // i18n files might not exist yet, handle gracefully.
}


function translateContent(content, dictionary) {
    if (!dictionary) return content;

    // Itera sobre cada clave del diccionario (ej: '@USER_ACTION_INTO_ELEMENT')
    for (const key in dictionary) {
        const value = dictionary[key];

        if (value instanceof RegExp) {
            // Si el valor es una RegExp, busca el marcador CON comillas y lo reemplaza por el RegExp literal.
            // Esto convierte "'@KEY'" o '"@KEY"' en /.../
            const regexWithQuotes = new RegExp(`(['"])${key}\\1`, 'g');
            content = content.replace(regexWithQuotes, value.toString());
        } else {
            // Si es un string, busca el marcador sin comillas y lo reemplaza.
            // Esto convierte @KEY en '...' (asumiendo que las comillas ya están en el diccionario).
            const regexSimple = new RegExp(key, 'g');
            content = content.replace(regexSimple, value);
        }
    }
    return content;
}

async function buildProject(language, selectedTypes, {addReport, relPath }) {
    const chalk     = (await import('chalk')).default;
    console.log(chalk.blue('Building project structure...'));
    const featureDictionary = featureDictionaries[language];
    const stepDictionary = stepDictionaries[language];

    if (!featureDictionary || !stepDictionary) {
        throw new Error(`Dictionaries for language "${language}" not found. Make sure i18n/features and i18n/steps files exist.`);
    }

    //vacia el directorio .build
    await fs.emptyDir(buildDir);

    // Copia la estructura base de Cypress (support, fixtures, etc.) desde la carpeta 'scaffold'
    if (fs.existsSync(scaffoldDir)) {
        // Copia el contenido de 'scaffold' para crear la estructura inicial en '.build'
        await fs.copy(scaffoldDir, buildDirCypress);
    }

    // Copia archivos de configuración externos de Cypress a la raíz de .build
    const rootFilesToCopy = [
        'webpack.config.js',
        'cypress.config.js',
        '.cypress-cucumber-preprocessorrc.json'
    ];

    for (const file of rootFilesToCopy) {
        const sourceFilePath = path.join(sourceDir, file);
        const destFilePath = path.join(buildDir, file);
        if (fs.existsSync(sourceFilePath)) {
            await fs.copy(sourceFilePath, destFilePath);
            addReport('success', 'Copied root config file', relPath(destFilePath));
        } else {
            addReport('warning', 'Missing root config file', relPath(sourceFilePath));
        }
    }

    //------------------------------------

    let allStepsContent = '';
    let allCommandsContent = ''; // Acumulador para los custom commands

    // --- Commands: Procesar y acumular (COMMON) ---
    const commonCommandsTemplatePath = path.join(templatesDir, 'support/common_commands.tpl.js'); // Asumiendo que puede existir un archivo de comandos comunes
    if (fs.existsSync(commonCommandsTemplatePath)) {
        const commandContent = await fs.readFile(commonCommandsTemplatePath, 'utf8');
        allCommandsContent += `\n// --- Common Commands (shared across modules) ---\n` + commandContent + '\n';
        addReport('success', 'Processed common commands template', relPath(commonCommandsTemplatePath));
    }

    // --- Steps: Procesar, traducir y acumular (COMMON) ---
    // Se procesa primero para que los pasos comunes estén disponibles para todos los módulos.
    const commonStepsTemplatePath = path.join(templatesDir, 'steps/common_steps.tpl.js');
    if (fs.existsSync(commonStepsTemplatePath)) {
        const templateContent = await fs.readFile(commonStepsTemplatePath, 'utf8');
        const finalContent = translateContent(templateContent, stepDictionary); // Usa el diccionario de steps
        allStepsContent += `\n// --- Common Steps (shared across modules) ---\n` + finalContent + '\n';
        addReport('success', 'Processed common steps template', relPath(commonStepsTemplatePath));
    } else {
        addReport('warning', 'Missing common steps template', relPath(commonStepsTemplatePath));
    }

    for (const type of selectedTypes) {
        const module = TEST_MODULES[type];
        if (!module) continue;

        addReport('info', 'Processing module', type);

        // --- DEMO: Procesar y copiar Features ---
        const featureDir = path.join(templatesDir, module.featureDir);
        if (fs.existsSync(featureDir)) {
            const featureFiles = await fs.readdir(featureDir);
            for (const file of featureFiles) {
                if (file.endsWith('.feature.tpl')) {
                    const templatePath = path.join(featureDir, file);
                    const templateContent = await fs.readFile(templatePath, 'utf8');
                    const finalContent = translateContent(templateContent, featureDictionary); // Usa el diccionario de features
                    const finalFileName = file.replace('.feature.tpl', '.feature');
                    const destPath = path.join(buildDir, module.destFeatureDir, finalFileName);
                    await fs.outputFile(destPath, finalContent);
                    addReport('success', 'Generated feature', relPath(destPath));
                }
            }
        }

        // --- POM: Copiar directorio completo del módulo ---
        const pomModuleDir = path.join(templatesDir, 'pom', type.toLowerCase());
        if (fs.existsSync(pomModuleDir)) {
            const destPomDir = path.join(buildDir, 'cypress/pom', type.toLowerCase());
            await fs.copy(pomModuleDir, destPomDir);
            addReport('success', 'Copied POM directory', `${relPath(pomModuleDir)} → ${relPath(destPomDir)}`);
        }

        // --- Steps: Procesar, traducir y acumular ---
        const stepsTemplatePath = path.join(templatesDir, module.stepsTemplate);
        if (fs.existsSync(stepsTemplatePath)) {
            const templateContent = await fs.readFile(stepsTemplatePath, 'utf8');
            const finalContent = translateContent(templateContent, stepDictionary); // Usa el diccionario de steps
            allStepsContent += `\n// --- Steps for ${type} ---\n` + finalContent + '\n';
            addReport('success', 'Processed steps template', relPath(stepsTemplatePath));
        }

        // --- Commands: Acumular comandos específicos del módulo (como BD) ---
        if (module.commandsTemplate) {
            const commandsTemplatePath = path.join(templatesDir, module.commandsTemplate);
            if (fs.existsSync(commandsTemplatePath)) {
                const commandContent = await fs.readFile(commandsTemplatePath, 'utf8');
                allCommandsContent += `\n// --- Commands for ${type} ---\n` + commandContent + '\n';
                addReport('success', 'Processed commands template', relPath(commandsTemplatePath));
            }
        }

        // --- Settings: Copiar archivos de configuración específicos del módulo (como db-settings.js para BD) ---
        if (type === 'BD') {
            const dbSettingsSourcePath = path.join(templatesDir, 'settings/db-settings.js');
            const dbSettingsDestPath = path.join(buildDir, 'cypress/settings/db-settings.js');
            if (fs.existsSync(dbSettingsSourcePath)) {
                await fs.copy(dbSettingsSourcePath, dbSettingsDestPath);
                addReport('success', 'Copied DB settings file', relPath(dbSettingsDestPath));
            } else {
                addReport('warning', 'Missing DB settings template', relPath(dbSettingsSourcePath));
            }
        }
    }

    // --- POM: Generar dinámicamente el archivo index.js ---
    const buildPomDir = path.join(buildDir, 'cypress/pom');
    let pomImports = '';
    let pomExports = 'module.exports = {\n';
    let exportCount = 0;

    if (fs.existsSync(buildPomDir)) {
        const pomFiles = await fs.readdir(buildPomDir, { recursive: true });
        for (const file of pomFiles) {
            if (file.endsWith('.pom.js')) {
                const fileName = path.basename(file);

                // 1. Omitir main.pom.js para evitar redundancia
                if (fileName === 'main.pom.js') {
                    continue;
                }

                // 2. Leer el archivo para extraer el nombre de la clase
                const fileContent = await fs.readFile(path.join(buildPomDir, file), 'utf8');
                const classMatch = fileContent.match(/class\s+([A-Za-z_][A-Za-z0-9_]*)/);

                // Usar el nombre de la clase si se encuentra, si no, usar el nombre del archivo como fallback
                const exportName = classMatch && classMatch[1] ? classMatch[1] : fileName.replace('.pom.js', '').replace(/[^a-zA-Z0-9_]/g, '_');

                const relativePath = path.join(path.dirname(file), path.basename(file)).replace(/\\/g, '/');

                pomImports += `const ${exportName} = require('./${relativePath}');\n`;
                pomExports += `    ${exportName},\n`;
                exportCount++;
            }
        }
    }

    pomExports += '};\n';

    const finalPomContent =
`// Cypress-Craft POM - Archivo de índice generado dinámicamente
// Total de módulos POM encontrados: ${exportCount}

${pomImports}
${pomExports}`;

    const pomIndexPath = path.join(buildPomDir, 'index.js');
    await fs.outputFile(pomIndexPath, finalPomContent);
    addReport('success', 'Generated dynamic POM index', relPath(pomIndexPath));

    // --- Steps: Generar el archivo stepDefinition.js final ---
    const stepDefTemplatePath = path.join(templatesDir, 'steps/stepDefinition.tpl.js');
    if (fs.existsSync(stepDefTemplatePath)) {
        const stepDefTemplate = await fs.readFile(stepDefTemplatePath, 'utf8');
        // Reemplaza el marcador con todos los steps acumulados
        const finalStepDefContent = stepDefTemplate.replace('// @INJECT_STEPS_HERE', allStepsContent);
        const destPath = path.join(buildDir, 'cypress/common/stepDefinition.js');
        await fs.outputFile(destPath, finalStepDefContent);
        addReport('success', 'Generated final stepDefinition.js', relPath(destPath));
    } else {
        addReport('error', 'Missing main template', relPath(stepDefTemplatePath));
    }

    // --- Commands: Generar el archivo commands.js final ---
    const commandsTemplatePath = path.join(templatesDir, 'support/commands.tpl.js'); // Un template base para commands.js
    if (fs.existsSync(commandsTemplatePath)) {
        const commandsTemplate = await fs.readFile(commandsTemplatePath, 'utf8');
        const finalCommandsContent = commandsTemplate.replace('// @INJECT_COMMANDS_HERE', allCommandsContent);
        const destPath = path.join(buildDir, 'cypress/support/commands.js');
        await fs.outputFile(destPath, finalCommandsContent);
        addReport('success', 'Generated final commands.js', relPath(destPath));
    } else {
        addReport('error', 'Missing commands template', relPath(commandsTemplatePath));
    }

    // --- Settings: Generar el archivo setupNodeEvents.js final ---
    const setupNodeEventsTemplatePath = path.join(templatesDir, 'settings/setupNodeEvents.tpl.js');
    if (fs.existsSync(setupNodeEventsTemplatePath)) {
        let setupNodeEventsTemplate = await fs.readFile(setupNodeEventsTemplatePath, 'utf8');
        let dbTaskInjection = '';
        if (selectedTypes.includes('BD')) {
            dbTaskInjection = `
  const { queryDatabase } = require('./db-settings');

  on('task', {
    queryDb: (query) => {
      return queryDatabase(query, config.env.db);
    },
  });
`;
        }
        setupNodeEventsTemplate = setupNodeEventsTemplate.replace('// @INJECT_DB_TASKS_HERE', dbTaskInjection);
        const destPath = path.join(buildDir, 'cypress/settings/setupNodeEvents.js');
        await fs.outputFile(destPath, setupNodeEventsTemplate);
        addReport('success', 'Generated final setupNodeEvents.js', relPath(destPath));
    } else {
        addReport('error', 'Missing setupNodeEvents template', relPath(setupNodeEventsTemplatePath));
    }

    console.log(chalk.green('✔ Project structure built successfully.'));
}

module.exports = { buildProject };