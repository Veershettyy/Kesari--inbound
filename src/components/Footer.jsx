import { useTranslation } from 'react-i18next';

const DEST_SEARCHES = ['Rajasthan', 'Kerala', 'Himachal Pradesh', 'Goa', 'Ladakh', 'North East'];
const THEME_FILTERS = ['wildlife', 'historic', 'spiritual', 'luxuryTrain', 'ayurveda'];
const COMPANY_URLS  = [
  'https://inbound.kesariselect.com',
  '#enquiry',
  'https://inbound.kesariselect.com/privacy-policy',
  'https://inbound.kesariselect.com/terms-and-conditions',
  'https://kesariselect.com',
];

export default function Footer({ onSearch, onViewTheme }) {
  const { t } = useTranslation('footer');
  const destLinks    = t('destinations.links', { returnObjects: true });
  const themeLinks   = t('themes.links',       { returnObjects: true });
  const companyLinks = t('company.links',      { returnObjects: true });

  function handleDest(e, term) {
    e.preventDefault();
    onSearch?.(term);
    document.querySelector('#packages')?.scrollIntoView({ behavior: 'smooth' });
  }

  function handleTheme(e, filterKey) {
    e.preventDefault();
    onViewTheme?.(filterKey);
    document.querySelector('#packages')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <footer>
      <div className="ft-grid">
        <div className="ft-brand">
          <div className="logo-main">{t('brand.name')} <span style={{ color: 'var(--red)' }}>{t('brand.nameHighlight')}</span></div>
          <p>{t('brand.desc')}</p>
        </div>
        <div className="ft-col">
          <h4>{t('destinations.heading')}</h4>
          {destLinks.map((l, i) => (
            <a key={i} href="#packages" onClick={e => handleDest(e, DEST_SEARCHES[i])}>{l}</a>
          ))}
        </div>
        <div className="ft-col">
          <h4>{t('themes.heading')}</h4>
          {themeLinks.map((l, i) => (
            <a key={i} href="#packages" onClick={e => handleTheme(e, THEME_FILTERS[i])}>{l}</a>
          ))}
        </div>
        <div className="ft-col">
          <h4>{t('company.heading')}</h4>
          {companyLinks.map((l, i) => (
            <a key={i} href={COMPANY_URLS[i]} target={COMPANY_URLS[i].startsWith('http') ? '_blank' : undefined} rel="noreferrer">{l}</a>
          ))}
        </div>
      </div>
      <div className="ft-bottom">{t('copyright')}</div>
    </footer>
  );
}
