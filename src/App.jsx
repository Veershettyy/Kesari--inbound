import { useRef, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import LocaleWrapper from './components/LocaleWrapper';
import SeoHead from './components/SeoHead';
import Navbar from './components/Navbar';
import HeroSlider from './components/HeroSlider';
import Stats from './components/Stats';
import SeasonalPlanner from './components/SeasonalPlanner';
import AdventureThemes from './components/AdventureThemes';
import WhyIndia from './components/WhyIndia';
import Destinations from './components/Destinations';
import TourPackages from './components/TourPackages';
import Reviews from './components/Reviews';
import LocalizationWorkflow from './components/LocalizationWorkflow';
import EnquiryForm from './components/EnquiryForm';
import Footer from './components/Footer';
import BookingModal from './components/BookingModal';
import LanguageSwitcher from './components/LanguageSwitcher';

function DebugBanner() {
  const { i18n } = useTranslation();
  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#000', color: '#0f0', fontFamily: 'monospace', fontSize: 12, zIndex: 99999, padding: '4px 12px', textAlign: 'center' }}>
      i18n.language = <strong>{i18n.language}</strong> | pathname = <strong>{window.location.pathname}</strong> | nav.home = <strong>{i18n.t('nav.home', { ns: 'common' })}</strong>
    </div>
  );
}

function HomePage() {
  const [modalPkg, setModalPkg] = useState(null);
  const pkgRef = useRef(null);

  function openEnquiry() {
    document.querySelector('#enquiry')?.scrollIntoView({ behavior: 'smooth' });
  }

  function openBooking(name) {
    setModalPkg(name);
  }

  function handleNavSearch(q) {
    pkgRef.current?.setSearch(q);
    document.querySelector('#packages')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <>
      <SeoHead />
      <Navbar onEnquire={openEnquiry} onSearchNav={handleNavSearch} />
      <HeroSlider />
      <Stats />
      <SeasonalPlanner onEnquire={openBooking} />
      <AdventureThemes />
      <WhyIndia />
      <Destinations />
      <TourPackages ref={pkgRef} onEnquire={openBooking} />
      <Reviews />
      <LocalizationWorkflow />
      <EnquiryForm />
      <Footer />
      <LanguageSwitcher />
      <DebugBanner />
      {modalPkg && <BookingModal pkgName={modalPkg} onClose={() => setModalPkg(null)} />}
    </>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <Routes>
        <Route
          path="/es-es/*"
          element={
            <LocaleWrapper>
              <HomePage />
            </LocaleWrapper>
          }
        />
        <Route
          path="/*"
          element={
            <LocaleWrapper>
              <HomePage />
            </LocaleWrapper>
          }
        />
      </Routes>
    </HelmetProvider>
  );
}
