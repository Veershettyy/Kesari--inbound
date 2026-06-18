import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

const DESTS = ['Rajasthan','Kerala','Himachal Pradesh','Jammu & Kashmir','Leh & Ladakh','Goa','North East India','Andaman & Nicobar','Uttarakhand','Gujarat','Madhya Pradesh','Karnataka','Tamil Nadu','Odisha','Other'];

export default function EnquiryForm() {
  const { t } = useTranslation(['home','common']);
  const formRef = useRef(null);
  const f = t('enquiry.form', { ns: 'home', returnObjects: true });

  function handleSubmit(e) {
    e.preventDefault();
    alert('Thank you! Our team will reach out to you within 24 hours.');
    formRef.current.reset();
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
        </div>
        <div className="enq-right">
          <form ref={formRef} onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="fg">
                <label>{f.fullName}</label>
                <input type="text" placeholder={f.fullNamePlaceholder} required />
              </div>
              <div className="fg">
                <label>{f.contactNumber}</label>
                <input type="tel" placeholder={f.contactPlaceholder} required />
              </div>
              <div className="fg">
                <label>{f.emailAddress}</label>
                <input type="email" placeholder={f.emailPlaceholder} />
              </div>
              <div className="fg">
                <label>{f.country}</label>
                <input type="text" placeholder={f.countryPlaceholder} />
              </div>
              <div className="fg">
                <label>{f.destination}</label>
                <select>
                  <option value="">{f.destinationDefault}</option>
                  {DESTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="fg">
                <label>{f.travelMonth}</label>
                <select>
                  <option value="">{f.monthDefault}</option>
                  {f.months.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div className="fg">
                <label>{f.travellers}</label>
                <select>
                  {f.travellersOptions.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="fg">
                <label>{f.duration}</label>
                <select>
                  {f.durations.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="fg full">
                <label>{f.dreamTrip}</label>
                <textarea placeholder={f.dreamTripPlaceholder} />
              </div>
              <button className="btn-submit" type="submit">
                {t('common:buttons.sendEnquiry')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
