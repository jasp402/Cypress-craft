const { Command } = require('commander');
const fs = require('fs').promises;
const path = require('path');
const { execSync, spawn } = require('child_process');
const chalk = require('chalk');
const Table = require('cli-table3');
const inquirer = require('inquirer');
const semver = require('semver');

let openBrowser; // Renombrado para evitar conflictos y ser más explícito
try {
    const openModule = require('open');
    console.log('DEBUG: openModule type:', typeof openModule); // DEBUG
    console.log('DEBUG: openModule value:', openModule);     // DEBUG

    if (typeof openModule === 'function') {
        openBrowser = openModule;
    } else if (typeof openModule.default === 'function') {
        openBrowser = openModule.default;
    } else {
        console.error(chalk.red('Error: El módulo "open" no exportó una función invocable.'));
        openBrowser = () => console.warn('No se pudo abrir el navegador: el módulo "open" no es invocable.');
    }
} catch (e) {
    console.error(chalk.red('Error al cargar el módulo "open":'), e.message);
    openBrowser = () => console.warn('No se pudo abrir el navegador: el módulo "open" falló al cargar.');
}

const packageJson = require('./package.json');
const program = new Command();

const AVAILABLE_MANIFEST_PATH = path.join(__dirname, '..', 'cypress-craft-plugins', 'plugins-manifest.json');
console.log('Ruta del manifiesto disponible:', AVAILABLE_MANIFEST_PATH);
const INSTALLED_MANIFEST_PATH = path.join(__dirname, 'installed-plugins.json');
const NODE_MODULES_PATH = path.join(__dirname, 'node_modules');

// Cargar manifiesto (genérico)
async function loadManifest(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return { plugins: [] }; // Crear vacío si no existe
        }
        console.error(chalk.red(`Error al cargar manifiesto en ${filePath}: ${error.message}`));
        process.exit(1);
    }
}

// Guardar manifiesto
async function saveManifest(filePath, manifest) {
    await fs.writeFile(filePath, JSON.stringify(manifest, null, 2));
}

// Obtener plugins disponibles
async function getAvailablePlugins() {
    const manifest = await loadManifest(AVAILABLE_MANIFEST_PATH);
    console.log('Manifest cargado:', manifest);
    return manifest.plugins || [];
}

// Obtener plugins instalados
async function getInstalledPlugins() {
    const manifest = await loadManifest(INSTALLED_MANIFEST_PATH);
    return manifest.plugins || [];
}

// Actualizar installed manifest después de install/update
async function updateInstalledPlugin(pluginName, newVersion) {
    const installed = await loadManifest(INSTALLED_MANIFEST_PATH);
    let plugin = installed.plugins.find(p => p.name === pluginName);
    if (!plugin) {
        plugin = { name: pluginName };
        installed.plugins.push(plugin);
    }
    plugin.version = newVersion;
    plugin.updatedAt = new Date().toISOString();
    await saveManifest(INSTALLED_MANIFEST_PATH, installed);
}

// Instalar un plugin
program
    .command('install <pluginName>')
    .description('Instala un plugin de Cypress-Craft')
    .option('-l, --local', 'Instala desde el monorepo local')
    .action(async (pluginName, options) => {
        try {
            let installSpec = pluginName;
            if (options.local) {
                const pluginDir = pluginName.split('/')[1]; // e.g., 'plugin-steps'
                const localPath = path.join(__dirname, '../cypress-craft-plugins/packages', pluginDir);
                if (!(await fs.stat(localPath)).isDirectory()) {
                    throw new Error(`Directorio local no encontrado: ${localPath}`);
                }
                installSpec = localPath;
            }
            console.log(chalk.blue(`Instalando ${pluginName}...`));
            execSync(`npm install ${installSpec} --save`, { stdio: 'inherit' });

            const pluginPath = path.join(NODE_MODULES_PATH, pluginName.replace('/', path.sep), 'package.json');
            const pluginPackage = require(pluginPath);

            await updateInstalledPlugin(pluginName, pluginPackage.version);
            console.log(chalk.green(`Plugin ${pluginName} v${pluginPackage.version} instalado correctamente.`));
        } catch (error) {
            console.error(chalk.red(`Error al instalar ${pluginName}: ${error.message}`));
        }
    });

