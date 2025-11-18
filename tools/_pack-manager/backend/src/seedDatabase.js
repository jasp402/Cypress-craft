const semver = require('semver');

const GITHUB_USER = 'jasp402';
const GITHUB_REPO = 'cypress-craft-plugins';
const GITHUB_BRANCH = 'master';
const GITHUB_API_BASE_URL = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/packages`;
const GITHUB_RAW_BASE_URL = `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/${GITHUB_BRANCH}/packages`;

const seedDatabase = async (db, fetchFromGitHubRaw, fetchFromGitHubApi) => {
    const dbRun = (sql, params = []) => new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err); else resolve(this);
        });
    });
    const dbGet = (sql, params = []) => new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err); else resolve(row);
        });
    });

    try {
        const packagesContent = await fetchFromGitHubApi(GITHUB_API_BASE_URL);
        const pluginDirs = packagesContent.filter(item => item.type === 'dir');

        if (pluginDirs.length === 0) {
            console.warn('No se encontraron directorios de plugins en el repositorio de GitHub.');
            return;
        }

        for (const pluginDir of pluginDirs) {
            const pluginPath = pluginDir.name;
            const manifestUrl = `${GITHUB_RAW_BASE_URL}/${pluginPath}/plugin-manifest.json`;

            try {
                const manifestContent = await fetchFromGitHubRaw(manifestUrl);
                const manifest = JSON.parse(manifestContent);

                // CORRECCIÓN: Sobrescribir el target_file si es el plugin afectado
                if (manifest.name === '@cypress-craft/plugin-wait-steps') {
                    const stepDefSnippet = manifest.snippets.find(s => s.type === 'step_definition');
                    if (stepDefSnippet) {
                        stepDefSnippet.target_file = 'cypress/common/stepDefinition.js';
                    }
                }

                let existingPlugin = await dbGet('SELECT id, version FROM plugins_disponibles WHERE name = ?', [manifest.name]);
                let pluginId;

                if (existingPlugin) {
                    pluginId = existingPlugin.id;
                    if (semver.gt(manifest.version, existingPlugin.version)) {
                        await dbRun(
                            'UPDATE plugins_disponibles SET display_name = ?, version = ?, description = ?, category = ?, last_updated_monorepo = ? WHERE id = ?',
                            [manifest.displayName, manifest.version, manifest.description, manifest.category || 'Other', new Date().toISOString(), pluginId]
                        );
                        console.log(`Plugin ${manifest.name} actualizado a la versión ${manifest.version}.`);
                    }
                } else {
                    const result = await dbRun(
                        'INSERT INTO plugins_disponibles (name, display_name, version, description, category, last_updated_monorepo, code_snippets_path) VALUES (?, ?, ?, ?, ?, ?, ?)',
                        [manifest.name, manifest.displayName, manifest.version, manifest.description, manifest.category || 'Other', new Date().toISOString(), pluginPath]
                    );
                    pluginId = result.lastID;
                    console.log(`Plugin ${manifest.name} insertado con ID: ${pluginId}.`);
                }

                for (const snippet of manifest.snippets) {
                    const snippetContentUrl = `${GITHUB_RAW_BASE_URL}/${pluginPath}/${snippet.path}`;
                    const snippetCode = await fetchFromGitHubRaw(snippetContentUrl);
                    const existingSnippet = await dbGet('SELECT id FROM code_snippets WHERE plugin_id = ? AND marker_start_id = ?', [pluginId, snippet.marker_start_id]);

                    if (existingSnippet) {
                        await dbRun('UPDATE code_snippets SET content = ?, target_file = ? WHERE id = ?', [snippetCode, snippet.target_file, existingSnippet.id]);
                    } else {
                        await dbRun(
                            'INSERT INTO code_snippets (plugin_id, type, target_file, marker_start_id, marker_end_id, content) VALUES (?, ?, ?, ?, ?, ?)',
                            [pluginId, snippet.type, snippet.target_file, snippet.marker_start_id, snippet.marker_end_id, snippetCode]
                        );
                    }
                }
            } catch (error) {
                if (error.message.includes('404')) {
                    console.warn(`ADVERTENCIA: No se encontró manifest.json para '${pluginPath}'. Saltando este plugin.`);
                } else {
                    console.error(`Error al procesar el plugin ${pluginPath}:`, error.message);
                }
            }
        }
    } catch (error) {
        console.error('Error CRÍTICO al obtener la lista de plugins del repositorio de GitHub:', error.message);
    }
};

module.exports = seedDatabase;
