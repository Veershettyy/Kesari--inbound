import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function LocaleWrapper({ children }) {
  const { pathname } = useLocation();
  const { i18n } = useTranslation();

  useEffect(() => {
    const lang = pathname.startsWith('/es-es') ? 'es-ES' : 'en';
    i18n.changeLanguage(lang);
  }, [pathname, i18n]);

  return children;
}
