const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const https = require('https');
const path = require('path');
const fs = require('fs');
const { initDb } = require('./database');
const { injectCode, removeCode, setUserProjectRoot } = require('./fileManager');
const seedDatabase = require('./seedDatabase');

dotenv.config();

// Determine the user's project root for code injection
try {
  const inferredRoot = process.env.CYPRESS_CRAFT_USER_CWD || process.env.INIT_CWD || process.cwd();
  setUserProjectRoot(inferredRoot);
  console.log(`PackManager using user project root: ${inferredRoot}`);
} catch (e) {
  console.warn('Warning: could not set user project root. Falling back to process.cwd(). Reason:', e.message);
}

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve static frontend build (production) if available
const FRONTEND_DIST = path.join(__dirname, '..', '..', 'frontend', 'dist');
if (fs.existsSync(FRONTEND_DIST)) {
  app.use(express.static(FRONTEND_DIST));
  // Root path
  app.get('/', (req, res) => {
    res.sendFile(path.join(FRONTEND_DIST, 'index.html'));
  });
  // SPA fallback for non-API routes
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(FRONTEND_DIST, 'index.html'));
  });
}

// --- Funciones de Fetching (sin cambios) ---
const fetchFromGitHubRaw = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Cypress-Craft-PackManager' } }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data);
        } else {
          reject(new Error(`Failed to fetch ${url}, status: ${res.statusCode}`));
        }
      });
    }).on('error', (err) => reject(err));
  });
};

const fetchFromGitHubApi = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Cypress-Craft-PackManager' } }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error(`Failed to parse JSON from ${url}: ${e.message}`));
          }
        } else {
          reject(new Error(`Failed to fetch from GitHub API ${url}, status: ${res.statusCode}, message: ${data}`));
        }
      });
    }).on('error', (err) => reject(err));
  });
};

