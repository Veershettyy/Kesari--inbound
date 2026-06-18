import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function BookingModal({ pkgName, onClose }) {
  const { t } = useTranslation(['tours','common']);
  const [submitted, setSubmitted] = useState(false);
  const f = t('tours:modal.form', { returnObjects: true });

  useEffect(() => setSubmitted(false), [pkgName]);

  if (!pkgName) return null;

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
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
            <form className="m-form-grid" onSubmit={handleSubmit}>
              <div className="m-fg">
                <label>{f.fullName}</label>
                <input type="text" placeholder={f.fullNamePlaceholder} required />
              </div>
              <div className="m-fg">
                <label>{f.email}</label>
                <input type="email" placeholder={f.emailPlaceholder} required />
              </div>
              <div className="m-fg">
                <label>{f.phone}</label>
                <input type="tel" placeholder={f.phonePlaceholder} required />
              </div>
              <div className="m-fg">
                <label>{f.nationality}</label>
                <input type="text" placeholder={f.nationalityPlaceholder} />
              </div>
              <div className="m-fg">
                <label>{f.travelDate}</label>
                <input type="date" />
              </div>
              <div className="m-fg">
                <label>{f.travellers}</label>
                <select>
                  <option value="">{f.travellersDefault}</option>
                  {['1','2','3','4','5','6','7-10','10+'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="m-fg">
                <label>{f.duration}</label>
                <select>
                  <option value="">{f.durationDefault}</option>
                  {f.durationOptions.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="m-fg">
                <label>{f.budget}</label>
                <select>
                  <option value="">{f.budgetDefault}</option>
                  {f.budgetOptions.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="m-fg full">
                <label>{f.message}</label>
                <textarea placeholder={f.messagePlaceholder} />
              </div>
              <div className="m-fg full">
                <button className="modal-submit" type="submit">
                  {t('common:buttons.submitBooking')}
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
