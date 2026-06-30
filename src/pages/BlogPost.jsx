import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SeoHead from '../components/SeoHead';

export default function BlogPost() {
  const { slug } = useParams();
  const { t, i18n } = useTranslation('blog');
  const navigate = useNavigate();

  const lang = i18n.language;
  const langSlug = lang === 'en' ? '' : (lang === 'es-ES' ? 'es' : lang);
  const base = langSlug ? `/INT/${langSlug}` : '/INT';

  const articles = t('articles', { returnObjects: true }) || [];
  const article = articles.find(a => a.slug === slug);

  if (!article) {
    return (
      <>
        <Navbar />
        <div style={{ padding: '120px 48px', textAlign: 'center' }}>
          <h2>Article not found</h2>
          <button className="btn-red" style={{ marginTop: 24 }} onClick={() => navigate(`${base}/blog`)}>
            Back to Guides
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SeoHead />
      <Navbar />

      <div className="post-hero" style={{ backgroundImage: `url('${article.img}')` }}>
        <div className="post-hero-overlay">
          <button className="post-back" onClick={() => navigate(`${base}/blog`)}>
            ← {t('backToBlog')}
          </button>
          <span className="post-cat">{article.category}</span>
          <h1 className="post-title">{article.title}</h1>
          <div className="post-meta">{article.readTime}</div>
        </div>
      </div>

      <div className="post-body">
        <div className="post-wrap">
          <p className="post-excerpt">{article.excerpt}</p>
          {(article.sections || []).map((s, i) => (
            <div key={i} className="post-section">
              <h2 className="post-heading">{s.heading}</h2>
              <p className="post-text">{s.body}</p>
            </div>
          ))}
          <div className="post-cta">
            <h3>Ready to Experience India?</h3>
            <p>Let KeSARi Inbound craft your perfect journey.</p>
            <a href={`${base}/#enquiry`} className="btn-hero">Plan My Trip</a>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
