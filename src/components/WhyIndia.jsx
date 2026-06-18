import { useTranslation } from 'react-i18next';
import useLocalizedUrl from '../hooks/useLocalizedUrl';

const BASE = 'https://inbound.kesariselect.com';
const CARDS = [
  { key: 'ayurveda', slug: 'ayurveda-and-wellness', img: 'https://tap.kesariselect.com/public/cms/whyindia/1730266924.jpg', alt: 'Ayurveda' },
  { key: 'luxury',   slug: 'luxury-train',          img: 'https://tap.kesariselect.com/public/cms/whyindia/1730376933.jpg', alt: 'Luxury Trains' },
  { key: 'spiritual',slug: 'spiritual',              img: 'https://tap.kesariselect.com/public/cms/whyindia/1730376950.jpg', alt: 'Spiritual' },
  { key: 'historic', slug: 'historic',               img: 'https://tap.kesariselect.com/public/cms/whyindia/1730266937.jpg', alt: 'Historic' },
  { key: 'nature',   slug: 'nature',                 img: 'https://tap.kesariselect.com/public/cms/whyindia/1730808195.jpg', alt: 'Nature' },
];

export default function WhyIndia() {
  const { t } = useTranslation('home');
  const localizeUrl = useLocalizedUrl();
  return (
    <div className="sec sec-bg">
      <div className="wrap">
        <div className="tag">{t('whyIndia.tag')}</div>
        <h2 className="h2">{t('whyIndia.title')}</h2>
        <p className="sub">{t('whyIndia.subtitle')}</p>
        <div className="why-grid">
          {CARDS.map(c => (
            <a key={c.key} className="why-card" href={localizeUrl(`${BASE}/explore/theme/${c.slug}`)} target="_blank" rel="noreferrer">
              <img src={c.img} alt={c.alt} />
              <div className="why-body">
                <span className="why-tag">{t(`whyIndia.cards.${c.key}.tag`)}</span>
                <div className="why-title">{t(`whyIndia.cards.${c.key}.title`)}</div>
                <div className="why-desc">{t(`whyIndia.cards.${c.key}.desc`)}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
