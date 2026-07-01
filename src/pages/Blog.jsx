import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SeoHead from '../components/SeoHead';

const CATEGORY_COLORS = {
  Planning: '#27306B',
  Itinerary: '#E41E25',
  Destination: '#2a9d8f',
  Culture: '#e76f51',
  Adventure: '#2d6a4f',
};

export default function Blog() {
  const { t, i18n } = useTranslation('blog');
  const navigate = useNavigate();
  const articles = t('articles', { returnObjects: true }) || [];

  const lang = i18n.language;
  const langSlug = lang === 'en' ? '' : (lang === 'es-ES' ? 'es' : lang);
  const base = langSlug ? `/INT/${langSlug}` : '/INT';

  return (
    <>
      <SeoHead />
      <Navbar />

      <div className="blog-hero">
        <div className="tag">{t('tag')}</div>
        <h1 className="blog-hero-title">{t('title')}</h1>
        <p className="blog-hero-sub">{t('subtitle')}</p>
      </div>

      <div className="blog-section">
        <div className="wrap">
          <div className="blog-grid">
            {articles.map((a, i) => (
              <div
                key={a.slug}
                className="blog-card fade-up"
                style={{ transitionDelay: `${i * 0.08}s`, cursor: 'pointer' }}
                onClick={() => navigate(`${base}/blog/${a.slug}`)}
              >
                <div className="blog-card-img">
                  <img src={a.img} alt={a.title} loading="lazy" />
                  <span
                    className="blog-cat"
                    style={{ background: CATEGORY_COLORS[a.category] || '#27306B' }}
                  >{a.category}</span>
                </div>
                <div className="blog-card-body">
                  <h2 className="blog-card-title">{a.title}</h2>
                  <p className="blog-card-excerpt">{a.excerpt}</p>
                  <span className="blog-read-more">{t('readMore')} →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
