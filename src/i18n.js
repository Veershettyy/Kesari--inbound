import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enCommon from './locales/en/common.json';
import enHome from './locales/en/home.json';
import enTours from './locales/en/tours.json';
import enSeo from './locales/en/seo.json';
import enFooter from './locales/en/footer.json';
import enAbout from './locales/en/about.json';
import enBlog from './locales/en/blog.json';

import esCommon from './locales/es-es/common.json';
import esHome from './locales/es-es/home.json';
import esTours from './locales/es-es/tours.json';
import esSeo from './locales/es-es/seo.json';
import esFooter from './locales/es-es/footer.json';
import esAbout from './locales/es-es/about.json';
import esBlog from './locales/es-es/blog.json';

import frCommon from './locales/fr/common.json';
import frHome from './locales/fr/home.json';
import frTours from './locales/fr/tours.json';
import frSeo from './locales/fr/seo.json';
import frFooter from './locales/fr/footer.json';
import frAbout from './locales/fr/about.json';
import frBlog from './locales/fr/blog.json';

import hiCommon from './locales/hi/common.json';
import hiHome from './locales/hi/home.json';
import hiTours from './locales/hi/tours.json';
import hiSeo from './locales/hi/seo.json';
import hiFooter from './locales/hi/footer.json';
import hiAbout from './locales/hi/about.json';
import hiBlog from './locales/hi/blog.json';

import deCommon from './locales/de/common.json';
import deHome from './locales/de/home.json';
import deTours from './locales/de/tours.json';
import deSeo from './locales/de/seo.json';
import deFooter from './locales/de/footer.json';
import deAbout from './locales/de/about.json';
import deBlog from './locales/de/blog.json';

import jaCommon from './locales/ja/common.json';
import jaHome from './locales/ja/home.json';
import jaTours from './locales/ja/tours.json';
import jaSeo from './locales/ja/seo.json';
import jaFooter from './locales/ja/footer.json';
import jaAbout from './locales/ja/about.json';
import jaBlog from './locales/ja/blog.json';

import ptCommon from './locales/pt/common.json';
import ptHome from './locales/pt/home.json';
import ptTours from './locales/pt/tours.json';
import ptSeo from './locales/pt/seo.json';
import ptFooter from './locales/pt/footer.json';
import ptAbout from './locales/pt/about.json';
import ptBlog from './locales/pt/blog.json';

import itCommon from './locales/it/common.json';
import itHome from './locales/it/home.json';
import itTours from './locales/it/tours.json';
import itSeo from './locales/it/seo.json';
import itFooter from './locales/it/footer.json';
import itAbout from './locales/it/about.json';
import itBlog from './locales/it/blog.json';

import zhCommon from './locales/zh/common.json';
import zhHome from './locales/zh/home.json';
import zhTours from './locales/zh/tours.json';
import zhSeo from './locales/zh/seo.json';
import zhFooter from './locales/zh/footer.json';
import zhAbout from './locales/zh/about.json';
import zhBlog from './locales/zh/blog.json';

import arCommon from './locales/ar/common.json';
import arHome from './locales/ar/home.json';
import arTours from './locales/ar/tours.json';
import arSeo from './locales/ar/seo.json';
import arFooter from './locales/ar/footer.json';
import arAbout from './locales/ar/about.json';
import arBlog from './locales/ar/blog.json';

import koCommon from './locales/ko/common.json';
import koHome from './locales/ko/home.json';
import koTours from './locales/ko/tours.json';
import koSeo from './locales/ko/seo.json';
import koFooter from './locales/ko/footer.json';
import koAbout from './locales/ko/about.json';
import koBlog from './locales/ko/blog.json';

import mlCommon from './locales/ml/common.json';
import mlHome from './locales/ml/home.json';
import mlTours from './locales/ml/tours.json';
import mlSeo from './locales/ml/seo.json';
import mlFooter from './locales/ml/footer.json';
import mlAbout from './locales/ml/about.json';
import mlBlog from './locales/ml/blog.json';

import plCommon from './locales/pl/common.json';
import plHome from './locales/pl/home.json';
import plTours from './locales/pl/tours.json';
import plSeo from './locales/pl/seo.json';
import plFooter from './locales/pl/footer.json';
import plAbout from './locales/pl/about.json';
import plBlog from './locales/pl/blog.json';

const p = window.location.pathname;
const m = p.match(/^\/INT\/([^/]+)/);
const seg = m ? m[1].toLowerCase() : '';
const PATH_SEGS = new Set(['explore', 'destinations', 'packages', 'search', 'product-details', 'about', 'blog']);
const rawLang = (m && !PATH_SEGS.has(seg)) ? m[1].toLowerCase() : null;

const langMap = { es: 'es-ES', 'es-es': 'es-ES', fr: 'fr', hi: 'hi', de: 'de', ja: 'ja', pt: 'pt', it: 'it', zh: 'zh', ar: 'ar', ko: 'ko', ml: 'ml', pl: 'pl' };
const initialLang = (p.startsWith('/INT/es') || p.startsWith('/es-es'))
  ? 'es-ES'
  : (rawLang && langMap[rawLang]) || 'en';

i18n.use(initReactI18next).init({
  resources: {
    en:      { common: enCommon, home: enHome, tours: enTours, seo: enSeo, footer: enFooter, about: enAbout, blog: enBlog },
    'es-ES': { common: esCommon, home: esHome, tours: esTours, seo: esSeo, footer: esFooter, about: esAbout, blog: esBlog },
    fr:      { common: frCommon, home: frHome, tours: frTours, seo: frSeo, footer: frFooter, about: frAbout, blog: frBlog },
    hi:      { common: hiCommon, home: hiHome, tours: hiTours, seo: hiSeo, footer: hiFooter, about: hiAbout, blog: hiBlog },
    de:      { common: deCommon, home: deHome, tours: deTours, seo: deSeo, footer: deFooter, about: deAbout, blog: deBlog },
    ja:      { common: jaCommon, home: jaHome, tours: jaTours, seo: jaSeo, footer: jaFooter, about: jaAbout, blog: jaBlog },
    pt:      { common: ptCommon, home: ptHome, tours: ptTours, seo: ptSeo, footer: ptFooter, about: ptAbout, blog: ptBlog },
    it:      { common: itCommon, home: itHome, tours: itTours, seo: itSeo, footer: itFooter, about: itAbout, blog: itBlog },
    zh:      { common: zhCommon, home: zhHome, tours: zhTours, seo: zhSeo, footer: zhFooter, about: zhAbout, blog: zhBlog },
    ar:      { common: arCommon, home: arHome, tours: arTours, seo: arSeo, footer: arFooter, about: arAbout, blog: arBlog },
    ko:      { common: koCommon, home: koHome, tours: koTours, seo: koSeo, footer: koFooter, about: koAbout, blog: koBlog },
    ml:      { common: mlCommon, home: mlHome, tours: mlTours, seo: mlSeo, footer: mlFooter, about: mlAbout, blog: mlBlog },
    pl:      { common: plCommon, home: plHome, tours: plTours, seo: plSeo, footer: plFooter, about: plAbout, blog: plBlog },
  },
  lng: initialLang,
  fallbackLng: 'en',
  defaultNS: 'common',
  ns: ['common', 'home', 'tours', 'seo', 'footer', 'about', 'blog'],
  interpolation: { escapeValue: false },
  initImmediate: false,
  react: {
    useSuspense: false,
    bindI18n: 'languageChanged loaded',
    bindI18nStore: 'added removed',
  },
});

export default i18n;
