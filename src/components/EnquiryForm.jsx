import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const DESTS = ['Rajasthan','Kerala','Himachal Pradesh','Jammu & Kashmir','Leh & Ladakh','Goa','North East India','Andaman & Nicobar','Uttarakhand','Gujarat','Madhya Pradesh','Karnataka','Tamil Nadu','Odisha','Other'];
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function EnquiryForm() {
  const { t, i18n } = useTranslation(['home','common']);
  const formRef = useRef(null);
  const f = t('enquiry.form', { ns: 'home', returnObjects: true });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const data = new FormData(formRef.current);
    const body = {
      fullName:    data.get('fullName'),
      phone:       data.get('phone'),
      email:       data.get('email'),
      nationality: data.get('country'),
      travelDate:  data.get('month'),
      travellers:  data.get('travellers'),
      duration:    data.get('duration'),
      message:     data.get('message'),
      language:    i18n.language === 'es-ES' ? 'es' : i18n.language,
    };
    setSubmitting(true);
    try {
      await fetch(`${API_URL}/api/enquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      setDone(true);
      formRef.current.reset();
    } catch {
      alert('Submission failed. Please try again.');
    }
    setSubmitting(false);
  }

  return (
    <div id="enquiry" className="enq-section">
      <div className="enq-inner">
        <div className="enq-left">
          <div className="tag">{t('home:enquiry.tag')}</div>
          <h2 className="h2">
            {t('home:enquiry.title')}<br />
            <span className="hl">{t('home:enquiry.titleHighlight')}</span>
          </h2>
          <p>{t('home:enquiry.desc1')}</p>
          <div className="enq-info">
            <p>{t('home:enquiry.callUs')} <strong>{t('home:enquiry.callPhone')}</strong></p>
            <p>{t('home:enquiry.email')} <strong>{t('home:enquiry.emailAddr')}</strong></p>
            <p>{t('home:enquiry.responseTime')} <strong>{t('home:enquiry.responseValue')}</strong></p>
            <p>{t('home:enquiry.confidential')}</p>
          </div>
          <div className="enq-address">
            <span className="enq-pin">📍</span>
            <span>3105, Kohinoor Square, 31st Floor, N.C. Kelkar Marg,<br />Shivaji Park, Mumbai – 400028</span>
          </div>
          <iframe
            className="enq-map"
            src="https://maps.google.com/maps?q=Kohinoor+Square,+Shivaji+Park,+Mumbai,+Maharashtra+400028,+India&output=embed&z=16"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="KeSARi Inbound Office Location"
          />
        </div>
        <div className="enq-right">
          {done ? (
            <div style={{ textAlign:'center', padding:'60px 20px' }}>
              <div style={{ fontSize:48 }}>✅</div>
              <h3 style={{ marginTop:16, color:'#1a1a4e' }}>{t('home:enquiry.successTitle') || 'Thank You!'}</h3>
              <p style={{ color:'#555', marginTop:8 }}>{t('home:enquiry.successMsg') || 'Our team will contact you within 24 hours.'}</p>
              <button className="btn-submit" style={{ marginTop:20 }} onClick={() => setDone(false)}>
                {t('home:enquiry.newEnquiry') || 'Submit Another Enquiry'}
              </button>
            </div>
          ) : (
          <form ref={formRef} onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="fg">
                <label>{f.fullName}</label>
                <input name="fullName" type="text" placeholder={f.fullNamePlaceholder} required />
              </div>
              <div className="fg">
                <label>{f.contactNumber}</label>
                <input name="phone" type="tel" placeholder={f.contactPlaceholder} required />
              </div>
              <div className="fg">
                <label>{f.emailAddress}</label>
                <input name="email" type="email" placeholder={f.emailPlaceholder} />
              </div>
              <div className="fg">
                <label>{f.country}</label>
                <input name="country" type="text" placeholder={f.countryPlaceholder} />
              </div>
              <div className="fg">
                <label>{f.destination}</label>
                <select name="destination">
                  <option value="">{f.destinationDefault}</option>
                  {DESTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="fg">
                <label>{f.travelMonth}</label>
                <select name="month">
                  <option value="">{f.monthDefault}</option>
                  {f.months.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div className="fg">
                <label>{f.travellers}</label>
                <select name="travellers">
                  {f.travellersOptions.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="fg">
                <label>{f.duration}</label>
                <select name="duration">
                  {f.durations.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="fg full">
                <label>{f.dreamTrip}</label>
                <textarea name="message" placeholder={f.dreamTripPlaceholder} />
              </div>
              <button className="btn-submit" type="submit" disabled={submitting}>
                {submitting ? '...' : t('common:buttons.sendEnquiry')}
              </button>
            </div>
          </form>
          )}
        </div>
      </div>
    </div>
  );
}
