import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { SEASON_DATA, THEME_SLUGS } from '../data/packages';
const THEME_FILTER_KEY = {'first-timers':'firstTimers','historic':'historic','family':'family','nature':'nature','luxury-train':'luxuryTrain','ayurveda-and-wellness':'ayurveda','spiritual':'spiritual','adventure':'adventure','luxury':'luxury','wildlife':'wildlife'};
function themeKey(raw) { return raw.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,''); }

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const LANG_SLUGS = ['de','fr','es','it','pt','pl','hi','ml','mr','ar','zh','ja','ko'];

export default function SeasonalPlanner({ onEnquire, onViewTheme }) {
  const { t, i18n } = useTranslation(['home','common','tours']);
  const [active, setActive] = useState('Jan');
  const navigate = useNavigate();
  const location = useLocation();

  const rawData = SEASON_DATA[active] || [];
  const translatedPkgs = t(`home:seasonal.pkgs.${active}`, { returnObjects: true, defaultValue: [] });

  function getBase() {
    const m = location.pathname.match(/^\/INT\/([^/]+)/);
    if (m && LANG_SLUGS.includes(m[1])) return `/INT/${m[1]}`;
    return '/INT';
  }

  function openPackage(d) {
    if (d.code) {
      navigate(`${getBase()}/explore/product-details/${d.code}`);
    } else {
      const filterKey = THEME_FILTER_KEY[themeKey(d.theme)] || 'all';
      onViewTheme?.(filterKey);
    }
  }

  return (
    <div className="season-section" id="seasonal">
      <div className="season-wrap">
        <div className="tag">{t('home:seasonal.tag')}</div>
        <h2 className="h2">{t('home:seasonal.title')}</h2>
        <p className="sub">{t('home:seasonal.subtitle')}</p>
        <div className="month-tabs">
          {MONTHS.map(m => (
            <button
              key={m}
              className={`m-tab${active === m ? ' active' : ''}`}
              onClick={() => setActive(m)}
            >
              {t(`home:seasonal.months.${m}`)}
            </button>
          ))}
        </div>
        <div className="season-grid">
          {rawData.map((d, i) => {
            const tr = (Array.isArray(translatedPkgs) && translatedPkgs[i]) || {};
            const title = tr.title || d.title;
            const info  = tr.info  || d.info;
            const tk = themeKey(d.theme);
            const theme = t(`tours:packages.filters.${THEME_FILTER_KEY[tk] ?? tk}`, { defaultValue: d.theme });
            return (
              <div key={i} className="season-card" style={{ cursor: 'pointer' }} onClick={() => openPackage(d)}>
                <img
                  src={d.img}
                  alt={title}
                  loading="lazy"
                  onError={e => { e.target.src = 'https://tap.kesariselect.com/public/cms/hiddengems/1729764681.webp'; }}
                />
                <div className="season-body">
                  <div className="season-theme">{theme}</div>
                  <div className="season-title">{title}</div>
                  <div className="season-info">🗓 {info}</div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                    <button className="season-btn" style={{ flex: 1 }} onClick={e => { e.stopPropagation(); openPackage(d); }}>
                      {t('common:buttons.viewTrips')}
                    </button>
                    <button
                      className="season-btn"
                      style={{ flex: 1, background: 'var(--yellow)', color: 'var(--navy)' }}
                      onClick={e => { e.stopPropagation(); onEnquire(title); }}
                    >
                      {t('common:buttons.enquire')}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
