import express from 'express';
import cors from 'cors';
import db from './database.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

// Serve static frontend build (production) if available (vite outputs to ./dist)
const FRONTEND_DIST = path.join(__dirname, 'dist');
if (fs.existsSync(FRONTEND_DIST)) {
    app.use(express.static(FRONTEND_DIST));
    app.get('/', (req, res) => {
        res.sendFile(path.join(FRONTEND_DIST, 'index.html'));
    });
    // SPA fallback for non-API routes
    app.get(/^(?!\/api).*/, (req, res) => {
        res.sendFile(path.join(FRONTEND_DIST, 'index.html'));
    });
}

// --- FEATURES ---
app.get('/api/features', (req, res) => {
    db.serialize(() => {
        const features = {};
        db.all("SELECT * FROM features ORDER BY name", [], (err, rows) => {
            if (err) { return res.status(400).json({ "error": err.message }); }
            rows.forEach(row => features[row.id] = { ...row, scenarios: [], background: null });
        });

        db.all("SELECT * FROM backgrounds", [], (err, rows) => {
            if (err) { return res.status(400).json({ "error": err.message }); }
            rows.forEach(row => {
                if (features[row.feature_id]) {
                    features[row.feature_id].background = { ...row, nodes: JSON.parse(row.nodes || '[]') };
                }
            });
        });

        db.all("SELECT * FROM scenarios ORDER BY idx", [], (err, rows) => {
            if (err) { return res.status(400).json({ "error": err.message }); }
            rows.forEach(row => {
                if (features[row.feature_id]) {
                    features[row.feature_id].scenarios.push({
                        ...row,
                        isOutline: row.isOutline === 1,
                        nodes: JSON.parse(row.nodes || '[]'),
                        edges: JSON.parse(row.edges || '[]'),
                    });
                }
            });
            res.json(Object.values(features));
        });
    });
});

app.post('/api/features', (req, res) => {
    const { id, name } = req.body;
    db.run('INSERT INTO features (id, name) VALUES (?,?)', [id, name], function (err) {
        if (err) { return res.status(400).json({ "error": err.message }); }
        const backgroundId = `bg_${id}`;
        db.run('INSERT INTO backgrounds (id, feature_id, nodes) VALUES (?, ?, ?)', [backgroundId, id, '[]'], (bgErr) => {
            if (bgErr) { return res.status(400).json({ "error": bgErr.message }); }
            res.json({ id, name, scenarios: [], background: { id: backgroundId, feature_id: id, nodes: [] } });
        });
    });
});

app.delete('/api/features/:id', (req, res) => {
    db.run('DELETE FROM features WHERE id = ?', [req.params.id], function(err) {
        if (err) { return res.status(400).json({ "error": err.message }); }
        res.json({ message: "Feature deleted" });
    });
});

app.put('/api/features/:id/reorder', (req, res) => {
    const { scenarios } = req.body;
    db.serialize(() => {
        scenarios.forEach((scenarioId, index) => {
            db.run('UPDATE scenarios SET idx = ? WHERE id = ?', [index, scenarioId]);
        });
        res.json({ message: 'Scenarios reordered' });
    });
});


// --- BACKGROUND ---
app.put('/api/features/:featureId/background', (req, res) => {
    const { featureId } = req.params;
    const { nodes } = req.body;
    const nodesJson = JSON.stringify(nodes || '[]');
    db.run('INSERT OR REPLACE INTO backgrounds (id, feature_id, nodes) VALUES (?, ?, ?)',
        [`bg_${featureId}`, featureId, nodesJson], function(err) {
            if (err) { return res.status(400).json({ "error": err.message }); }
            res.json({ message: 'Background updated' });
        });
});


// --- SCENARIOS ---
app.post('/api/features/:featureId/scenarios', (req, res) => {
    const { featureId } = req.params;
    const { id, text, type, isOutline, examples, idx } = req.body;
    const sql = 'INSERT INTO scenarios (id, feature_id, text, type, isOutline, examples, nodes, edges, idx) VALUES (?,?,?,?,?,?,?,?,?)';
    db.run(sql, [id, featureId, text, type, isOutline ? 1 : 0, examples, '[]', '[]', idx], function(err) {
        if (err) { return res.status(400).json({ "error": err.message }); }
        res.json({ id, text, type, isOutline, examples, nodes: [], edges: [], idx });
    });
});

app.put('/api/scenarios/:id', (req, res) => {
    const { text, type, isOutline, examples } = req.body;
    const sql = 'UPDATE scenarios SET text = ?, type = ?, isOutline = ?, examples = ? WHERE id = ?';
    db.run(sql, [text, type, isOutline ? 1 : 0, examples, req.params.id], function(err) {
        if (err) { return res.status(400).json({ "error": err.message }); }
        res.json({ message: 'Scenario updated' });
    });
});

app.put('/api/scenarios/:id/nodes', (req, res) => {
    const { nodes } = req.body;
    const nodesJson = JSON.stringify(nodes || '[]');
    db.run('UPDATE scenarios SET nodes = ? WHERE id = ?', [nodesJson, req.params.id], function(err) {
        if (err) { return res.status(400).json({ "error": err.message }); }
        res.json({ message: 'Scenario steps updated' });
    });
});

app.delete('/api/scenarios/:id', (req, res) => {
    db.run('DELETE FROM scenarios WHERE id = ?', [req.params.id], function(err) {
        if (err) { return res.status(400).json({ "error": err.message }); }
        res.json({ message: 'Scenario deleted' });
    });
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
