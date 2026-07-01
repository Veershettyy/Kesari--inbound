import { useTranslation } from 'react-i18next';
import { useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';

const BASE = 'https://inbound.kesariselect.com';
const LANG_SLUGS = ['de','fr','es','it','pt','pl','hi','ml','mr','ar','zh','ja','ko'];

export default function Navbar({ onEnquire, onSearchNav }) {
  const { t } = useTranslation('common');
  const [search, setSearch] = useState('');
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  function getHomePath() {
    const m = location.pathname.match(/^\/INT\/([^/]+)/);
    if (m && LANG_SLUGS.includes(m[1])) return `/INT/${m[1]}`;
    return '/INT';
  }

  function goHome(e) {
    e.preventDefault();
    const home = getHomePath();
    const isHome = location.pathname === home || location.pathname === home + '/';
    if (isHome) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate(home);
    }
  }

  function goSearch(e, term) {
    e.preventDefault();
    const home = getHomePath();
    const isHome = location.pathname === home || location.pathname === home + '/';
    if (isHome) {
      onSearchNav && onSearchNav(term);
      document.querySelector('#packages')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(home);
      setTimeout(() => {
        onSearchNav && onSearchNav(term);
        document.querySelector('#packages')?.scrollIntoView({ behavior: 'smooth' });
      }, 400);
    }
  }

  function goSection(e, hash) {
    e.preventDefault();
    const home = getHomePath();
    const isHome = location.pathname === home || location.pathname === home + '/';
    if (isHome) {
      document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(home + hash);
    }
  }

  function handleSearch(e) {
    if (e.key === 'Enter' || e.type === 'input') {
      onSearchNav && onSearchNav(e.target.value);
    }
  }

  return (
    <header>
      <div className="header-top">
        <a href={getHomePath()} className="logo" onClick={goHome}>
          <img
            className="logo-img"
            src={`${BASE}/static/media/Kesari-Inbound-Logo.3ac1e59a357e91ba7e56.png`}
            alt="KESARi Inbound"
            onError={e => { e.target.style.display = 'none'; document.getElementById('logo-fallback').style.display = 'flex'; }}
          />
          <img
            className="logo-42"
            src={`${BASE}/static/media/42-years-logo.f22252fd3e46195a961b.png`}
            alt="42 Years"
          />
          <div className="logo-right" id="logo-fallback" style={{ display: 'none' }}>
            <div className="logo-main">KESARI <span>INBOUND</span></div>
            <div className="logo-foreign">For Foreign Nationals</div>
          </div>
        </a>
        <div className="header-right">
          <div className="foreign-badge">
            <span className="fb-plane">✈</span>
            <div className="fb-text">
              <span className="fb-inbound">{t('header.inbound')}</span>
              <span className="fb-for">{t('header.forForeignNationals')}</span>
            </div>
          </div>
          <LanguageSwitcher />
          <a className="phone" href="tel:+912266666666">{t('header.phone')}</a>
          <button className="btn-red" onClick={onEnquire}>{t('header.enquireNow')}</button>
        </div>
      </div>
      <nav>
        <ul className="nav-list">
          <li className="nav-item"><a href={getHomePath()} className="nav-link" onClick={goHome}>{t('nav.home')}</a></li>
          <li className="nav-item">
            <a href="#destinations" className="nav-link" onClick={e => goSection(e, '#destinations')}>{t('nav.destinations')}</a>
            <div className="mega">
              <div>
                <h4>{t('mega.northIndia')}</h4>
                <a href="#packages" onClick={e => goSearch(e, 'Rajasthan')}>Rajasthan</a>
                <a href="#packages" onClick={e => goSearch(e, 'Uttarakhand')}>Uttarakhand</a>
                <a href="#packages" onClick={e => goSearch(e, 'Himachal Pradesh')}>Himachal Pradesh</a>
                <a href="#packages" onClick={e => goSearch(e, 'Kashmir')}>Jammu &amp; Kashmir</a>
                <a href="#packages" onClick={e => goSearch(e, 'Ladakh')}>Leh &amp; Ladakh</a>
                <a href="#packages" onClick={e => goSearch(e, 'Delhi')}>Delhi</a>
                <a href="#packages" onClick={e => goSearch(e, 'Madhya Pradesh')}>Madhya Pradesh</a>
              </div>
              <div>
                <h4>{t('mega.westIndia')}</h4>
                <a href="#packages" onClick={e => goSearch(e, 'Gujarat')}>Gujarat</a>
                <a href="#packages" onClick={e => goSearch(e, 'Maharashtra')}>Maharashtra</a>
                <a href="#packages" onClick={e => goSearch(e, 'Goa')}>Goa</a>
              </div>
              <div>
                <h4>{t('mega.southIndia')}</h4>
                <a href="#packages" onClick={e => goSearch(e, 'Kerala')}>Kerala</a>
                <a href="#packages" onClick={e => goSearch(e, 'Tamil Nadu')}>Tamil Nadu</a>
                <a href="#packages" onClick={e => goSearch(e, 'Andhra Pradesh')}>Andhra Pradesh</a>
                <a href="#packages" onClick={e => goSearch(e, 'Karnataka')}>Karnataka</a>
                <a href="#packages" onClick={e => goSearch(e, 'Pondicherry')}>Pondicherry</a>
                <a href="#packages" onClick={e => goSearch(e, 'Lakshadweep')}>Lakshadweep</a>
                <a href="#packages" onClick={e => goSearch(e, 'Andaman')}>Andaman &amp; Nicobar</a>
              </div>
              <div>
                <h4>{t('mega.eastIndia')}</h4>
                <a href="#packages" onClick={e => goSearch(e, 'Odisha')}>Odisha</a>
                <a href="#packages" onClick={e => goSearch(e, 'North East')}>North East</a>
                <a href="#packages" onClick={e => goSearch(e, 'West Bengal')}>West Bengal</a>
              </div>
            </div>
          </li>
          <li className="nav-item"><a href="#packages"     className="nav-link" onClick={e => goSection(e,'#packages')}>{t('nav.tourPackages')}</a></li>
          <li className="nav-item"><a href="#why"          className="nav-link" onClick={e => goSection(e,'#why')}>{t('nav.exploreIndia')}</a></li>
          <li className="nav-item"><a href="#destinations" className="nav-link" onClick={e => goSection(e,'#destinations')}>{t('nav.destinationsLink')}</a></li>
          <li className="nav-item"><a href="#reviews"      className="nav-link" onClick={e => goSection(e,'#reviews')}>{t('nav.reviews')}</a></li>
          <li className="nav-item"><a href="#enquiry"      className="nav-link" onClick={e => goSection(e,'#enquiry')}>{t('nav.contactUs')}</a></li>
          <li className="nav-item"><a href={`${getHomePath()}/about`} className="nav-link" onClick={e => { e.preventDefault(); navigate(`${getHomePath()}/about`); }}>{t('nav.aboutUs')}</a></li>
          <li className="nav-item"><a href={`${getHomePath()}/blog`}  className="nav-link" onClick={e => { e.preventDefault(); navigate(`${getHomePath()}/blog`); }}>{t('nav.travelGuide')}</a></li>
          <li className="nav-item nav-search">
            <div className="nav-search-wrap">
              <input
                ref={searchRef}
                id="navSearch"
                type="text"
                placeholder={t('nav.searchPlaceholder')}
                value={search}
                onChange={e => { setSearch(e.target.value); onSearchNav && onSearchNav(e.target.value); }}
                onKeyDown={e => e.key === 'Enter' && onSearchNav && onSearchNav(search)}
              />
              <span className="nav-search-icon">🔍</span>
            </div>
          </li>
        </ul>
      </nav>
    </header>
  );
}
