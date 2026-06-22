import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function BookingModal({ pkgName, pkgCode, onClose }) {
  const { t, i18n } = useTranslation(['tours','common']);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef(null);
  const f = t('tours:modal.form', { returnObjects: true });

  useEffect(() => setSubmitted(false), [pkgName]);

  if (!pkgName) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    const data = new FormData(formRef.current);
    const body = {
      packageCode: pkgCode || '',
      packageName: pkgName,
      language:    i18n.language === 'es-ES' ? 'es' : i18n.language,
      fullName:    data.get('fullName'),
      email:       data.get('email'),
      phone:       data.get('phone'),
      nationality: data.get('nationality'),
      travelDate:  data.get('travelDate'),
      travellers:  data.get('travellers'),
      duration:    data.get('duration'),
      budget:      data.get('budget'),
      message:     data.get('message'),
    };
    setSubmitting(true);
    try {
      await fetch(`${API_URL}/api/enquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      setSubmitted(true);
    } catch {
      alert('Submission failed. Please try again.');
    }
    setSubmitting(false);
  }

  return (
    <div className="modal-overlay open" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-head">
          <div>
            <h3>{t('tours:modal.title')}</h3>
            <div className="modal-sub">{t('tours:modal.subtitle')}</div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="modal-pkg">📦 {pkgName}</div>
          {!submitted ? (
            <form ref={formRef} className="m-form-grid" onSubmit={handleSubmit}>
              <div className="m-fg">
                <label>{f.fullName}</label>
                <input name="fullName" type="text" placeholder={f.fullNamePlaceholder} required />
              </div>
              <div className="m-fg">
                <label>{f.email}</label>
                <input name="email" type="email" placeholder={f.emailPlaceholder} required />
              </div>
              <div className="m-fg">
                <label>{f.phone}</label>
                <input name="phone" type="tel" placeholder={f.phonePlaceholder} required />
              </div>
              <div className="m-fg">
                <label>{f.nationality}</label>
                <input name="nationality" type="text" placeholder={f.nationalityPlaceholder} />
              </div>
              <div className="m-fg">
                <label>{f.travelDate}</label>
                <input name="travelDate" type="date" />
              </div>
              <div className="m-fg">
                <label>{f.travellers}</label>
                <select name="travellers">
                  <option value="">{f.travellersDefault}</option>
                  {['1','2','3','4','5','6','7-10','10+'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="m-fg">
                <label>{f.duration}</label>
                <select name="duration">
                  <option value="">{f.durationDefault}</option>
                  {f.durationOptions.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="m-fg">
                <label>{f.budget}</label>
                <select name="budget">
                  <option value="">{f.budgetDefault}</option>
                  {f.budgetOptions.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="m-fg full">
                <label>{f.message}</label>
                <textarea name="message" placeholder={f.messagePlaceholder} />
              </div>
              <div className="m-fg full">
                <button className="modal-submit" type="submit" disabled={submitting}>
                  {submitting ? '...' : t('common:buttons.submitBooking')}
                </button>
              </div>
            </form>
          ) : (
            <div className="modal-success" style={{ display: 'block' }}>
              <div className="tick">✅</div>
              <h3>{t('tours:modal.success.title')}</h3>
              <p>{t('tours:modal.success.message')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
