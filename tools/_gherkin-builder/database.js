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
                                                        name TEXT NOT NULL,
                                                        language TEXT DEFAULT 'es'
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

        // One-time migration to add `language` column if it didn't exist previously
        db.run("ALTER TABLE features ADD COLUMN language TEXT DEFAULT 'es'", [], (err) => {
            if (!err) {
                // Column added just now -> clean old records to avoid conflicts as requested
                db.serialize(() => {
                    db.run('DELETE FROM scenarios');
                    db.run('DELETE FROM backgrounds');
                    db.run('DELETE FROM features');
                    console.log('Migration applied: language column added and old records cleared.');
                });
            }
        });

        console.log('Tables are ready.');
    });
});

export default db;