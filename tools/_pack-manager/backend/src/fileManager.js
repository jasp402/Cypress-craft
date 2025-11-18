const fs = require('fs').promises;
const path = require('path');

// Dynamic user project root (configurable). If not set, determine a safe default.
let userProjectRoot = null;
function setUserProjectRoot(basePath) {
  if (!basePath || typeof basePath !== 'string') {
    throw new Error('Invalid userProjectRoot');
  }
  userProjectRoot = path.resolve(basePath);
}

function getDefaultUserRoot() {
  // Simplified per user request: always use the process working directory
  // which should be the user's project root when PackManager is launched there.
  return process.cwd();
}

function resolveTargetPath(targetFilePath) {
  // Absolute paths are respected as-is
  if (path.isAbsolute(targetFilePath)) return targetFilePath;
  // If a userProjectRoot was explicitly set (via UI/CLI), prefer it
  if (userProjectRoot) return path.join(userProjectRoot, targetFilePath);
  // Fallback: process.cwd() as default user root
  return path.join(getDefaultUserRoot(), targetFilePath);
}

// Normalize snippet functions for class injection: convert
//   function name(...) { ... }  ->  name(...) { ... }
//   async function name(...) { ... }  ->  async name(...) { ... }
function normalizeSnippetForClass(snippet) {
  const lines = snippet.split(/\r?\n/);
  const re = /^(\s*)(async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(/;
  return lines
    .map(line => line.replace(re, (_, indent, asyncKw = '', name) => `${indent}${asyncKw || ''}${name}(`))
    .join('\n');
}

// Lightweight reporter (similar look & icons as post-install)
const symbols = { success: '✔', info: 'ℹ', warning: '⚠', error: '✖' };
function printReport(rows, title = 'PackManager summary') {
  if (!rows || rows.length === 0) return;
  console.log(`\n${title}:`);
  for (const r of rows) {
    const icon = symbols[r.level] || '•';
    const action = `${icon} ${r.action}`;
    if (r.detail) {
      console.log(`  - ${action}: ${r.detail}`);
    } else {
      console.log(`  - ${action}`);
    }
  }
}

async function injectCode(targetFilePath, markerStart, markerEnd, codeContent) {
  const rows = [];
  const add = (level, action, detail) => rows.push({ level, action, detail });
  const absoluteTargetFilePath = resolveTargetPath(targetFilePath);

  try {
    let fileContent = '';
    try {
      fileContent = await fs.readFile(absoluteTargetFilePath, 'utf8');
      add('info', 'Target', absoluteTargetFilePath);
    } catch (error) {
      if (error.code === 'ENOENT') {
        add('warning', 'Missing file', absoluteTargetFilePath);
        await fs.mkdir(path.dirname(absoluteTargetFilePath), { recursive: true });
        if (targetFilePath.includes('pom.js')) {
          fileContent = 'module.exports = class Main {\n\n}';
          add('info', 'Created scaffold', 'main.pom.js class shell');
        } else {
          fileContent = '';
          add('info', 'Created file', absoluteTargetFilePath);
        }
      } else {
        throw error;
      }
    }

    const startMarker = `// ${markerStart}`;
    const endMarker = `// ${markerEnd}`;

    // Preserve EOL style of target file
    const hasCRLF = /\r\n/.test(fileContent);
    const EOL = hasCRLF ? '\r\n' : '\n';

    const processedCode = targetFilePath.includes('pom.js') ? normalizeSnippetForClass(codeContent) : codeContent;
    const indentedCode = processedCode.split(/\r?\n/).map(line => `    ${line}`).join(EOL);
    const newCodeBlock = `${EOL}    ${startMarker}${EOL}${indentedCode}${EOL}    ${endMarker}`;

    if (fileContent.includes(startMarker)) {
      const startIndex = fileContent.indexOf(startMarker);
      const endIndex = fileContent.indexOf(endMarker, startIndex);
      if (endIndex === -1) {
        add('error', 'End marker not found', endMarker);
        printReport(rows);
        return { success: false, message: `Closing marker not found (${endMarker}) in ${targetFilePath}` };
      }
      const afterEnd = endIndex + endMarker.length;
      const before = fileContent.substring(0, fileContent.lastIndexOf(EOL, startIndex) + 1 || 0);
      const after = fileContent.substring(afterEnd);
      fileContent = `${before}${newCodeBlock}${after}`;
      add('success', 'Updated between markers', `${markerStart} ... ${markerEnd}`);
    } else {
      if (targetFilePath.includes('pom.js')) {
        const lines = fileContent.split(/\r?\n/);
        let lastBraceLineIndex = -1;
        for (let i = lines.length - 1; i >= 0; i--) {
          if (lines[i].trim() === '}') { lastBraceLineIndex = i; break; }
        }
        if (lastBraceLineIndex !== -1) {
          lines.splice(lastBraceLineIndex, 0, newCodeBlock);
          fileContent = lines.join(EOL);
          add('success', 'Injected inside class', path.basename(targetFilePath));
        } else {
          add('error', 'Class structure not found', targetFilePath);
          printReport(rows);
          return { success: false, message: `Could not find class structure to inject into ${targetFilePath}` };
        }
      } else {
        fileContent += `${EOL}${newCodeBlock}`;
        add('success', 'Appended at end', path.basename(targetFilePath));
      }
    }

    await fs.writeFile(absoluteTargetFilePath, fileContent, 'utf8');
    add('success', 'Written', absoluteTargetFilePath);
    printReport(rows);
    return { success: true, message: `Code injected/updated in ${targetFilePath}` };
  } catch (error) {
    const msg = `Error injecting code in ${targetFilePath}: ${error.message}`;
    add('error', 'Injection failed', msg);
    printReport(rows);
    return { success: false, message: `Error injecting code: ${error.message}` };
  }
}

async function removeCode(targetFilePath, markerStart, markerEnd) {
  const rows = [];
  const add = (level, action, detail) => rows.push({ level, action, detail });
  const absoluteTargetFilePath = resolveTargetPath(targetFilePath);

  try {
    const originalContent = await fs.readFile(absoluteTargetFilePath, 'utf8');
    add('info', 'Target', absoluteTargetFilePath);
    const lines = originalContent.split(/\r?\n/);

    let startIndex = -1;
    let endIndex = -1;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(markerStart)) startIndex = i;
      if (lines[i].includes(markerEnd)) { endIndex = i; break; }
    }

    if (startIndex !== -1 && endIndex !== -1) {
      const newLines = lines.filter((_, idx) => idx < startIndex || idx > endIndex);
      const finalContent = newLines.join('\n').replace(/(\n){3,}/g, '\n\n');
      await fs.writeFile(absoluteTargetFilePath, finalContent, 'utf8');
      add('success', 'Removed block', `${markerStart} ... ${markerEnd}`);
      printReport(rows);
      return { success: true };
    } else {
      add('warning', 'Markers not found', `${markerStart} / ${markerEnd}`);
      printReport(rows);
      return { success: true };
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      add('info', 'File not found', absoluteTargetFilePath);
      printReport(rows);
      return { success: true };
    }
    add('error', 'Removal failed', `Error removing code from ${targetFilePath}: ${error.message}`);
    printReport(rows);
    return { success: false, message: `Error removing code: ${error.message}` };
  }
}

module.exports = { injectCode, removeCode, setUserProjectRoot };
