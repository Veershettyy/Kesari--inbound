import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'en',    slug: '',   flag: '🇬🇧', label: 'English'    },
  { code: 'de',    slug: 'de', flag: '🇩🇪', label: 'Deutsch'    },
  { code: 'fr',    slug: 'fr', flag: '🇫🇷', label: 'Français'   },
  { code: 'es-ES', slug: 'es', flag: '🇪🇸', label: 'Español'    },
  { code: 'it',    slug: 'it', flag: '🇮🇹', label: 'Italiano'   },
  { code: 'pt',    slug: 'pt', flag: '🇵🇹', label: 'Português'  },
  { code: 'pl',    slug: 'pl', flag: '🇵🇱', label: 'Polski'     },
  { code: 'hi',    slug: 'hi', flag: '🇮🇳', label: 'हिन्दी'      },
  { code: 'ml',    slug: 'ml', flag: '🇮🇳', label: 'മലയാളം'    },
  { code: 'mr',    slug: 'mr', flag: '🇮🇳', label: 'मराठी'      },
  { code: 'ar',    slug: 'ar', flag: '🇸🇦', label: 'العربية'    },
  { code: 'zh',    slug: 'zh', flag: '🇨🇳', label: '中文'        },
  { code: 'ja',    slug: 'ja', flag: '🇯🇵', label: '日本語'      },
  { code: 'ko',    slug: 'ko', flag: '🇰🇷', label: '한국어'      },
];

const PAGE_SEGS = new Set(['explore','destinations','packages','search','product-details']);

function getCurrentSlug(pathname) {
  const m = pathname.match(/^\/INT\/([^/]+)/);
  if (!m) return '';
  const seg = m[1].toLowerCase();
  if (PAGE_SEGS.has(seg)) return '';
  return m[1];
}

function getRestPath(pathname, currentSlug) {
  if (currentSlug) return pathname.replace(`/INT/${currentSlug}`, '') || '/';
  return pathname.replace('/INT', '') || '/';
}

export default function LanguageSwitcher() {
  const [open, setOpen]   = useState(false);
  const ref               = useRef(null);
  const navigate          = useNavigate();
  const location          = useLocation();
  const { i18n }          = useTranslation();

  const currentSlug = getCurrentSlug(location.pathname);
  const currentLang = LANGUAGES.find(l => l.slug === currentSlug) || LANGUAGES[0];

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function switchLang(lang) {
    setOpen(false);
    if (lang.code === currentLang.code) return;
    const rest    = getRestPath(location.pathname, currentSlug);
    const newPath = lang.slug ? `/INT/${lang.slug}${rest}` : `/INT${rest}`;
    navigate(newPath + location.search);
  }

  return (
    <>
      {open && <div className="ls-backdrop" onClick={() => setOpen(false)} />}
      <div className="ls-wrap" ref={ref}>
        <button className="ls-trigger" onClick={() => setOpen(o => !o)}>
          <span className="ls-globe">🌐</span>
          <span className="ls-flag">{currentLang.flag}</span>
          <span className="ls-label">{currentLang.label}</span>
          <span className="ls-arrow">{open ? '▲' : '▼'}</span>
        </button>

        {open && (
          <div className="ls-dropdown">
            <div className="ls-dropdown-header">
              <span className="ls-dropdown-title">Select Language</span>
              <button className="ls-close" onClick={() => setOpen(false)}>✕</button>
            </div>
            <div className="ls-grid">
              {LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  className={`ls-option${lang.code === currentLang.code ? ' ls-active' : ''}`}
                  onClick={() => switchLang(lang)}
                >
                  <span className="ls-opt-flag">{lang.flag}</span>
                  <span className="ls-opt-label">{lang.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
