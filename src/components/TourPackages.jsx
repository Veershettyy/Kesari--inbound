import { useState, forwardRef, useImperativeHandle } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PACKAGES } from '../data/packages';

const PAGE = 9;
const FILTERS = ['all','nature','historic','luxuryTrain','ayurveda','firstTimers','spiritual','adventure','luxury','family','wildlife'];
const FILTER_VALS = {
  all: 'All', nature: 'nature', historic: 'historic', luxuryTrain: 'luxury-train',
  ayurveda: 'ayurveda', firstTimers: 'first-timers',
  spiritual: 'spiritual', adventure: 'adventure', luxury: 'luxury',
  family: 'family', wildlife: 'wildlife',
};

function themeKey(raw) {
  return raw.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

const TourPackages = forwardRef(function TourPackages({ onEnquire }, ref) {
  const { t, i18n } = useTranslation(['tours','common']);
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [visible, setVisible] = useState(PAGE);

  // Build the correct base path for any language
  const lang = i18n.language;
  const langSlug = lang === 'en' ? '' : (lang === 'es-ES' ? 'es' : lang);
  const basePath = langSlug ? `/INT/${langSlug}` : '/INT';

  useImperativeHandle(ref, () => ({
    setSearch: (q) => { setSearch(q); setVisible(PAGE); }
  }));

  const filtered = PACKAGES.filter(p => {
    const val = FILTER_VALS[filter];
    const matchTheme = val === 'All' || themeKey(p.theme) === val;
    const q = search.toLowerCase();
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.places.toLowerCase().includes(q) || p.theme.toLowerCase().includes(q);
    return matchTheme && matchSearch;
  });

  const shown = filtered.slice(0, visible);

  function goToPackage(code) {
    navigate(`${basePath}/explore/product-details/${code}`);
  }

  return (
    <div id="packages" className="sec sec-bg">
      <div className="wrap">
        <div className="tag">{t('tours:packages.tag')}</div>
        <h2 className="h2">{t('tours:packages.title')}</h2>
        <p className="sub">{t('tours:packages.subtitle')}</p>
        <div className="filter-bar">
          <input
            className="filter-search"
            type="text"
            placeholder={t('tours:packages.searchPlaceholder')}
            value={search}
            onChange={e => { setSearch(e.target.value); setVisible(PAGE); }}
          />
          <div className="filters">
            {FILTERS.map(f => (
              <button
                key={f}
                className={`f-btn${filter === f ? ' active' : ''}`}
                onClick={() => { setFilter(f); setVisible(PAGE); }}
              >
                {t(`tours:packages.filters.${f}`)}
              </button>
            ))}
          </div>
        </div>
        <div className="pkg-grid">
          {shown.map(p => (
            <div
              key={p.code}
              className="pkg-card"
              style={{ cursor: 'pointer' }}
              onClick={() => goToPackage(p.code)}
            >
              <div className="pkg-img">
                <img
                  src={p.img}
                  alt={p.name}
                  loading="lazy"
                  onError={e => { e.target.src = 'https://tap.kesariselect.com/public/cms/hiddengems/1729764681.webp'; }}
                />
                <div className="pkg-badge">{t(`tours:themes.${p.theme}`, { defaultValue: p.theme })}</div>
                <div className="pkg-days">{p.days}D / {p.nights}N</div>
              </div>
              <div className="pkg-body">
                <div className="pkg-theme">{t(`tours:themes.${p.theme}`, { defaultValue: p.theme })}</div>
                <div className="pkg-title">{t(`tours:pkgNames.${p.code}`, { defaultValue: p.name })}</div>
                <div className="pkg-places">📍 {t(`tours:pkgPlaces.${p.code}`, { defaultValue: p.places })}</div>
                <div className="pkg-tags">
                  {p.tags.split(',').map(tag => (
                    <span key={tag} className="pkg-tag">{tag.trim()}</span>
                  ))}
                </div>
                <div className="pkg-footer">
                  <button
                    className="btn-outline-sm"
                    onClick={e => { e.stopPropagation(); goToPackage(p.code); }}
                  >
                    {t('common:buttons.viewTrip')}
                  </button>
                  <button
                    className="btn-navy"
                    onClick={e => { e.stopPropagation(); onEnquire(p.name); }}
                  >
                    {t('common:buttons.enquire')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div id="no-results">{t('tours:packages.noResults')}</div>
        )}
        {visible < filtered.length && (
          <div className="pkg-more">
            <button className="btn-outline" onClick={() => setVisible(v => v + PAGE)}>
              {t('common:buttons.loadMore')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

export default TourPackages;
