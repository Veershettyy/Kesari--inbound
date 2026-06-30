import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SeoHead from '../components/SeoHead';

const HERO_IMG = 'https://kesariselect.s3.ap-south-1.amazonaws.com/GrKDX67aEiAJpj6KiZrEmD6hldysi2JA5aUBvjvK.jpg';
const STATS = [
  { value: '42+', key: 'years' },
  { value: '700+', key: 'team' },
  { value: '10 Lakh+', key: 'guests' },
  { value: '550+', key: 'tours' },
];

export default function AboutUs() {
  const { t } = useTranslation('about');

  return (
    <>
      <SeoHead />
      <Navbar />

      {/* Hero */}
      <div className="about-hero" style={{ backgroundImage: `url('${HERO_IMG}')` }}>
        <div className="about-hero-overlay">
          <div className="slide-tag">{t('hero.tag')}</div>
          <h1 className="about-hero-title">{t('hero.title')}</h1>
          <p className="about-hero-sub">{t('hero.subtitle')}</p>
        </div>
      </div>

      {/* Stats strip */}
      <div className="about-stats">
        {STATS.map(s => (
          <div key={s.key} className="about-stat">
            <div className="about-stat-n">{s.value}</div>
            <div className="about-stat-l">{t(`../../locales/en/home.json:stats.${s.key}`, { defaultValue: s.key })}</div>
          </div>
        ))}
      </div>

      {/* Our Story */}
      <div className="about-section">
        <div className="wrap about-two-col">
          <div className="about-text">
            <div className="tag">{t('story.tag')}</div>
            <h2 className="h2">{t('story.title')}</h2>
            <p>{t('story.p1')}</p>
            <p>{t('story.p2')}</p>
            <p>{t('story.p3')}</p>
          </div>
          <div className="about-img-wrap">
            <img
              src="https://tap.kesariselect.com/public/cms/whyindia/1730376933.jpg"
              alt="KeSARi Inbound team"
              className="about-img"
            />
          </div>
        </div>
      </div>

      {/* Mission */}
      <div className="about-mission">
        <div className="wrap">
          <div className="tag" style={{ color: 'var(--yellow)' }}>{t('mission.tag')}</div>
          <h2 className="h2" style={{ color: '#fff' }}>{t('mission.title')}</h2>
          <p className="about-mission-body">{t('mission.body')}</p>
        </div>
      </div>

      {/* Pillars */}
      <div className="about-section">
        <div className="wrap">
          <div className="about-pillars">
            {(t('pillars', { returnObjects: true }) || []).map((p, i) => (
              <div key={i} className="about-pillar fade-up" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="about-pillar-icon">{p.icon}</div>
                <div className="about-pillar-title">{p.title}</div>
                <div className="about-pillar-desc">{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="about-contact">
        <div className="wrap">
          <div className="tag">{t('contact.tag')}</div>
          <h2 className="h2">{t('contact.title')}</h2>
          <div className="about-contact-grid">
            <div className="about-contact-info">
              <p>📍 {t('contact.address').split('\n').map((l, i) => <span key={i}>{l}<br /></span>)}</p>
              <p>📞 <a href="tel:+912266666666">{t('contact.phone')}</a></p>
              <p>✉️ <a href={`mailto:${t('contact.email')}`}>{t('contact.email')}</a></p>
            </div>
            <iframe
              className="enq-map"
              src="https://maps.google.com/maps?q=Kohinoor+Square,+Shivaji+Park,+Mumbai,+Maharashtra+400028,+India&output=embed&z=16"
              allowFullScreen
              loading="lazy"
              title="KeSARi Inbound Office"
            />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
