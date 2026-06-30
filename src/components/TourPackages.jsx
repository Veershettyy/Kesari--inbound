import { useState, forwardRef, useImperativeHandle, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PACKAGES } from '../data/packages';

function Lightbox({ imgs, index, onClose }) {
  const [cur, setCur] = useState(index);
  const go = useCallback(n => setCur(c => (c + n + imgs.length) % imgs.length), [imgs.length]);

  useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [go, onClose]);

  return (
    <div className="lb-overlay" onClick={onClose}>
      <button className="lb-close" onClick={onClose}>✕</button>
      <button className="lb-arrow lb-prev" onClick={e => { e.stopPropagation(); go(-1); }}>&#8592;</button>
      <div className="lb-img-wrap" onClick={e => e.stopPropagation()}>
        <img src={imgs[cur].img} alt={imgs[cur].name} className="lb-img" />
        <div className="lb-caption">{imgs[cur].name}</div>
      </div>
      <button className="lb-arrow lb-next" onClick={e => { e.stopPropagation(); go(1); }}>&#8594;</button>
    </div>
  );
}

const RATINGS = [4.8, 4.9, 4.7, 5.0, 4.8, 4.6, 4.9, 4.7, 4.8, 5.0, 4.9, 4.6];
const COUNTS  = [247, 189, 312, 156, 203, 94, 278, 134, 221, 167, 298, 112];
function pkgRating(code) {
  const h = code.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return { rating: RATINGS[h % RATINGS.length], count: COUNTS[h % COUNTS.length] };
}

const PAGE = 9;
const FILTERS = ['all','nature','historic','luxuryTrain','ayurveda','firstTimers','spiritual','adventure','luxury','family','wildlife'];
const FILTER_VALS = {
  all: 'All', nature: 'nature', historic: 'historic', luxuryTrain: 'luxury-train',
  ayurveda: 'ayurveda-and-wellness', firstTimers: 'first-timers',
  spiritual: 'spiritual', adventure: 'adventure', luxury: 'luxury',
  family: 'family', wildlife: 'wildlife',
};

// Maps kebab theme → filter key so badge reuses the filter translations (already verified working)
const THEME_FILTER_KEY = {
  'first-timers':        'firstTimers',
  'historic':            'historic',
  'family':              'family',
  'nature':              'nature',
  'luxury-train':        'luxuryTrain',
  'ayurveda-and-wellness': 'ayurveda',
  'spiritual':           'spiritual',
  'adventure':           'adventure',
  'luxury':              'luxury',
  'wildlife':            'wildlife',
};

function themeKey(raw) {
  return raw.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

const TAG_KEYS = {
  'weekend break':      'weekendBreak',
  'luxury holidays':    'luxuryHolidays',
  'family':             'family',
  'honeymoon':          'honeymoon',
  'adventure':          'adventure',
  'wildlife holidays':  'wildlifeHolidays',
  'welness spa':        'wellnessSpa',
  'wellness spa':       'wellnessSpa',
};

const TourPackages = forwardRef(function TourPackages({ onEnquire }, ref) {
  const { t, i18n } = useTranslation(['tours','common']);
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [visible, setVisible] = useState(PAGE);
  const [lightbox, setLightbox] = useState(null);

  // Build the correct base path for any language
  const lang = i18n.language;
  const langSlug = lang === 'en' ? '' : (lang === 'es-ES' ? 'es' : lang);
  const basePath = langSlug ? `/INT/${langSlug}` : '/INT';

  useImperativeHandle(ref, () => ({
    setSearch: (q) => { setSearch(q); setFilter('all'); setVisible(PAGE); },
    setFilter: (f) => { setFilter(f); setSearch(''); setVisible(PAGE); },
  }));

  const filtered = PACKAGES.filter(p => {
    const val = FILTER_VALS[filter];
    const matchTheme = val === 'All' || themeKey(p.theme) === val;
    const q = search.toLowerCase();
    if (!q) return matchTheme;
    const tName   = t(`tours:pkgNames.${p.code}`,   { defaultValue: p.name });
    const tPlaces = t(`tours:pkgPlaces.${p.code}`,  { defaultValue: p.places });
    const matchSearch =
      p.name.toLowerCase().includes(q) ||
      p.places.toLowerCase().includes(q) ||
      p.theme.toLowerCase().includes(q) ||
      tName.toLowerCase().includes(q) ||
      tPlaces.toLowerCase().includes(q);
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
                  onClick={e => { e.stopPropagation(); setLightbox(shown.indexOf(p)); }}
                  style={{ cursor: 'zoom-in' }}
                />
                <div className="pkg-badge">{t(`tours:packages.filters.${THEME_FILTER_KEY[themeKey(p.theme)] ?? themeKey(p.theme)}`, { defaultValue: p.theme })}</div>
                <div className="pkg-days">{p.days}D / {p.nights}N</div>
                <div className="pkg-zoom">🔍</div>
              </div>
              <div className="pkg-body">
                <div className="pkg-theme">{t(`tours:packages.filters.${THEME_FILTER_KEY[themeKey(p.theme)] ?? themeKey(p.theme)}`, { defaultValue: p.theme })}</div>
                <div className="pkg-title">{t(`tours:pkgNames.${p.code}`, { defaultValue: p.name })}</div>
                <div className="pkg-places">📍 {t(`tours:pkgPlaces.${p.code}`, { defaultValue: p.places })}</div>
<div className="pkg-tags">
                  {p.tags.split(',').map(tag => {
                    const raw = tag.trim();
                    const key = TAG_KEYS[raw.toLowerCase()];
                    return <span key={raw} className="pkg-tag">{key ? t(`tours:tags.${key}`, { defaultValue: raw }) : raw}</span>;
                  })}
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
    {lightbox !== null && (
      <Lightbox
        imgs={shown.map(p => ({ img: p.img, name: t(`tours:pkgNames.${p.code}`, { defaultValue: p.name }) }))}
        index={lightbox}
        onClose={() => setLightbox(null)}
      />
    )}
  );
});

export default TourPackages;
