import { useTranslation } from 'react-i18next';
import useLocalizedUrl from '../hooks/useLocalizedUrl';

const BASE = 'https://inbound.kesariselect.com';

const THEMES = [
  { icon: '🌿', key: 'ayurveda', slug: 'ayurveda-and-wellness' },
  { icon: '🕌', key: 'spiritual', slug: 'spiritual' },
  { icon: '🏯', key: 'historic', slug: 'historic' },
  { icon: '🚂', key: 'luxuryTrain', slug: 'luxury-train' },
  { icon: '🌿', key: 'nature', slug: 'nature' },
];

export default function AdventureThemes() {
  const { t } = useTranslation('home');
  const localizeUrl = useLocalizedUrl();
  return (
    <div id="why">
      <div className="sec">
        <div className="wrap">
          <div className="tag">{t('themes.tag')}</div>
          <h2 className="h2">{t('themes.title')}</h2>
          <p className="sub">{t('themes.subtitle')}</p>
          <div className="adv-grid">
            {THEMES.map(th => (
              <a key={th.key} className="adv-card" href={localizeUrl(`${BASE}/explore/theme/${th.slug}`)} target="_blank" rel="noreferrer">
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
