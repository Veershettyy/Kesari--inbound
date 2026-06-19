import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function LocaleWrapper({ children }) {
  const { pathname } = useLocation();
  const { i18n } = useTranslation();

  useEffect(() => {
    const isEs = pathname.startsWith('/INT/es') || pathname.startsWith('/es-es');
    i18n.changeLanguage(isEs ? 'es-ES' : 'en');
  }, [pathname, i18n]);

  return children;
}
