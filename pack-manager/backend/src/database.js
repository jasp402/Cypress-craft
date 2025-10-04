const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '..' , 'data', 'packmanager.db');

const dbDir = path.join(__dirname, '..' , 'data');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const initDb = () => {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Error al abrir la base de datos', err.message);
        return reject(err);
      }
      console.log('Conectado a la base de datos SQLite.');

      db.serialize(() => {
        db.run(`
            CREATE TABLE IF NOT EXISTS plugins_disponibles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE,
                display_name TEXT NOT NULL,
                version TEXT NOT NULL,
                description TEXT,
                category TEXT, -- Columna añadida
                last_updated_monorepo TEXT,
                code_snippets_path TEXT
            );
        `);
        db.run(`
            CREATE TABLE IF NOT EXISTS plugins_instalados (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                plugin_id INTEGER NOT NULL,
                installed_version TEXT NOT NULL,
                installed_at TEXT NOT NULL,
                status TEXT NOT NULL,
                FOREIGN KEY (plugin_id) REFERENCES plugins_disponibles(id)
            );
        `);
        db.run(`
            CREATE TABLE IF NOT EXISTS code_snippets (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                plugin_id INTEGER NOT NULL,
                type TEXT NOT NULL,
                target_file TEXT NOT NULL,
                marker_start_id TEXT NOT NULL,
                marker_end_id TEXT NOT NULL,
                content TEXT NOT NULL,
                FOREIGN KEY (plugin_id) REFERENCES plugins_disponibles(id)
            );
        `, (err) => {
            if (err) {
                console.error('Error al crear tablas:', err.message);
                return reject(err);
            }
            console.log('Tablas creadas o ya existentes.');
            resolve(db);
        });
      });
    });
  });
};

module.exports = { initDb };
