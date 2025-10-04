import sqlite3 from 'sqlite3';

const DBSOURCE = "cypress_craft.db";

const db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        console.error(err.message);
        throw err;
    }

    console.log('Connected to the SQLite database.');

    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS features (
                                                        id TEXT PRIMARY KEY,
                                                        name TEXT NOT NULL
                )`);

        db.run(`CREATE TABLE IF NOT EXISTS backgrounds (
                                                           id TEXT PRIMARY KEY,
                                                           feature_id TEXT NOT NULL,
                                                           nodes TEXT,
                                                           FOREIGN KEY (feature_id) REFERENCES features (id) ON DELETE CASCADE
            )`);

        db.run(`CREATE TABLE IF NOT EXISTS scenarios (
                                                         id TEXT PRIMARY KEY,
                                                         feature_id TEXT NOT NULL,
                                                         text TEXT NOT NULL,
                                                         type TEXT,
                                                         isOutline INTEGER DEFAULT 0,
                                                         examples TEXT,
                                                         nodes TEXT,
                                                         edges TEXT,
                                                         idx INTEGER,
                                                         FOREIGN KEY (feature_id) REFERENCES features (id) ON DELETE CASCADE
            )`);

        console.log('Tables are ready.');
    });
});

export default db;