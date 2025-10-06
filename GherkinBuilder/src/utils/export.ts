
interface Scenario {
  id: string;
  text: string;
  type: string;
  isOutline: boolean;
  examples: string;
  nodes: any[];
}

// --- NEW, CENTRALIZED UTILITY FUNCTION ---
// This function is the single source of truth for generating a step line.
const generateGherkinLine = (stepData: any, forDisplay: boolean = false): string => {
  const { type, template, values } = stepData;
  if (!type || !template || !values) return '';

  let valueIndex = 0;
  const stepText = template.replace(/\{([^}]+)\}/g, (match: string) => {
    if (match === '{dataTable}') return ''; // Handled separately
    const value = values[valueIndex] || '';
    valueIndex++;
    if (forDisplay) {
      return value ? `"${value}"` : '{...}';
    } else {
      // For BDD, use the value if it exists, otherwise keep the original placeholder
      return value ? `"${value}"` : match;
    }
  }).trim();

  let line = forDisplay ? stepText : `    ${type} ${stepText}`;

  const dataTableIndex = (template.match(/\{([^}]+)\}/g) || []).findIndex((p: string) => p === '{dataTable}');
  if (dataTableIndex !== -1) {
    const dataTableValue = values[dataTableIndex] || '';
    if (dataTableValue) {
      if (forDisplay) {
        line += `\n[Data Table attached]`;
      } else {
        const indentedTable = dataTableValue.split('\n').map((row: string) => `      ` + row).join('\n');
        line += `\n${indentedTable}`;
      }
    }
  }

  return line;
};

// To be used by the StepCard for its display text
export const generateStepDisplayText = (stepData: any): string => {
  return generateGherkinLine(stepData, true);
}

export const generateFeatureFile = (featureName: string, scenarios: Scenario[]): string => {
  let featureContent = `Feature: ${featureName}\n\n`;

  scenarios.forEach(scenario => {
    const scenarioKeyword = scenario.isOutline ? 'Scenario Outline' : 'Scenario';
    featureContent += `  ${scenarioKeyword}: ${scenario.text} [${scenario.type}]\n`;
    const sortedNodes = scenario.nodes.sort((a, b) => a.position.y - b.position.y);

    sortedNodes.forEach(node => {
      featureContent += generateGherkinLine(node.data, false) + '\n';
    });

    if (scenario.isOutline && scenario.examples) {
      featureContent += `\n    Examples:\n`;
      featureContent += `      ${scenario.examples.replace(/\n/g, '\n      ')}\n`;
    }

    featureContent += `\n`;
  });

  return featureContent;
};