// Listar plugins
program
    .command('list')
    .description('Muestra los plugins instalados y sus detalles')
    .option('--all', 'Muestra todos los plugins (instalados, disponibles y actualizaciones)')
    .option('--json', 'Output en formato JSON')
    .action(async (options) => {
        const available = await getAvailablePlugins();
        const installed = await getInstalledPlugins();

        // Construir pluginData con todos los plugins disponibles y actualizar estados
        let pluginData = [];
        const installedMap = new Map(installed.map(p => [p.name, p]));

        available.forEach(av => {
            const inst = installedMap.get(av.name);
            let status = 'Available';
            let currentVersion = '-';
            let lastUpdated = '-';
            let updateAvailable = false;

            if (inst) {
                status = 'Installed';
                currentVersion = inst.version;
                lastUpdated = inst.updatedAt;
                if (semver.gt(av.version, inst.version)) {
                    status = 'Update Available';
                    updateAvailable = true;
                }
            }

            pluginData.push({
                name: av.name,
                status,
                currentVersion,
                availableVersion: av.version,
                lastUpdated,
                description: av.description || 'Sin descripción',
                updateAvailable
            });
        });

        // Agregar plugins instalados que no estén en disponibles (casos custom)
        installed.forEach(inst => {
            if (!available.find(av => av.name === inst.name)) {
                pluginData.push({
                    name: inst.name,
                    status: 'Installed (custom)',
                    currentVersion: inst.version,
                    availableVersion: '-',
                    lastUpdated: inst.at,
                    description: 'Sin descripción disponible',
                    updateAvailable: false
                });
            }
        });

        console.log('pluginData antes del filtro:', pluginData);

        // Filtrar solo instalados si no se usa --all (invertir lógica)
        if (!options.all) {
            pluginData = pluginData.filter(p => p.status.includes('Installed'));
        } else {
            console.log('Modo --all activado, mostrando todos los plugins.');
        }

        console.log('pluginData después del filtro:', pluginData);

        if (pluginData.length === 0) {
            console.log(chalk.yellow('No hay plugins para mostrar.'));
            return;
        }

        if (options.json) {
            console.log(JSON.stringify(pluginData, null, 2));
            return;
        }

        // Crear tabla
        const table = new Table({
            head: ['Nombre', 'Estado', 'Versión Actual', 'Versión Disponible', 'Última Actualización', 'Descripción'],
            style: { head: ['cyan'] }
        });

        pluginData.forEach(p => {
            let statusColor = p.status === 'Installed' ? chalk.green :
                p.status === 'Update Available' ? chalk.yellow :
                    chalk.blue;
            table.push([
                p.name,
                statusColor(p.status),
                p.currentVersion,
                p.availableVersion,
                p.lastUpdated,
                p.description
            ]);
        });

        console.log(table.toString());
    });

