/**
 * Minimal i18n stub for standalone use.
 * Replace with a real i18n provider in a later phase.
 */
export interface I18nContext {
  languageId: string;
  hijriOffset: number;
}

const defaultI18n: I18nContext = {
  languageId: "en",
  hijriOffset: 0,
};

export default function useI18n(): I18nContext {
  return defaultI18n;
}
