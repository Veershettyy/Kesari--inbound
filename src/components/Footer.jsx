import { useTranslation } from 'react-i18next';
import useLocalizedUrl from '../hooks/useLocalizedUrl';

const BASE = 'https://inbound.kesariselect.com';
const DEST_URLS = [
  '/explore/india/north-india/rajasthan',
  '/explore/india/south-india/kerala',
  '/explore/india/north-india/himachal-pradesh',
  '/explore/india/west-india/goa',
  '/explore/india/north-india/leh-and-ladakh',
  '/explore/india/east-india/north-east',
];
const THEME_URLS = [
  '/explore/theme/nature',
  '/explore/theme/historic',
  '/explore/theme/spiritual',
  '/explore/theme/luxury-train',
  '/explore/theme/ayurveda-and-wellness',
];
const COMPANY_URLS = [BASE, '#enquiry', BASE, BASE, 'https://kesariselect.com'];

export default function Footer() {
  const { t } = useTranslation('footer');
  const localizeUrl = useLocalizedUrl();
  const destLinks = t('destinations.links', { returnObjects: true });
  const themeLinks = t('themes.links', { returnObjects: true });
  const companyLinks = t('company.links', { returnObjects: true });

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
            <a key={i} href={localizeUrl(BASE + DEST_URLS[i])} target="_blank" rel="noreferrer">{l}</a>
          ))}
        </div>
        <div className="ft-col">
          <h4>{t('themes.heading')}</h4>
          {themeLinks.map((l, i) => (
            <a key={i} href={localizeUrl(BASE + THEME_URLS[i])} target="_blank" rel="noreferrer">{l}</a>
          ))}
        </div>
        <div className="ft-col">
          <h4>{t('company.heading')}</h4>
          {companyLinks.map((l, i) => (
            <a key={i} href={localizeUrl(COMPANY_URLS[i])} target={COMPANY_URLS[i].startsWith('http') ? '_blank' : undefined} rel="noreferrer">{l}</a>
          ))}
        </div>
      </div>
      <div className="ft-bottom">{t('copyright')}</div>
    </footer>
  );
}
