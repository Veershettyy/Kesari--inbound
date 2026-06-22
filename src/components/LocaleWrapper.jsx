import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { fetchTranslation } from '../utils/translationCache';

import enCommon from '../locales/en/common.json';
import enHome   from '../locales/en/home.json';
import enTours  from '../locales/en/tours.json';
import enSeo    from '../locales/en/seo.json';
import enFooter from '../locales/en/footer.json';

const EN_RESOURCES = { common: enCommon, home: enHome, tours: enTours, seo: enSeo, footer: enFooter };
const NAMESPACES = ['common', 'home', 'tours', 'seo', 'footer'];

const BUNDLED = {
  en: 'en',
  es: 'es-ES', 'es-es': 'es-ES',
  fr: 'fr', hi: 'hi', de: 'de', ja: 'ja',
  pt: 'pt', it: 'it', zh: 'zh', ar: 'ar',
};

const PATH_SEGMENTS = new Set(['explore', 'destinations', 'packages', 'search', 'product-details']);

function extractLang(pathname) {
  const m = pathname.match(/^\/INT\/([^/]+)/);
  if (!m) return null;
  const seg = m[1].toLowerCase();
  if (PATH_SEGMENTS.has(seg)) return null;
  return m[1];
}

function getTargetLang(pathname) {
  if (pathname.startsWith('/es-es')) return 'es-ES';
  const raw = extractLang(pathname);
  if (!raw) return 'en';
  const lower = raw.toLowerCase();
  return BUNDLED[lower] || raw;
}

export default function LocaleWrapper({ children }) {
  const { pathname } = useLocation();
  const { i18n } = useTranslation();
  // Start from i18n's ACTUAL current language, not the target —
  // so setActiveLang always causes a key change and forces a remount
  const [activeLang, setActiveLang] = useState(i18n.language);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const rawLang = extractLang(pathname);
    const lower = rawLang ? rawLang.toLowerCase() : null;

    async function applyLanguage() {
      // Bundled or simple language
      if (!rawLang || pathname.startsWith('/es-es') || BUNDLED[lower]) {
        const lang = getTargetLang(pathname);
        await i18n.changeLanguage(lang);
        setActiveLang(lang);
        return;
      }

      // Already loaded dynamic language
      if (i18n.hasResourceBundle(rawLang, 'common')) {
        await i18n.changeLanguage(rawLang);
        setActiveLang(rawLang);
        return;
      }

      // Fetch dynamic language via Netlify function
      setLoading(true);
      try {
        await Promise.all(
          NAMESPACES.map(async (ns) => {
            const translated = await fetchTranslation(ns, EN_RESOURCES[ns], rawLang);
            i18n.addResourceBundle(rawLang, ns, translated, true, true);
          })
        );
        await i18n.changeLanguage(rawLang);
        setActiveLang(rawLang);
      } catch {
        await i18n.changeLanguage('en');
        setActiveLang('en');
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

  // key=activeLang forces all children to remount when language changes,
  // guaranteeing every useTranslation hook picks up the new language
  return <span key={activeLang} style={{ display: 'contents' }}>{children}</span>;
}
