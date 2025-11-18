import { Feature, Scenario } from "../App";
import { generateFeatureFile } from "../utils/export";
import { downloadFile } from "../utils/download";
import { KEYWORDS } from "../utils/keywords";

interface BddCodePanelProps {
  feature: Feature | null;
  selectedScenario: Scenario | null; // Keep for potential future use (e.g., highlighting)
}

function BddCodePanel({ feature, selectedScenario: _selectedScenario }: BddCodePanelProps) {

  const generateBddCode = () => {
    if (!feature) {
      return '';
    }
    // BUG FIX: Always generate the code for the entire feature, not just the selected scenario.
    return generateFeatureFile(feature.name, feature.scenarios, feature.language || 'es');
  };

  const code = generateBddCode();

  const handleDownload = () => {
    if (feature && code) {
      downloadFile(`${feature.name}.feature`, code);
    }
  };

  const handleCopy = () => {
    if (code) {
      navigator.clipboard.writeText(code).then(() => {
        alert('Copied to clipboard!');
      });
    }
  };

  return (
    <div className="shrink-0 bg-card-light border-t border-border-light rounded-t-xl shadow-sm" style={{ height: '300px' }}>
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-border-light px-4 py-2 rounded-t-xl bg-card-light">
          <h3 className="font-semibold text-text-light">Generated BDD Code (.feature)</h3>
          <div className="flex items-center gap-2">
            <button onClick={handleDownload} className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100">
                <span className="material-symbols-outlined text-base">download</span>
                <span>Download</span>
            </button>
            <button onClick={handleCopy} className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100">
                <span className="material-symbols-outlined text-base">content_copy</span>
                <span>Copy</span>
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto bg-background-light p-4 font-mono text-sm">
          <div className="grid" style={{ counterReset: 'line' }}>
            {(() => {
              const lang = feature?.language || 'es';
              const kw = KEYWORDS[lang];
              const stepStarts = [kw.given, kw.when, kw.then];
              return code.split('\n').map((line, index) => {
                const trimmed = line.trim();
                const startsWithStep = stepStarts.some(k => trimmed.startsWith(k));
                return (
                  <div key={index} className="code-line whitespace-pre">
                    {line.includes(`${kw.feature}:`) && <><span className="text-[#1d4ed8]">{kw.feature}:</span><span>{line.substring(line.indexOf(':') + 1)}</span></>}
                    {line.includes(`${kw.scenario}:`) && <><span className="text-[#1d4ed8]">{kw.scenario}:</span><span>{line.substring(line.indexOf(':') + 1)}</span></>}
                    {line.includes(`${kw.scenarioOutline}:`) && <><span className="text-[#1d4ed8]">{kw.scenarioOutline}:</span><span>{line.substring(line.indexOf(':') + 1)}</span></>}
                    {line.includes(`${kw.examples}:`) && <><span className="text-[#1d4ed8]">{kw.examples}:</span><span>{line.substring(line.indexOf(':') + 1)}</span></>}
                    {startsWithStep && (
                      <>
                        <span className="ml-4 text-[#1d4ed8]">{trimmed.split(' ')[0]}</span>
                        <span> {trimmed.substring(trimmed.indexOf(' ') + 1)}</span>
                      </>
                    )}
                    {trimmed.startsWith('#') && <span className="text-gray-500">{line}</span>}
                  </div>
                );
              })
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BddCodePanel;
