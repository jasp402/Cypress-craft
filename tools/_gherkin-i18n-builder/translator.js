import fs from "fs";
import path from "path";

// === CONFIGURACIÓN ===
const INPUT_DIR = "./input";
const OUTPUT_DIR = "./output";
const I18N_DIR = "./i18n";
const TEMP_DIR = "./.temp";

// Palabras clave en diferentes idiomas
const KEYWORDS = {
    en: {
        feature: ["Feature"],
        background: ["Background"],
        scenario: ["Scenario"],
        scenarioOutline: ["Scenario Outline"],
        given: ["Given"],
        when: ["When"],
        then: ["Then"],
        and: ["And"],
        but: ["But"]
    },
    es: {
        feature: ["Característica", "Caracteristica"],
        background: ["Antecedentes"],
        scenario: ["Escenario"],
        scenarioOutline: ["Esquema del escenario"],
        given: ["Dado"],
        when: ["Cuando"],
        then: ["Entonces"],
        and: ["Y", "E"],
        but: ["Pero"]
    }
};

// === UTILIDADES ===
function slugify(text) {
    return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "")
        .toUpperCase();
}

function ensureDir(p) {
    if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function matchesKeyword(text, keywords) {
    const trimmed = text.trim();
    return keywords.some(kw => {
        const regex = new RegExp(`^${kw}\\s*:`, 'i');
        return regex.test(trimmed);
    });
}

function detectKeywordType(text, lang) {
    const kw = KEYWORDS[lang];
    const trimmed = text.trim();

    if (matchesKeyword(trimmed, kw.feature)) return 'feature';
    if (matchesKeyword(trimmed, kw.background)) return 'background';
    if (matchesKeyword(trimmed, kw.scenarioOutline)) return 'scenarioOutline';
    if (matchesKeyword(trimmed, kw.scenario)) return 'scenario';
    if (matchesKeyword(trimmed, kw.given)) return 'given';
    if (matchesKeyword(trimmed, kw.when)) return 'when';
    if (matchesKeyword(trimmed, kw.then)) return 'then';
    if (matchesKeyword(trimmed, kw.and)) return 'and';
    if (matchesKeyword(trimmed, kw.but)) return 'but';

    return null;
}

function extractKeywordAndText(line, lang) {
    const trimmed = line.trim();
    const type = detectKeywordType(trimmed, lang);

    if (!type) return null;

    const allKeywords = [
        ...KEYWORDS[lang].feature,
        ...KEYWORDS[lang].background,
        ...KEYWORDS[lang].scenario,
        ...KEYWORDS[lang].scenarioOutline,
        ...KEYWORDS[lang].given,
        ...KEYWORDS[lang].when,
        ...KEYWORDS[lang].then,
        ...KEYWORDS[lang].and,
        ...KEYWORDS[lang].but
    ];

    for (const kw of allKeywords) {
        const regex = new RegExp(`^(${kw})\\s*:\\s*(.*)$`, 'i');
        const match = trimmed.match(regex);
        if (match) {
            return {
                type,
                keyword: match[1],
                text: match[2].trim()
            };
        }
    }

    return null;
}

// === PARSEO DE ARCHIVO ===
function parseFeatureFile(content, lang) {
    const lines = content.split(/\r?\n/);
    const parsed = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const indent = line.match(/^\s*/)?.[0] || "";
        const trimmed = line.trim();

        if (trimmed === "") {
            parsed.push({ type: "empty", line, indent, text: "" });
            continue;
        }

        // Directiva de idioma
        if (trimmed.match(/^#\s*language:/i)) {
            parsed.push({ type: "language", line, indent, text: trimmed });
            continue;
        }

        // Comentarios
        if (trimmed.startsWith("#")) {
            const text = trimmed.substring(1).trim();
            parsed.push({ type: "comment", line, indent, text: trimmed, commentText: text });
            continue;
        }

        // Tags
        if (trimmed.startsWith("@")) {
            parsed.push({ type: "tag", line, indent, text: trimmed });
            continue;
        }

        // Tablas de datos
        if (trimmed.startsWith("|")) {
            parsed.push({ type: "table", line, indent, text: trimmed });
            continue;
        }

        // Palabras clave (Feature, Scenario, Steps, etc.)
        const kwData = extractKeywordAndText(line, lang);
        if (kwData) {
            parsed.push({
                type: kwData.type,
                line,
                indent,
                keyword: kwData.keyword,
                text: kwData.text
            });
            continue;
        }

        // Líneas descriptivas (con indentación)
        if (line.match(/^\s+\S/)) {
            parsed.push({ type: "description", line, indent, text: trimmed });
            continue;
        }

        // Otras líneas
        parsed.push({ type: "unknown", line, indent, text: trimmed });
    }

    return parsed;
}

// === PROCESAMIENTO PRINCIPAL ===
function processFeatureFiles(baseFilename) {
    console.log(`\n${"=".repeat(60)}`);
    console.log(`🔄 Procesando: ${baseFilename}`);
    console.log(`${"=".repeat(60)}\n`);

    const enPath = path.join(INPUT_DIR, `${baseFilename}.en.feature`);
    const esPath = path.join(INPUT_DIR, `${baseFilename}.es.feature`);

    if (!fs.existsSync(enPath) || !fs.existsSync(esPath)) {
        console.error(`❌ Se requieren ambos archivos:\n   - ${enPath}\n   - ${esPath}`);
        return;
    }

    const enContent = fs.readFileSync(enPath, "utf8");
    const esContent = fs.readFileSync(esPath, "utf8");

    const enParsed = parseFeatureFile(enContent, "en");
    const esParsed = parseFeatureFile(esContent, "es");

    // Verificar que ambos archivos tengan la misma estructura
    if (enParsed.length !== esParsed.length) {
        console.warn(`⚠️  Advertencia: Los archivos tienen diferente número de líneas (EN: ${enParsed.length}, ES: ${esParsed.length})`);
    }

    // Construir diccionarios usando EN como referencia para las claves
    const enDict = {};
    const esDict = {};
    const tplLines = [];

    let counters = {
        FEATURE: 0,
        SCENARIO: 0,
        STEP: 0,
        COMMENT: 0,
        DESC: 0
    };

    const maxLines = Math.max(enParsed.length, esParsed.length);

    for (let i = 0; i < maxLines; i++) {
        const enItem = enParsed[i];
        const esItem = esParsed[i];

        if (!enItem && !esItem) continue;

        const type = enItem?.type || esItem?.type;
        const indent = enItem?.indent || esItem?.indent || "";

        switch (type) {
            case "empty":
                tplLines.push("");
                break;

            case "language":
                enDict["@LANGUAGE_DIRECTIVE"] = enItem?.text || "# language: en";
                esDict["@LANGUAGE_DIRECTIVE"] = esItem?.text || "# language: es";
                tplLines.push("@LANGUAGE_DIRECTIVE");
                break;

            case "comment": {
                counters.COMMENT++;
                const enText = enItem?.commentText || "";
                const slug = slugify(enText);
                const key = slug ? `@COMMENT_${String(counters.COMMENT).padStart(2, "0")}_${slug}` : `@COMMENT_${String(counters.COMMENT).padStart(2, "0")}`;

                enDict[key] = enItem?.text || "";
                esDict[key] = esItem?.text || enItem?.text || "";
                tplLines.push(`${indent}${key}`);
                break;
            }

            case "tag": {
                const enText = enItem?.text || esItem?.text || "";
                const slug = slugify(enText.replace(/@/g, " ").trim());
                const key = `@TAG_${slug}`;

                enDict[key] = enItem?.text || "";
                esDict[key] = esItem?.text || enItem?.text || "";
                tplLines.push(`${indent}${key}`);
                break;
            }

            case "feature": {
                counters.FEATURE++;
                const enText = enItem?.text || "";
                const slug = slugify(enText);
                const key = `@FEATURE_${String(counters.FEATURE).padStart(2, "0")}_${slug}`;

                enDict["@FEATURE"] = "Feature:";
                esDict["@FEATURE"] = "Característica:";
                enDict[key] = enItem?.text || "";
                esDict[key] = esItem?.text || enItem?.text || "";
                tplLines.push(`${indent}@FEATURE ${key}`);
                break;
            }

            case "background": {
                enDict["@BACKGROUND"] = "Background:";
                esDict["@BACKGROUND"] = "Antecedentes:";
                tplLines.push(`${indent}@BACKGROUND`);
                break;
            }

            case "scenario":
            case "scenarioOutline": {
                counters.SCENARIO++;
                const enText = enItem?.text || "";
                const slug = slugify(enText);
                const key = `@SCENARIO_${String(counters.SCENARIO).padStart(2, "0")}_${slug}`;

                const isOutline = type === "scenarioOutline";
                if (isOutline) {
                    enDict["@SCENARIO_OUTLINE"] = "Scenario Outline:";
                    esDict["@SCENARIO_OUTLINE"] = "Esquema del escenario:";
                    enDict[key] = enItem?.text || "";
                    esDict[key] = esItem?.text || enItem?.text || "";
                    tplLines.push(`${indent}@SCENARIO_OUTLINE ${key}`);
                } else {
                    enDict["@SCENARIO"] = "Scenario:";
                    esDict["@SCENARIO"] = "Escenario:";
                    enDict[key] = enItem?.text || "";
                    esDict[key] = esItem?.text || enItem?.text || "";
                    tplLines.push(`${indent}@SCENARIO ${key}`);
                }
                break;
            }

            case "given":
            case "when":
            case "then":
            case "and":
            case "but": {
                counters.STEP++;
                const enText = enItem?.text || "";
                const slug = slugify(enText);
                const key = `@STEP_${String(counters.STEP).padStart(2, "0")}_${slug}`;

                const stepType = type.toUpperCase();
                const keywordKey = `@${stepType}`;

                // Mapear palabras clave correctamente
                const keywordMap = {
                    en: { GIVEN: "Given", WHEN: "When", THEN: "Then", AND: "And", BUT: "But" },
                    es: { GIVEN: "Dado", WHEN: "Cuando", THEN: "Entonces", AND: "Y", BUT: "Pero" }
                };

                enDict[keywordKey] = keywordMap.en[stepType];
                esDict[keywordKey] = keywordMap.es[stepType];
                enDict[key] = enItem?.text || "";
                esDict[key] = esItem?.text || enItem?.text || "";
                tplLines.push(`${indent}${keywordKey} ${key}`);
                break;
            }

            case "description": {
                counters.DESC++;
                const enText = enItem?.text || "";
                const slug = slugify(enText);
                const key = `@DESC_${String(counters.DESC).padStart(2, "0")}_${slug}`;

                enDict[key] = enItem?.text || "";
                esDict[key] = esItem?.text || enItem?.text || "";
                tplLines.push(`${indent}${key}`);
                break;
            }

            case "table":
                tplLines.push(enItem?.line || esItem?.line || "");
                break;

            default:
                tplLines.push(enItem?.line || esItem?.line || "");
        }
    }

    // === ESCRIBIR ARCHIVOS ===
    ensureDir(OUTPUT_DIR);
    ensureDir(I18N_DIR);
    ensureDir(TEMP_DIR);

    // Escribir .tpl
    const tplPath = path.join(OUTPUT_DIR, `${baseFilename}.feature.tpl`);
    fs.writeFileSync(tplPath, tplLines.join("\n"), "utf8");
    console.log(`✏️  Template creado: ${tplPath}`);

    // Escribir diccionarios
    const enDictPath = path.join(I18N_DIR, "en.js");
    const esDictPath = path.join(I18N_DIR, "es.js");

    // Cargar diccionarios existentes si existen
    let existingEnDict = {};
    let existingEsDict = {};

    if (fs.existsSync(enDictPath)) {
        try {
            const raw = fs.readFileSync(enDictPath, "utf8");
            const match = raw.match(/export default\s*(\{[\s\S]*\});?/);
            if (match) existingEnDict = JSON.parse(match[1]);
        } catch (e) {
            console.warn(`⚠️  No se pudo cargar en.js existente: ${e.message}`);
        }
    }

    if (fs.existsSync(esDictPath)) {
        try {
            const raw = fs.readFileSync(esDictPath, "utf8");
            const match = raw.match(/export default\s*(\{[\s\S]*\});?/);
            if (match) existingEsDict = JSON.parse(match[1]);
        } catch (e) {
            console.warn(`⚠️  No se pudo cargar es.js existente: ${e.message}`);
        }
    }

    // Mergear diccionarios (nuevas claves tienen prioridad)
    const finalEnDict = { ...existingEnDict, ...enDict };
    const finalEsDict = { ...existingEsDict, ...esDict };

    fs.writeFileSync(enDictPath, `export default ${JSON.stringify(finalEnDict, null, 2)};`, "utf8");
    fs.writeFileSync(esDictPath, `export default ${JSON.stringify(finalEsDict, null, 2)};`, "utf8");

    console.log(`📝 Diccionario EN actualizado: ${enDictPath} (${Object.keys(enDict).length} nuevas claves)`);
    console.log(`📝 Diccionario ES actualizado: ${esDictPath} (${Object.keys(esDict).length} nuevas claves)`);

    // === VALIDACIÓN ===
    console.log("\n🔍 Validando reconstrucción...");

    const reconstructEN = tplLines.map(line =>
        line.replace(/@[\w_]+/g, match => finalEnDict[match] || match)
    ).join("\n");

    const reconstructES = tplLines.map(line =>
        line.replace(/@[\w_]+/g, match => finalEsDict[match] || match)
    ).join("\n");

    fs.writeFileSync(path.join(TEMP_DIR, `${baseFilename}.en.reconstructed`), reconstructEN, "utf8");
    fs.writeFileSync(path.join(TEMP_DIR, `${baseFilename}.es.reconstructed`), reconstructES, "utf8");

    console.log("✅ Archivos reconstruidos guardados en .temp/");

    // Validar que las claves coincidan
    const enKeys = Object.keys(enDict).filter(k => k.startsWith("@STEP") || k.startsWith("@SCENARIO") || k.startsWith("@FEATURE"));
    const esKeys = Object.keys(esDict).filter(k => k.startsWith("@STEP") || k.startsWith("@SCENARIO") || k.startsWith("@FEATURE"));

    const missingInEs = enKeys.filter(k => !esDict[k]);
    const missingInEn = esKeys.filter(k => !enDict[k]);

    if (missingInEs.length > 0 || missingInEn.length > 0) {
        console.warn(`⚠️  Claves desincronizadas:`);
        if (missingInEs.length > 0) console.warn(`   - Faltan en ES: ${missingInEs.slice(0, 3).join(", ")}${missingInEs.length > 3 ? "..." : ""}`);
        if (missingInEn.length > 0) console.warn(`   - Faltan en EN: ${missingInEn.slice(0, 3).join(", ")}${missingInEn.length > 3 ? "..." : ""}`);
    } else {
        console.log("✅ Todas las claves están sincronizadas\n");
    }
}

// === EJECUCIÓN ===
ensureDir(INPUT_DIR);

// Buscar pares de archivos .en.feature y .es.feature
const files = fs.readdirSync(INPUT_DIR).filter(f => f.endsWith(".en.feature"));

if (files.length === 0) {
    console.error("❌ No se encontraron archivos .en.feature en /input");
    console.log("\n💡 Los archivos deben seguir el patrón:");
    console.log("   - nombre.en.feature");
    console.log("   - nombre.es.feature\n");
    process.exit(1);
}

console.log(`\n${"=".repeat(60)}`);
console.log("🚀 Iniciando procesamiento de archivos .feature");
console.log(`${"=".repeat(60)}`);

for (const file of files) {
    const baseFilename = file.replace(".en.feature", "");
    processFeatureFiles(baseFilename);
}

console.log(`${"=".repeat(60)}`);
console.log("✨ Procesamiento completado");
console.log(`${"=".repeat(60)}\n`);