// Actualizar un plugin
program
    .command('update [pluginName]')
    .description('Actualiza un plugin específico o todos los instalados')
    .action(async (pluginName) => {
        try {
            const installed = await getInstalledPlugins();
            const toUpdate = pluginName ? [installed.find(p => p.name === pluginName)] : installed;

            if (!toUpdate.length || (pluginName && !toUpdate[0])) {
                console.log(chalk.yellow(`No se encontró el plugin ${pluginName}.`));
                return;
            }

            const confirm = await inquirer.prompt({
                type: 'confirm',
                name: 'proceed',
                message: `¿Confirmas la actualización de ${pluginName || 'todos los plugins'}?`,
                default: true
            });

            if (!confirm.proceed) {
                console.log(chalk.yellow('Actualización cancelada.'));
                return;
            }

            for (const plugin of toUpdate) {
                if (!plugin) continue;
                console.log(chalk.blue(`Actualizando ${plugin.name}...`));
                execSync(`npm install ${plugin.name}@latest --save`, { stdio: 'inherit' });

                const pluginPath = path.join(NODE_MODULES_PATH, plugin.name.replace('/', path.sep), 'package.json');
                const pluginPackage = require(pluginPath);

                await updateInstalledPlugin(plugin.name, pluginPackage.version);
                console.log(chalk.green(`Plugin ${plugin.name} actualizado a v${pluginPackage.version}.`));
            }
        } catch (error) {
            console.error(chalk.red('Error al actualizar plugins: ' + error.message));
        }
    });

// Desinstalar un plugin
program
    .command('uninstall <pluginName>')
    .description('Desinstala un plugin de Cypress-Craft')
    .action(async (pluginName) => {
        try {
            const confirm = await inquirer.prompt({
                type: 'confirm',
                name: 'proceed',
                message: `¿Estás seguro de desinstalar ${pluginName}?`,
                default: false
            });

            if (!confirm.proceed) {
                console.log(chalk.yellow('Desinstalación cancelada.'));
                return;
            }

            console.log(chalk.blue(`Desinstalando ${pluginName}...`));
            execSync(`npm uninstall ${pluginName}`, { stdio: 'inherit' });

            const installed = await loadManifest(INSTALLED_MANIFEST_PATH);
            installed.plugins = installed.plugins.filter(p => p.name !== pluginName);
            await saveManifest(INSTALLED_MANIFEST_PATH, installed);

            console.log(chalk.green(`Plugin ${pluginName} desinstalado correctamente.`));
        } catch (error) {
            console.error(chalk.red(`Error al desinstalar ${pluginName}: ${error.message}`));
        }
    });

// Nuevo comando para el PackManager
program
    .command('pluginmanager')
    .description('Inicia la interfaz de usuario del Cypress-Craft PackManager')
    .action(() => {
        const backendPath = path.join(__dirname, 'pack-manager', 'backend');
        const frontendPath = path.join(__dirname, 'pack-manager', 'frontend');
        const frontendUrl = 'http://localhost:5173'; // URL por defecto de Vite

        console.log(chalk.blue('Iniciando Cypress-Craft PackManager...'));

        // Iniciar el backend
        console.log(chalk.cyan('Iniciando el servidor backend...'));
        const backendProcess = spawn('npm', ['start'], { cwd: backendPath, stdio: 'inherit', shell: true }); // Añadido shell: true
        backendProcess.on('error', (err) => console.error(chalk.red('Error al iniciar el backend:'), err));
        backendProcess.on('exit', (code) => console.log(chalk.yellow(`Backend process exited with code ${code}`)));

        // Iniciar el frontend
        console.log(chalk.cyan('Iniciando la aplicación frontend...'));
        const frontendProcess = spawn('npm', ['run', 'dev'], { cwd: frontendPath, stdio: 'inherit', shell: true }); // Añadido shell: true
        frontendProcess.on('error', (err) => console.error(chalk.red('Error al iniciar el frontend:'), err));
        frontendProcess.on('exit', (code) => console.log(chalk.yellow(`Frontend process exited with code ${code}`)));

        // Abrir el navegador después de un breve retraso
        setTimeout(() => {
            console.log(chalk.green(`Abriendo el navegador en ${frontendUrl}`));
            openBrowser(frontendUrl); // Usar la variable renombrada
        }, 5000); // 5 segundos de retraso para dar tiempo a que el frontend se inicie
    });

// Configurar el programa
program
    .name('cypress-craft')
    .description('CLI para gestionar plugins de Cypress-Craft. Usa --help para más detalles.')
    .version(packageJson.version)
    .option('--verbose', 'Modo verbose para logs detallados');

program.parse(process.argv);