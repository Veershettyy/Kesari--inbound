import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enCommon from './locales/en/common.json';
import enHome from './locales/en/home.json';
import enTours from './locales/en/tours.json';
import enSeo from './locales/en/seo.json';
import enFooter from './locales/en/footer.json';

import esCommon from './locales/es-es/common.json';
import esHome from './locales/es-es/home.json';
import esTours from './locales/es-es/tours.json';
import esSeo from './locales/es-es/seo.json';
import esFooter from './locales/es-es/footer.json';

const lang = window.location.pathname.startsWith('/INT/es') ? 'es-ES' : 'en';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      common: enCommon,
      home:   enHome,
      tours:  enTours,
      seo:    enSeo,
      footer: enFooter,
    },
    'es-ES': {
      common: esCommon,
      home:   esHome,
      tours:  esTours,
      seo:    esSeo,
      footer: esFooter,
    },
  },
  lng: lang,
  fallbackLng: 'en',
  defaultNS: 'common',
  ns: ['common', 'home', 'tours', 'seo', 'footer'],
  interpolation: { escapeValue: false },
  initImmediate: false,   // forces sync init — language is set before first render
  react: { useSuspense: false },
});

export default i18n;
