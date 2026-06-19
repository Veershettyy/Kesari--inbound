import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

const SITE_URL = 'https://kesari-inbound.netlify.app/INT';

export default function SeoHead() {
  const { t, i18n } = useTranslation('seo');
  const isEs = i18n.language === 'es-ES';

  return (
    <Helmet>
      <html lang={isEs ? 'es-ES' : 'en'} />
      <title>{t('home.title')}</title>
      <meta name="description" content={t('home.description')} />
      <link rel="alternate" hrefLang="en" href={`${SITE_URL}/`} />
      <link rel="alternate" hrefLang="es-ES" href={`${SITE_URL}/es`} />
      <link rel="alternate" hrefLang="x-default" href={`${SITE_URL}/`} />
    </Helmet>
  );
}
