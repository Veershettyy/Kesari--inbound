import { useTranslation } from 'react-i18next';

const STARS = ['★★★★★','★★★★★','★★★★★','★★★★★','★★★★★','★★★★★','★★★★☆','★★★★★','★★★★☆','★★★★★'];

export default function Reviews() {
  const { t } = useTranslation('home');
  const cards = t('reviews.cards', { returnObjects: true });

  return (
    <div id="reviews" className="rev-section">
      <div className="rev-wrap">
        <div className="tag" style={{ color: 'var(--yellow)' }}>{t('reviews.tag')}</div>
        <h2 className="h2">{t('reviews.title')}</h2>
        <p className="sub">{t('reviews.subtitle')}</p>
        <div className="rev-grid">
          {cards.map((c, i) => (
            <div key={i} className="rev-card">
              <div className="stars">{STARS[i] || '★★★★★'}</div>
              <div className="rev-title">{c.title}</div>
              <p className="rev-text">{c.text}</p>
              <div className="rev-author">{c.author}</div>
              <div className="rev-date">{c.location}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
