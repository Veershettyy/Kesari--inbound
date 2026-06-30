import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PACKAGES } from '../data/packages';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BookingModal from '../components/BookingModal';

function ItinerarySection({ code }) {
  const { t } = useTranslation('tours');
  const [openDay, setOpenDay] = useState(0);

  const itin = t(`tours:itineraries.${code}`, { returnObjects: true });
  if (!itin || typeof itin !== 'object' || !itin.days) return null;

  return (
    <div style={{ marginTop: 36 }}>
      <h3 style={{ color: 'var(--navy)', fontSize: 20, marginBottom: 8 }}>
        {t('tours:detail.dayByDay')}
      </h3>
      <p style={{ color: '#666', fontSize: 13, marginBottom: 20, lineHeight: 1.6 }}>
        {itin.overview}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {itin.days.map((day, i) => (
          <div key={i} style={{ border: '1px solid #e8e8e8', borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,.05)' }}>
            <button
              onClick={() => setOpenDay(openDay === i ? -1 : i)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 18px', background: openDay === i ? 'var(--navy)' : '#fff',
                border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background .2s'
              }}
            >
              <span style={{
                minWidth: 36, height: 36, borderRadius: '50%', display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontWeight: 900,
                fontSize: 13, background: openDay === i ? 'var(--red)' : 'var(--navy)',
                color: '#fff', flexShrink: 0
              }}>
                {day.day}
              </span>
              <span style={{
                fontWeight: 700, fontSize: 14,
                color: openDay === i ? '#fff' : 'var(--navy)', flex: 1
              }}>
                {day.title}
              </span>
              <span style={{ color: openDay === i ? 'rgba(255,255,255,.6)' : '#aaa', fontSize: 18 }}>
                {openDay === i ? '▲' : '▼'}
              </span>
            </button>
            {openDay === i && (
              <div style={{ padding: '16px 20px 18px 68px', background: '#fafafa', borderTop: '1px solid #eee' }}>
                <p style={{ color: '#444', fontSize: 13, lineHeight: 1.75 }}>{day.description}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PackageDetail() {
  const { code } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(['tours', 'common']);
  const [modalPkg, setModalPkg] = useState(null);

  const lang = i18n.language;
  const langSlug = lang === 'en' ? '' : (lang === 'es-ES' ? 'es' : lang);
  const basePath = langSlug ? `/INT/${langSlug}` : '/INT';

  function goBack() {
    navigate(basePath);
  }

  function openEnquiry() {
    document.querySelector('#pkg-enquiry')?.scrollIntoView({ behavior: 'smooth' });
  }

  const pkg = PACKAGES.find(p => p.code === code);

  if (!pkg) {
    return (
      <div style={{ padding: '120px 40px', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--navy)', marginBottom: 16 }}>
          {t('tours:detail.packageNotFound')}
        </h2>
        <button className="btn-red" onClick={goBack}>
          ← {t('tours:detail.backToTours')}
        </button>
      </div>
    );
  }

  const name  = t(`tours:pkgNames.${pkg.code}`, { defaultValue: pkg.name });
  const THEME_FILTER_KEY = {'first-timers':'firstTimers','historic':'historic','family':'family','nature':'nature','luxury-train':'luxuryTrain','ayurveda-and-wellness':'ayurveda','spiritual':'spiritual','adventure':'adventure','luxury':'luxury','wildlife':'wildlife'};
  const themeKey = (raw) => raw.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'');
  const theme = t(`tours:packages.filters.${THEME_FILTER_KEY[themeKey(pkg.theme)] ?? themeKey(pkg.theme)}`, { defaultValue: pkg.theme });
  const tags  = pkg.tags.split(',').map(s => s.trim());

  return (
    <>
      <Navbar onEnquire={openEnquiry} />

      {/* Hero */}
      <div className="pd-hero" style={{ backgroundImage: `url('${pkg.img}')` }}>
        <div className="pd-hero-overlay">
          <button className="pd-back" onClick={goBack}>
            ← {t('tours:detail.backToTours')}
          </button>
          <span className="pd-badge">{theme}</span>
          <h1 className="pd-title">{name}</h1>
          <div className="pd-meta">
            <span>📅 {pkg.days} {t('tours:detail.days')} / {pkg.nights} {t('tours:detail.nights')}</span>
            <span>📍 {t(`tours:pkgPlaces.${pkg.code}`, { defaultValue: pkg.places })}</span>
          </div>
          <div className="pd-actions">
            <button className="btn-red" onClick={openEnquiry}>
              {t('common:header.enquireNow')}
            </button>
            <button className="btn-outline-white" onClick={() => setModalPkg(name)}>
              {t('common:buttons.bookYourTrip')}
            </button>
          </div>
        </div>
      </div>

      {/* Info strip */}
      <div className="pd-strip">
        <div className="pd-strip-item">
          <span className="pd-strip-label">{t('tours:detail.packageCode')}</span>
          <span className="pd-strip-val">{pkg.code}</span>
        </div>
        <div className="pd-strip-item">
          <span className="pd-strip-label">{t('tours:detail.duration')}</span>
          <span className="pd-strip-val">{pkg.days}D / {pkg.nights}N</span>
        </div>
        <div className="pd-strip-item">
          <span className="pd-strip-label">{t('tours:detail.theme')}</span>
          <span className="pd-strip-val">{theme}</span>
        </div>
        <div className="pd-strip-item">
          <span className="pd-strip-label">{t('tours:detail.tags')}</span>
          <span className="pd-strip-val">{tags.join(' · ')}</span>
        </div>
      </div>

      {/* Body */}
      <div className="pd-body sec">
        <div className="wrap pd-grid">
          <div className="pd-left">
            <h2>{t('tours:detail.tourOverview')}</h2>
            <p className="pd-places">
              <strong>{t('tours:detail.placesCovered')}</strong><br />
              {t(`tours:pkgPlaces.${pkg.code}`, { defaultValue: pkg.places })}
            </p>
            <div className="pd-tags-list">
              {tags.map(tag => (
                <span key={tag} className="pkg-tag">{tag}</span>
              ))}
            </div>

            <h3>{t('tours:detail.tourHighlights')}</h3>
            <ul className="pd-highlights">
              <li>{t('tours:detail.highlights.hotel')}</li>
              <li>{t('tours:detail.highlights.transport')}</li>
              <li>{t('tours:detail.highlights.guide')}</li>
              <li>{t('tours:detail.highlights.entry')}</li>
              <li>{t('tours:detail.highlights.support')}</li>
            </ul>

            <ItinerarySection code={pkg.code} />
          </div>

          <div className="pd-right">
            <div className="pd-cta-box" id="pkg-enquiry">
              <h3>{t('tours:detail.requestInfo')}</h3>
              <p>{t('tours:detail.contactNote')}</p>
              <PdEnquiryForm pkgName={name} />
            </div>
          </div>
        </div>
      </div>

      <Footer />
      {modalPkg && <BookingModal pkgName={modalPkg} onClose={() => setModalPkg(null)} />}
    </>
  );
}

function PdEnquiryForm({ pkgName }) {
  const { t } = useTranslation('tours');
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

  function handleSubmit(e) {
    e.preventDefault();
    setSent(true);
  }

  if (sent) {
    return (
      <div className="pd-success">
        <div style={{ fontSize: 40 }}>✓</div>
        <h4>{t('tours:detail.form.successTitle')}</h4>
        <p>{t('tours:detail.form.successMessage')}</p>
      </div>
    );
  }

  return (
    <form className="pd-form" onSubmit={handleSubmit}>
      <input
        required type="text"
        placeholder={t('tours:detail.form.fullName')}
        value={form.name}
        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
      />
      <input
        required type="email"
        placeholder={t('tours:detail.form.email')}
        value={form.email}
        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
      />
      <input
        required type="tel"
        placeholder={t('tours:detail.form.phone')}
        value={form.phone}
        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
      />
      <input
        type="text" readOnly value={pkgName}
        style={{ background: '#f5f5f5', color: '#666' }}
      />
      <textarea
        rows={3}
        placeholder={t('tours:detail.form.message')}
        value={form.message}
        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
      />
      <button type="submit" className="btn-red" style={{ width: '100%' }}>
        {t('tours:detail.form.submit')}
      </button>
    </form>
  );
}
