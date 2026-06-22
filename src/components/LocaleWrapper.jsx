import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { fetchTranslation } from '../utils/translationCache';

import enCommon from '../locales/en/common.json';
import enHome   from '../locales/en/home.json';
import enTours  from '../locales/en/tours.json';
import enSeo    from '../locales/en/seo.json';
import enFooter from '../locales/en/footer.json';

const EN_RESOURCES = {
  common: enCommon,
  home:   enHome,
  tours:  enTours,
  seo:    enSeo,
  footer: enFooter,
};
const NAMESPACES = ['common', 'home', 'tours', 'seo', 'footer'];

// Lang codes that are pre-bundled — no API call needed
const BUNDLED = { en: 'en', es: 'es-ES', 'es-es': 'es-ES' };

// Path segments that look like lang codes but are route parts — treat as English
const PATH_SEGMENTS = new Set(['explore', 'destinations', 'packages', 'search', 'product-details']);

function extractLang(pathname) {
  // /INT/{lang}/... → extract lang
  const m = pathname.match(/^\/INT\/([^/]+)/);
  if (!m) return null;
  const seg = m[1].toLowerCase();
  if (PATH_SEGMENTS.has(seg)) return null; // it's a route segment, not a lang code
  return m[1]; // return original casing e.g. 'fr', 'de', 'ja', 'es'
}

export default function LocaleWrapper({ children }) {
  const { pathname } = useLocation();
  const { i18n } = useTranslation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const isLegacyEs = pathname.startsWith('/es-es');
    const rawLang = extractLang(pathname);

    async function applyLanguage() {
      // Legacy /es-es
      if (isLegacyEs) {
        i18n.changeLanguage('es-ES');
        return;
      }

      // /INT with no lang code → English
      if (!rawLang) {
        i18n.changeLanguage('en');
        return;
      }

      const lower = rawLang.toLowerCase();

      // Pre-bundled language — switch instantly, no API call
      if (BUNDLED[lower]) {
        i18n.changeLanguage(BUNDLED[lower]);
        return;
      }

      // Dynamic language already loaded into i18next
      if (i18n.hasResourceBundle(rawLang, 'common')) {
        i18n.changeLanguage(rawLang);
        return;
      }

      // Fetch from Claude API via Netlify function (localStorage cache checked inside fetchTranslation)
      setLoading(true);
      try {
        await Promise.all(
          NAMESPACES.map(async (ns) => {
            const translated = await fetchTranslation(ns, EN_RESOURCES[ns], rawLang);
            i18n.addResourceBundle(rawLang, ns, translated, true, true);
          })
        );
        i18n.changeLanguage(rawLang);
      } catch (err) {
        console.error('Dynamic translation failed — falling back to English:', err);
        i18n.changeLanguage('en');
      } finally {
        setLoading(false);
      }
    }

    applyLanguage();
  }, [pathname, i18n]);

  if (loading) {
    return (
      <div style={{
        position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: '#fff', zIndex: 9999, gap: 14,
      }}>
        <div style={{
          width: 38, height: 38,
          border: '3px solid #e8e8e8',
          borderTop: '3px solid #1a1a4e',
          borderRadius: '50%',
          animation: 'kspin 0.8s linear infinite',
        }} />
        <span style={{ color: '#888', fontSize: 14, fontFamily: 'sans-serif' }}>
          Loading translations…
        </span>
        <style>{`@keyframes kspin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return children;
}
