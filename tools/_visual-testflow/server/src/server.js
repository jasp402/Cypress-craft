import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import cypress from 'cypress';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

app.use(cors());
app.use(express.json());

// --- Gherkin & File System Logic (existing code) ---
const getGherkinKeywords = (lang) => {
  const keywords = {
    en: { feature: 'Feature', scenario: 'Scenario', outline: 'Scenario Outline', steps: ['Given', 'When', 'Then', 'And', 'But'] },
    es: { feature: 'Característica', scenario: 'Escenario', outline: 'Esquema del escenario', steps: ['Dado', 'Cuando', 'Entonces', 'Y', 'Pero'] },
  };
  return keywords[lang] || keywords['en'];
};

const parseFeatureFile = (data) => {
  const langRegex = /^#\s*language:\s*(\w+)/m;
  const langMatch = data.match(langRegex);
  const lang = langMatch ? langMatch[1] : 'en';
  const keywords = getGherkinKeywords(lang);
  const scenarioTypes = [keywords.scenario, keywords.outline];
  const scenarioRegex = new RegExp(`^\\s*(?:${scenarioTypes.join('|')}):\\s*(.*)$`, 'm');
  const stepRegex = new RegExp(`^\\s*(?:${keywords.steps.join('|')})\\s+(.*)$`);
  const examplesRegex = /^\s*Examples:/m;
  const lines = data.split('\n');
  let scenarios = {};
  let currentScenario = null;
  let parsingExamples = false;
  for (const line of lines) {
    const scenarioMatch = line.match(scenarioRegex);
    if (scenarioMatch) {
      currentScenario = scenarioMatch[1].trim();
      scenarios[currentScenario] = { type: line.includes(keywords.outline) ? keywords.outline : keywords.scenario, steps: [], examplesCount: 0 };
      parsingExamples = false;
      continue;
    }
    if (currentScenario) {
      const stepMatch = line.match(stepRegex);
      if (stepMatch) {
        const keyword = line.trim().split(' ')[0];
        scenarios[currentScenario].steps.push({ keyword, text: stepMatch[1].trim() });
        parsingExamples = false;
      }
      if (line.match(examplesRegex)) {
        parsingExamples = true;
        continue;
      }
      if (parsingExamples && line.trim().startsWith('|')) {
        if (scenarios[currentScenario].examplesCount > 0) {
          scenarios[currentScenario].examplesCount++;
        } else {
          scenarios[currentScenario].examplesCount = 1;
        }
      }
    }
  }
  Object.values(scenarios).forEach(s => { if (s.examplesCount > 0) s.examplesCount--; });
  return { scenarios, lang };
};

const extractScenarioBlock = (featureContent, targetScenarioName) => {
  const langRegex = /^#\s*language:\s*(\w+)/m;
  const langMatch = featureContent.match(langRegex);
  const lang = langMatch ? langMatch[1] : 'en';
  const keywords = getGherkinKeywords(lang);
  const scenarioTypes = [keywords.scenario, keywords.outline];
  const featureKeyword = keywords.feature;
  const lines = featureContent.split('\n');
  let inTargetScenario = false;
  let scenarioBlock = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    const isScenarioStart = scenarioTypes.some(type => trimmedLine.startsWith(`${type}:`));
    const currentScenarioName = isScenarioStart ? trimmedLine.substring(trimmedLine.indexOf(':') + 1).trim() : null;
    if (isScenarioStart && currentScenarioName === targetScenarioName) {
      inTargetScenario = true;
      scenarioBlock.push(line);
      continue;
    }
    if (inTargetScenario) {
      if (isScenarioStart || trimmedLine.startsWith(`${featureKeyword}:`)) {
        inTargetScenario = false;
        break;
      }
      scenarioBlock.push(line);
    }
  }
  return scenarioBlock.join('\n');
};

const findFeatureFiles = (startPath, filter, basePath) => {
  let results = [];
  try {
    if (!fs.existsSync(startPath)) return [];
    const files = fs.readdirSync(startPath);
    for (const file of files) {
      const filename = path.join(startPath, file);
      const stat = fs.lstatSync(filename);
      if (stat.isDirectory()) {
        results = results.concat(findFeatureFiles(filename, filter, basePath));
      } else if (filename.endsWith(filter)) {
        const relativePath = path.relative(basePath, filename);
        results.push(relativePath.replace(/\\/g, '/'));
      }
    }
  } catch (error) {
    console.error("Error finding feature files:", error);
  }
  return results;
};

const buildFileTree = (paths) => {
  const tree = {};
  for (const p of paths) {
    let current = tree;
    p.split('/').forEach((part, i, arr) => {
      const isFile = i === arr.length - 1;
      if (!current[part]) {
        current[part] = isFile ? { _path: p } : {};
      }
      current = current[part];
    });
  }
  const convert = (node, name) => {
    if (node._path) return { name, path: node._path, isDirectory: false };
    const children = Object.keys(node).map(key => convert(node[key], key));
    children.sort((a, b) => (a.isDirectory === b.isDirectory) ? a.name.localeCompare(b.name) : a.isDirectory ? -1 : 1);
    return { name, isDirectory: true, children };
  };
  const result = Object.keys(tree).map(key => convert(tree[key], key));
  result.sort((a, b) => (a.isDirectory === b.isDirectory) ? a.name.localeCompare(b.name) : a.isDirectory ? -1 : 1);
  return result;
};

