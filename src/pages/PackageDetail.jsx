import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PACKAGES } from '../data/packages';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BookingModal from '../components/BookingModal';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function PackageDetail() {
  const { code } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(['tours', 'common']);
  const isEs = i18n.language === 'es-ES';
  const [modalPkg, setModalPkg] = useState(null);

  const pkg = PACKAGES.find(p => p.code === code);

  function goBack() {
    navigate(isEs ? '/es' : '/');
  }

  function openEnquiry() {
    document.querySelector('#pkg-enquiry')?.scrollIntoView({ behavior: 'smooth' });
  }

  if (!pkg) {
    return (
      <div style={{ padding: '120px 40px', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--navy)', marginBottom: 16 }}>
          {isEs ? 'Paquete no encontrado' : 'Package not found'}
        </h2>
        <button className="btn-red" onClick={goBack}>
          ← {isEs ? 'Volver a Tours' : 'Back to Tours'}
        </button>
      </div>
    );
  }

  const name = t(`tours:pkgNames.${pkg.code}`, { defaultValue: pkg.name });
  const theme = t(`tours:themes.${pkg.theme}`, { defaultValue: pkg.theme });
  const tags = pkg.tags.split(',').map(s => s.trim());

  return (
    <>
      <Navbar onEnquire={openEnquiry} />
      <LanguageSwitcher />

      {/* Hero */}
      <div className="pd-hero" style={{ backgroundImage: `url('${pkg.img}')` }}>
        <div className="pd-hero-overlay">
          <button className="pd-back" onClick={goBack}>
            ← {isEs ? 'Volver a Tours' : 'Back to Tours'}
          </button>
          <span className="pd-badge">{theme}</span>
          <h1 className="pd-title">{name}</h1>
          <div className="pd-meta">
            <span>📅 {pkg.days} {isEs ? 'Días' : 'Days'} / {pkg.nights} {isEs ? 'Noches' : 'Nights'}</span>
            <span>📍 {pkg.places}</span>
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
          <span className="pd-strip-label">{isEs ? 'Código de Paquete' : 'Package Code'}</span>
          <span className="pd-strip-val">{pkg.code}</span>
        </div>
        <div className="pd-strip-item">
          <span className="pd-strip-label">{isEs ? 'Duración' : 'Duration'}</span>
          <span className="pd-strip-val">{pkg.days}D / {pkg.nights}N</span>
        </div>
        <div className="pd-strip-item">
          <span className="pd-strip-label">{isEs ? 'Temática' : 'Theme'}</span>
          <span className="pd-strip-val">{theme}</span>
        </div>
        <div className="pd-strip-item">
          <span className="pd-strip-label">{isEs ? 'Etiquetas' : 'Tags'}</span>
          <span className="pd-strip-val">{tags.join(' · ')}</span>
        </div>
      </div>

      {/* Body */}
      <div className="pd-body sec">
        <div className="wrap pd-grid">
          <div className="pd-left">
            <h2>{isEs ? 'Descripción del Tour' : 'Tour Overview'}</h2>
            <p className="pd-places">
              <strong>{isEs ? 'Lugares Cubiertos:' : 'Places Covered:'}</strong><br />
              {pkg.places}
            </p>
            <div className="pd-tags-list">
              {tags.map(tag => (
                <span key={tag} className="pkg-tag">{tag}</span>
              ))}
            </div>

            <h3>{isEs ? 'Destacados' : 'Tour Highlights'}</h3>
            <ul className="pd-highlights">
              <li>{isEs ? 'Alojamiento en hoteles de lujo seleccionados' : 'Hand-picked luxury hotel accommodation'}</li>
              <li>{isEs ? 'Transporte en vehículo privado con aire acondicionado' : 'Private air-conditioned vehicle transfers'}</li>
              <li>{isEs ? 'Guía turístico experto en español e inglés' : 'Expert English & Spanish-speaking tour guide'}</li>
              <li>{isEs ? 'Todas las entradas y visitas incluidas' : 'All entry fees and sightseeing included'}</li>
              <li>{isEs ? 'Asistencia 24/7 durante el viaje' : '24/7 in-trip assistance'}</li>
            </ul>
          </div>

          <div className="pd-right">
            <div className="pd-cta-box" id="pkg-enquiry">
              <h3>{isEs ? 'Solicitar Información' : 'Request Information'}</h3>
              <p>{isEs ? 'Nuestro experto de viajes te contactará en 24 horas.' : 'Our travel expert will contact you within 24 hours.'}</p>
              <PdEnquiryForm pkgName={name} isEs={isEs} />
            </div>
          </div>
        </div>
      </div>

      <Footer />
      {modalPkg && <BookingModal pkgName={modalPkg} onClose={() => setModalPkg(null)} />}
    </>
  );
}

function PdEnquiryForm({ pkgName, isEs }) {
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
        <h4>{isEs ? '¡Consulta Enviada!' : 'Enquiry Sent!'}</h4>
        <p>{isEs ? 'Te contactaremos en 24 horas.' : 'We will contact you within 24 hours.'}</p>
      </div>
    );
  }

  return (
    <form className="pd-form" onSubmit={handleSubmit}>
      <input
        required
        type="text"
        placeholder={isEs ? 'Nombre completo *' : 'Full Name *'}
        value={form.name}
        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
      />
      <input
        required
        type="email"
        placeholder={isEs ? 'Correo electrónico *' : 'Email *'}
        value={form.email}
        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
      />
      <input
        required
        type="tel"
        placeholder={isEs ? 'Teléfono *' : 'Phone *'}
        value={form.phone}
        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
      />
      <input
        type="text"
        readOnly
        value={pkgName}
        style={{ background: '#f5f5f5', color: '#666' }}
      />
      <textarea
        rows={3}
        placeholder={isEs ? 'Mensaje o solicitudes especiales…' : 'Message or special requests…'}
        value={form.message}
        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
      />
      <button type="submit" className="btn-red" style={{ width: '100%' }}>
        {isEs ? 'Enviar Consulta →' : 'Send Enquiry →'}
      </button>
    </form>
  );
}