// --- Función Principal de Inicio ---
async function startServer() {
  try {
    const db = await initDb();
    console.log('Base de datos inicializada correctamente.');

    await seedDatabase(db, fetchFromGitHubRaw, fetchFromGitHubApi);
    console.log('Siembra de la base de datos completada.');

    // --- Endpoints de la API ---
    app.get('/api/plugins/available', (req, res) => {
      db.all('SELECT * FROM plugins_disponibles', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'success', data: rows });
      });
    });

    // New: Return code snippets for a plugin (used to display StepDefinition and POM in list view)
    app.get('/api/plugins/:plugin_id/snippets', (req, res) => {
      const { plugin_id } = req.params;
      if (!plugin_id) return res.status(400).json({ error: 'plugin_id es requerido' });
      db.all('SELECT type, target_file, content FROM code_snippets WHERE plugin_id = ?', [plugin_id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        // Normalize expected keys and filter to the two we care about
        const normalized = rows.map(r => ({
          type: r.type,
          target_file: r.target_file,
          content: r.content
        }));
        res.json({ message: 'success', data: normalized });
      });
    });

    app.get('/api/plugins/installed', (req, res) => {
      const query = `
        SELECT pi.id AS installed_id, pi.installed_version, pi.installed_at, pi.status, pd.id AS plugin_id, pd.name, pd.display_name, pd.version AS available_version, pd.description, pd.category
        FROM plugins_instalados pi
        JOIN plugins_disponibles pd ON pi.plugin_id = pd.id;
      `;
      db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'success', data: rows });
      });
    });

    app.post('/api/plugins/install', async (req, res) => {
        const { plugin_id } = req.body;
        if (!plugin_id) return res.status(400).json({ error: 'plugin_id es requerido' });

        try {
            const existing = await new Promise((resolve, reject) => db.get('SELECT * FROM plugins_instalados WHERE plugin_id = ?', [plugin_id], (err, row) => err ? reject(err) : resolve(row)));
            if (existing) return res.status(409).json({ error: 'Plugin ya está instalado' });

            const plugin = await new Promise((resolve, reject) => db.get('SELECT * FROM plugins_disponibles WHERE id = ?', [plugin_id], (err, row) => err ? reject(err) : resolve(row)));
            if (!plugin) return res.status(404).json({ error: 'Plugin no encontrado' });

            const snippets = await new Promise((resolve, reject) => db.all('SELECT * FROM code_snippets WHERE plugin_id = ?', [plugin_id], (err, rows) => err ? reject(err) : resolve(rows)));
            if (!snippets || snippets.length === 0) return res.status(404).json({ error: 'No se encontraron snippets para este plugin' });

            for (const snippet of snippets) {
                let contentToInject = snippet.content;
                if (snippet.type === 'pom_function') {
                    contentToInject = contentToInject.replace(/^\s*function\s*/, '');
                }
                const result = await injectCode(snippet.target_file, snippet.marker_start_id, snippet.marker_end_id, contentToInject);
                if (!result.success) throw new Error(result.message);
            }

            await new Promise((resolve, reject) => db.run('INSERT INTO plugins_instalados (plugin_id, installed_version, installed_at, status) VALUES (?, ?, ?, ?)', [plugin_id, plugin.version, new Date().toISOString(), 'installed'], (err) => err ? reject(err) : resolve()));

            res.status(200).json({ message: `Plugin ${plugin.name} instalado.` });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    
    app.post('/api/plugins/update', async (req, res) => {
        const { plugin_id } = req.body;
        if (!plugin_id) return res.status(400).json({ error: 'plugin_id es requerido' });

        try {
            const plugin = await new Promise((resolve, reject) => db.get('SELECT * FROM plugins_disponibles WHERE id = ?', [plugin_id], (err, row) => err ? reject(err) : resolve(row)));
            if (!plugin) return res.status(404).json({ error: 'Plugin no encontrado' });

            const snippets = await new Promise((resolve, reject) => db.all('SELECT * FROM code_snippets WHERE plugin_id = ?', [plugin_id], (err, rows) => err ? reject(err) : resolve(rows)));
            if (!snippets || snippets.length === 0) return res.status(404).json({ error: 'No se encontraron snippets para este plugin' });

            for (const snippet of snippets) {
                let contentToInject = snippet.content;
                if (snippet.type === 'pom_function') {
                    contentToInject = contentToInject.replace(/^\s*function\s*/, '');
                }
                const result = await injectCode(snippet.target_file, snippet.marker_start_id, snippet.marker_end_id, contentToInject);
                if (!result.success) throw new Error(result.message);
            }

            await new Promise((resolve, reject) => db.run('UPDATE plugins_instalados SET installed_version = ?, status = ? WHERE plugin_id = ?', [plugin.version, 'installed', plugin_id], (err) => err ? reject(err) : resolve()));

            res.status(200).json({ message: `Plugin ${plugin.name} actualizado.` });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    app.delete('/api/plugins/uninstall/:plugin_id', async (req, res) => {
        const { plugin_id } = req.params;
        if (!plugin_id) return res.status(400).json({ error: 'plugin_id es requerido' });

        try {
            const snippets = await new Promise((resolve, reject) => db.all('SELECT * FROM code_snippets WHERE plugin_id = ?', [plugin_id], (err, rows) => err ? reject(err) : resolve(rows)));
            
            for (const snippet of snippets) {
                await removeCode(snippet.target_file, snippet.marker_start_id, snippet.marker_end_id);
            }

            await new Promise((resolve, reject) => db.run('DELETE FROM plugins_instalados WHERE plugin_id = ?', [plugin_id], (err) => err ? reject(err) : resolve()));

            res.status(200).json({ message: `Plugin desinstalado.` });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    app.post('/api/plugins/refresh', async (req, res) => {
      console.log('Iniciando actualización de la lista de plugins disponibles...');
      try {
        await seedDatabase(db, fetchFromGitHubRaw, fetchFromGitHubApi);
        console.log('Actualización de la base de datos completada.');
        res.status(200).json({ message: 'Plugin list refreshed successfully.' });
      } catch (error) {
        console.error('Error al refrescar la lista de plugins:', error);
        res.status(500).json({ error: 'Failed to refresh plugin list.', details: error.message });
      }
    });

    // Iniciar el servidor
    app.listen(PORT, () => {
      console.log(`Backend server listo y escuchando en el puerto ${PORT}`);
    });

  } catch (error) {
    console.error('No se pudo iniciar el servidor:', error);
    process.exit(1);
  }
}

startServer();
