import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Native language names for each language code
const LANG_LABELS = {
  'es-ES': 'Español',
  'fr':    'Français',
  'hi':    'हिन्दी',
  'de':    'Deutsch',
  'ja':    '日本語',
  'pt':    'Português',
  'it':    'Italiano',
  'zh':    '中文',
  'ar':    'العربية',
  'ko':    '한국어',
  'ml':    'മലയാളം',
  'pl':    'Polski',
  'en':    'English',
};

const PATH_SEGMENTS = new Set(['explore', 'destinations', 'packages', 'search', 'product-details']);

function extractLangFromPath(pathname) {
  const m = pathname.match(/^\/INT\/([^/]+)/);
  if (!m) return null;
  const seg = m[1].toLowerCase();
  if (PATH_SEGMENTS.has(seg)) return null;
  return m[1];
}

export default function LanguageSwitcher() {
  const navigate   = useNavigate();
  const location   = useLocation();
  const { i18n }   = useTranslation();

  const { pathname } = location;
  const rawLang      = extractLangFromPath(pathname);
  const isEnglish    = !rawLang || pathname.startsWith('/es-es') === false && !rawLang;
  const currentLang  = i18n.language; // 'fr', 'de', 'hi', 'es-ES', 'en' etc.

  function switchToEnglish() {
    if (rawLang) {
      // /INT/fr/... → /INT/...
      navigate(pathname.replace(`/INT/${rawLang}`, '/INT') + location.search);
    } else {
      navigate('/INT');
    }
  }

  function switchToLang() {
    navigate(pathname + location.search); // already on current lang, no-op
  }

  // Don't show switcher on English pages
  if (currentLang === 'en' || !LANG_LABELS[currentLang]) return null;

  const nativeLabel = LANG_LABELS[currentLang];

  return (
    <div id="lang-toggle">
      <button
        id="btn-lang"
        className="active"
        onClick={switchToLang}
      >
        {nativeLabel}
      </button>
      <button
        id="btn-en"
        className=""
        onClick={switchToEnglish}
      >
        English
      </button>
    </div>
  );
}
