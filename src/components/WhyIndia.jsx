import { useTranslation } from 'react-i18next';

const U = id => `https://images.unsplash.com/${id}?w=900&h=600&auto=format&fit=crop&q=85`;

const SLUG_TO_FILTER = {
  'ayurveda-and-wellness': 'ayurveda',
  'luxury-train':          'luxuryTrain',
  'spiritual':             'spiritual',
  'historic':              'historic',
  'nature':                'nature',
};

// KeSARi's own curated images for each theme — guaranteed accurate
const KI = f => `https://tap.kesariselect.com/public/cms/whyindia/${f}`;

const CARDS = [
  { key: 'ayurveda', slug: 'ayurveda-and-wellness', img: U('photo-1544161515-4ab6ce6db874'),    alt: 'Ayurveda & Wellness' },
  { key: 'luxury',   slug: 'luxury-train',          img: KI('1730376933.jpg'),                  alt: 'Luxury Trains' },
  { key: 'spiritual',slug: 'spiritual',              img: U('photo-1561361058-c24e02f1e0e8'),    alt: 'Varanasi Ghats', fallback: KI('1730376950.jpg') },
  { key: 'historic', slug: 'historic',               img: KI('1730266937.jpg'),                  alt: 'Historic Monuments' },
  { key: 'nature',   slug: 'nature',                 img: U('photo-1505118380757-91f5f5632de0'), alt: 'Nature & Wildlife' },
];

const FALLBACK = 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=900&h=600&auto=format&fit=crop&q=85';

export default function WhyIndia({ onViewTheme }) {
  const { t } = useTranslation('home');

  function handleClick(e, slug) {
    e.preventDefault();
    const filterKey = SLUG_TO_FILTER[slug] || 'all';
    onViewTheme?.(filterKey);
    document.querySelector('#packages')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className="sec sec-bg">
      <div className="wrap">
        <div className="tag">{t('whyIndia.tag')}</div>
        <h2 className="h2">{t('whyIndia.title')}</h2>
        <p className="sub">{t('whyIndia.subtitle')}</p>
        <div className="why-grid">
          {CARDS.map(c => (
            <a key={c.key} className="why-card" href="#packages" onClick={e => handleClick(e, c.slug)}>
              <img
                src={c.img}
                alt={c.alt}
                loading="lazy"
                onError={e => { e.target.src = c.fallback || FALLBACK; e.target.onerror = null; }}
              />
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
