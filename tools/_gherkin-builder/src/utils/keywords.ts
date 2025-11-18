export type GherkinLanguage = 'en' | 'es';

export const KEYWORDS: Record<GherkinLanguage, {
  feature: string;
  background: string;
  scenario: string;
  scenarioOutline: string;
  examples: string;
  given: string;
  when: string;
  then: string;
}> = {
  en: {
    feature: 'Feature',
    background: 'Background',
    scenario: 'Scenario',
    scenarioOutline: 'Scenario Outline',
    examples: 'Examples',
    given: 'Given',
    when: 'When',
    then: 'Then',
  },
  es: {
    feature: 'Característica',
    background: 'Antecedentes',
    scenario: 'Escenario',
    scenarioOutline: 'Esquema del escenario',
    examples: 'Ejemplos',
    given: 'Dado',
    when: 'Cuando',
    then: 'Entonces',
  },
};

export const mapStepType = (type: string, lang: GherkinLanguage): string => {
  const t = type.toLowerCase();
  if (t === 'given') return KEYWORDS[lang].given;
  if (t === 'when') return KEYWORDS[lang].when;
  if (t === 'then') return KEYWORDS[lang].then;
  // Fallback to raw type if something custom
  return type;
};
