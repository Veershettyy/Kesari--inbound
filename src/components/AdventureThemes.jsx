import { useTranslation } from 'react-i18next';

const SLUG_TO_FILTER = {
  'ayurveda-and-wellness': 'ayurveda',
  'spiritual':             'spiritual',
  'historic':              'historic',
  'luxury-train':          'luxuryTrain',
  'nature':                'nature',
};

const THEMES = [
  { icon: '🌿', key: 'ayurveda',    slug: 'ayurveda-and-wellness' },
  { icon: '🕌', key: 'spiritual',   slug: 'spiritual' },
  { icon: '🏯', key: 'historic',    slug: 'historic' },
  { icon: '🚂', key: 'luxuryTrain', slug: 'luxury-train' },
  { icon: '🌿', key: 'nature',      slug: 'nature' },
];

export default function AdventureThemes({ onViewTheme }) {
  const { t } = useTranslation('home');

  function handleClick(e, slug) {
    e.preventDefault();
    const filterKey = SLUG_TO_FILTER[slug] || 'all';
    onViewTheme?.(filterKey);
    document.querySelector('#packages')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div id="why">
      <div className="sec">
        <div className="wrap">
          <div className="tag">{t('themes.tag')}</div>
          <h2 className="h2">{t('themes.title')}</h2>
          <p className="sub">{t('themes.subtitle')}</p>
          <div className="adv-grid">
            {THEMES.map(th => (
              <a key={th.key} className="adv-card" href="#packages" onClick={e => handleClick(e, th.slug)}>
                <div className="adv-icon">{th.icon}</div>
                <div className="adv-label">{t(`themes.items.${th.key}`)}</div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
