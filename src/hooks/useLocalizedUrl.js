import { useTranslation } from 'react-i18next';

const GT_BASE = 'https://translate.google.com/translate?sl=en&tl=';

// Maps i18n language codes to Google Translate language codes
const LANG_MAP = {
  'es-ES': 'es',
  'fr':    'fr',
  'hi':    'hi',
  'de':    'de',
  'ja':    'ja',
  'pt':    'pt',
  'it':    'it',
  'zh':    'zh-CN',
  'ar':    'ar',
};

export function localizeUrl(url, lang) {
  const tl = LANG_MAP[lang];
  if (!tl) return url; // English — return as-is
  if (url.includes('translate.google.com')) return url; // already wrapped
  return `${GT_BASE}${tl}&u=${encodeURIComponent(url)}`;
}

export default function useLocalizedUrl() {
  const { i18n } = useTranslation();
  return (url) => localizeUrl(url, i18n.language);
}
