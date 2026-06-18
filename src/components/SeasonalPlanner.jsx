import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SEASON_DATA, THEME_SLUGS } from '../data/packages';
import useLocalizedUrl from '../hooks/useLocalizedUrl';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const BASE = 'https://inbound.kesariselect.com';

export default function SeasonalPlanner({ onEnquire }) {
  const { t } = useTranslation(['home','common','tours']);
  const [active, setActive] = useState('Jan');
  const localizeUrl = useLocalizedUrl();

  const rawData = SEASON_DATA[active] || [];
  const translatedPkgs = t(`home:seasonal.pkgs.${active}`, { returnObjects: true, defaultValue: [] });

  function openTheme(theme) {
    const slug = THEME_SLUGS[theme] || theme.toLowerCase().replace(/[^a-z0-9]+/g,'-');
    window.open(localizeUrl(`${BASE}/explore/theme/${slug}`), '_blank', 'noopener');
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
            const theme = t(`tours:themes.${d.theme}`, { defaultValue: d.theme });
            return (
              <div key={i} className="season-card" style={{ cursor: 'pointer' }} onClick={() => openTheme(d.theme)}>
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
                    <button className="season-btn" style={{ flex: 1 }} onClick={e => { e.stopPropagation(); openTheme(d.theme); }}>
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