const topologicalSort = (nodes, edges) => {
  const graph = new Map();
  const inDegree = new Map();
  nodes.forEach(node => {
    graph.set(node.id, []);
    inDegree.set(node.id, 0);
  });
  edges.forEach(edge => {
    if (graph.has(edge.source) && graph.has(edge.target)) {
      graph.get(edge.source).push(edge.target);
      inDegree.set(edge.target, inDegree.get(edge.target) + 1);
    }
  });
  const queue = nodes.filter(node => inDegree.get(node.id) === 0).map(node => node.id);
  const sorted = [];
  while (queue.length > 0) {
    const nodeId = queue.shift();
    sorted.push(nodeId);
    graph.get(nodeId)?.forEach(neighborId => {
      inDegree.set(neighborId, inDegree.get(neighborId) - 1);
      if (inDegree.get(neighborId) === 0) queue.push(neighborId);
    });
  }
  if (sorted.length !== nodes.length) console.warn("Cycle detected in workflow.");
  return sorted;
};

// --- Endpoints ---
app.get('/', (req, res) => res.send('Visual Testflow Server is running!'));

app.get('/api/features', (req, res) => {
  const basePath = path.resolve(__dirname, '../../../../cypress/test');
  const featureFiles = findFeatureFiles(basePath, '.feature', basePath);
  const fileTree = buildFileTree(featureFiles);
  res.json(fileTree);
});

app.post('/api/scenarios', (req, res) => {
  const { featurePath } = req.body;
  if (!featurePath) return res.status(400).json({ error: 'featurePath is required' });
  const absolutePath = path.resolve(__dirname, '../../../../cypress/test', featurePath);
  fs.readFile(absolutePath, 'utf8', (err, data) => {
    if (err) return res.status(404).json({ error: 'File not found' });
    const langRegex = /^#\s*language:\s*(\w+)/m;
    const langMatch = data.match(langRegex);
    const lang = langMatch ? langMatch[1] : 'en';
    const keywords = getGherkinKeywords(lang);
    const scenarioKeywords = [keywords.scenario, keywords.outline];
    const scenarioRegex = new RegExp(`^\\s*(?:${scenarioKeywords.join('|')}):\\s*(.*)\\s*$`, 'gm');
    const scenarios = [];
    let match;
    while ((match = scenarioRegex.exec(data)) !== null) {
      scenarios.push(match[1]);
    }
    res.json({ scenarios, language: lang });
  });
});

app.post('/api/scenario-details', (req, res) => {
  const { featurePath, scenarioName } = req.body;
  if (!featurePath || !scenarioName) return res.status(400).json({ error: 'featurePath and scenarioName are required' });
  const absolutePath = path.resolve(__dirname, '../../../../cypress/test', featurePath);
  fs.readFile(absolutePath, 'utf8', (err, data) => {
    if (err) return res.status(404).json({ error: 'File not found' });
    const { scenarios, lang } = parseFeatureFile(data);
    const details = scenarios[scenarioName];
    if (details) {
      res.json({ ...details, language: lang });
    } else {
      res.status(404).json({ error: `Scenario '${scenarioName}' not found in file.` });
    }
  });
});

app.post('/api/workflow-status', (req, res) => {
  const { scenarioName, status } = req.body;
  io.emit('status-update', { scenarioName, status });
  res.status(200).send({ message: 'Status received' });
});

app.post('/api/run-workflow', async (req, res) => {
  const { nodes, edges } = req.body;
  if (!nodes || !edges) return res.status(400).json({ error: 'Nodes and edges are required.' });
  const sortedNodeIds = topologicalSort(nodes, edges).filter(id => id !== 'start-1');
  const executableNodes = sortedNodeIds.map(id => nodes.find(n => n.id === id)).filter(Boolean);
  if (executableNodes.length === 0) return res.status(400).json({ message: 'No executable nodes found.' });
  let compiledFeatureContent = `Feature: Dynamic Workflow from Visual Testflow\n\n`;
  const tempFeatureFilePath = path.resolve(__dirname, '../../../../cypress/test/temp-workflow.feature');
  try {
    for (const node of executableNodes) {
      if (node.type === 'scenario' && node.data.featurePath && node.data.scenarioName) {
        const originalFeatureAbsolutePath = path.resolve(__dirname, '../../../../cypress/test', node.data.featurePath);
        const originalFeatureContent = fs.readFileSync(originalFeatureAbsolutePath, 'utf8');
        const scenarioBlock = extractScenarioBlock(originalFeatureContent, node.data.scenarioName);
        if (scenarioBlock) {
          compiledFeatureContent += scenarioBlock + '\n\n';
        } else {
          console.warn(`Scenario '${node.data.scenarioName}' not found. Skipping.`);
        }
      }
    }
    fs.writeFileSync(tempFeatureFilePath, compiledFeatureContent);
    
    // Define the project root, which is 4 levels above server/src
    const projectRoot = path.resolve(__dirname, '../../../../');

    // Non-blocking execution with the correct project path
    cypress.run({ 
      project: projectRoot,
      spec: tempFeatureFilePath 
    });

    res.status(202).json({ message: 'Workflow execution started.' });
  } catch (error) {
    console.error('Error during workflow compilation:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 4001;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
