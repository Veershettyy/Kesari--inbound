import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

const BASE_URL = 'https://inbound.kesariselect.com';

export default function SeoHead() {
  const { t, i18n } = useTranslation('seo');
  const isEs = i18n.language === 'es-ES';

  return (
    <Helmet>
      <html lang={isEs ? 'es-ES' : 'en'} />
      <title>{t('home.title')}</title>
      <meta name="description" content={t('home.description')} />
      <link rel="alternate" hrefLang="en" href={`${BASE_URL}/`} />
      <link rel="alternate" hrefLang="es-ES" href={`${BASE_URL}/es-es`} />
      <link rel="alternate" hrefLang="x-default" href={`${BASE_URL}/`} />
    </Helmet>
  );
}
