import { useTranslation } from 'react-i18next';

const GT = 'https://translate.google.com/translate?sl=en&tl=es&u=';

export function localizeUrl(url, isEs) {
  if (!isEs) return url;
  // Don't double-wrap already-translated URLs
  if (url.startsWith(GT)) return url;
  return GT + encodeURIComponent(url);
}

export default function useLocalizedUrl() {
  const { i18n } = useTranslation();
  const isEs = i18n.language === 'es-ES';

  return (url) => localizeUrl(url, isEs);
}
