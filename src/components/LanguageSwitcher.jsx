import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation('common');

  const { pathname } = location;
  const isEs = pathname.startsWith('/INT/es') || pathname.startsWith('/es-es');
  const isInt = pathname.startsWith('/INT');

  function switchTo(lang) {
    if (lang === 'es' && !isEs) {
      if (isInt) {
        // /INT/something → /INT/es/something
        navigate(pathname.replace('/INT', '/INT/es') + location.search);
      } else {
        navigate('/INT/es');
      }
    } else if (lang === 'en' && isEs) {
      if (pathname.startsWith('/INT/es')) {
        // /INT/es/something → /INT/something
        navigate(pathname.replace('/INT/es', '/INT') + location.search);
      } else {
        navigate('/INT');
      }
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
