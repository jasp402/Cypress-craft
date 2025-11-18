/**
 * CypressCraft CLI Splash Screen
 * Diseño inspirado en Claude Code
 */

const CYPRESS_ASCII = `
    ▄▄▄▄
   ██████
  ████████
   ██████
    ▄▄▄▄
`;

const VERSION = 'v1.0.0';

async function showSplashScreen(username = 'Usuario') {
    const chalk = (await import('chalk')).default;
    const boxen = (await import('boxen')).default;

    console.clear();

    // Título principal con la versión
    const titleLine = `CypressCraft ${VERSION}`;

    // Mensaje de bienvenida
    const welcomeMsg = chalk.white.bold(`Welcome back ${username}!`);

    // Logo de Cypress (en verde ciprés)
    const logo = chalk.green(CYPRESS_ASCII);

    // Información de la versión
    const versionInfo = chalk.gray(`Sonnet 4.5 • Cypress Max`);

    // Ruta actual
    const currentPath = chalk.gray(process.cwd() + ' |');

    // Tips section
    const tipsTitle = chalk.hex('#FF6B35')('Tips for getting started');
    const tips = [
        chalk.gray('Run ') + chalk.white('/init') + chalk.gray(' to create a CYPRESS.md file with instructions for CypressCraft'),
        chalk.gray('Use CypressCraft to help with test automation, E2E testing, and component testing'),
        chalk.gray('Be as specific as you would with another QA engineer for the best results')
    ];

    // Recent activity section
    const activityTitle = chalk.hex('#FF6B35')('Recent activity');
    const activityMsg = chalk.gray('No recent activity');

    // Construir el contenido del panel derecho
    const rightPanel = [
        tipsTitle,
        ...tips.map(tip => tip),
        '',
        activityTitle,
        activityMsg
    ].join('\n');

    // Construir el panel completo
    const content = `
${welcomeMsg}

${logo}

${versionInfo}
${currentPath}

${rightPanel}
`;

    // Crear el box con estilo retro
    const box = boxen(content, {
        title: titleLine,
        titleAlignment: 'left',
        padding: 1,
        margin: 0,
        borderStyle: 'classic',
        borderColor: 'gray'
    });

    console.log(box);
    console.log('');
}

// Función para mostrar un splash más simple si boxen no está disponible
async function showSimpleSplash(username = 'Usuario') {
    const chalk = (await import('chalk')).default;

    console.clear();
    console.log(chalk.gray('╔════════════════════════════════════════════════════════════════════════════════╗'));
    console.log(chalk.gray('║') + ' ' + chalk.gray(`CypressCraft ${VERSION}`.padEnd(78)) + chalk.gray('║'));
    console.log(chalk.gray('╠════════════════════════════════════════════════════════════════════════════════╣'));
    console.log(chalk.gray('║') + '                                                                                ' + chalk.gray('║'));
    console.log(chalk.gray('║') + '     ' + chalk.white.bold(`Welcome back ${username}!`.padEnd(73)) + chalk.gray('║'));
    console.log(chalk.gray('║') + '                                                                                ' + chalk.gray('║'));
    console.log(chalk.gray('║') + '         ' + chalk.green('▄▄▄▄').padEnd(71) + chalk.gray('║'));
    console.log(chalk.gray('║') + '        ' + chalk.green('██████').padEnd(71) + chalk.gray('║'));
    console.log(chalk.gray('║') + '       ' + chalk.green('████████').padEnd(71) + chalk.gray('║'));
    console.log(chalk.gray('║') + '        ' + chalk.green('██████').padEnd(71) + chalk.gray('║'));
    console.log(chalk.gray('║') + '         ' + chalk.green('▄▄▄▄').padEnd(71) + chalk.gray('║'));
    console.log(chalk.gray('║') + '                                                                                ' + chalk.gray('║'));
    console.log(chalk.gray('║') + '     ' + chalk.gray('Sonnet 4.5 • Cypress Max'.padEnd(73)) + chalk.gray('║'));
    console.log(chalk.gray('║') + '     ' + chalk.gray((process.cwd() + ' |').padEnd(73)) + chalk.gray('║'));
    console.log(chalk.gray('║') + '                                                                                ' + chalk.gray('║'));
    console.log(chalk.gray('╠════════════════════════════════════════════════════════════════════════════════╣'));
    console.log(chalk.gray('║') + ' ' + chalk.hex('#FF6B35')('Tips for getting started'.padEnd(78)) + chalk.gray('║'));
    console.log(chalk.gray('║') + ' ' + chalk.gray('Run ') + chalk.white('/init') + chalk.gray(' to create a CYPRESS.md file with instructions'.padEnd(64)) + chalk.gray('║'));
    console.log(chalk.gray('║') + ' ' + chalk.gray('Use CypressCraft to help with test automation and E2E testing'.padEnd(78)) + chalk.gray('║'));
    console.log(chalk.gray('║') + ' ' + chalk.gray('Be as specific as you would with another QA engineer'.padEnd(78)) + chalk.gray('║'));
    console.log(chalk.gray('║') + '                                                                                ' + chalk.gray('║'));
    console.log(chalk.gray('║') + ' ' + chalk.hex('#FF6B35')('Recent activity'.padEnd(78)) + chalk.gray('║'));
    console.log(chalk.gray('║') + ' ' + chalk.gray('No recent activity'.padEnd(78)) + chalk.gray('║'));
    console.log(chalk.gray('╚════════════════════════════════════════════════════════════════════════════════╝'));
    console.log('');
}

// Exportar ambas funciones
module.exports = {
    showSplashScreen,
    showSimpleSplash
};

// Si se ejecuta directamente
if (require.main === module) {
    // Intenta usar la versión con boxen, si no está disponible usa la simple
    (async () => {
        try {
            await showSplashScreen('Fabian');
        } catch (error) {
            await showSimpleSplash('Fabian');
        }
    })();
}