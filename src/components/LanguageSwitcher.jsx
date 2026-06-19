import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation('common');

  const isEs = location.pathname.startsWith('/es');

  function switchTo(lang) {
    if (lang === 'es' && !isEs) {
      const rest = location.pathname === '/' ? '' : location.pathname;
      navigate('/es' + rest + location.search + location.hash);
    } else if (lang === 'en' && isEs) {
      const rest = location.pathname.replace(/^\/es/, '') || '/';
      navigate(rest + location.search + location.hash);
    }
  }

  return (
    <div id="lang-toggle">
      <button
        id="btn-en"
        className={!isEs ? 'active' : ''}
        onClick={() => switchTo('en')}
      >
        {t('language.en')}
      </button>
      <button
        id="btn-es"
        className={isEs ? 'active' : ''}
        onClick={() => switchTo('es')}
      >
        {t('language.es')}
      </button>
    </div>
  );
}
