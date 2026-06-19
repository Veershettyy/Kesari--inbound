import { useRef, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

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
import PackageDetail from './pages/PackageDetail';

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
      {modalPkg && <BookingModal pkgName={modalPkg} onClose={() => setModalPkg(null)} />}
    </>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <Routes>
        {/* Spanish package detail: /INT/es/explore/product-details/:code */}
        <Route
          path="/es/explore/product-details/:code"
          element={<LocaleWrapper><PackageDetail /></LocaleWrapper>}
        />
        {/* English package detail: /INT/explore/product-details/:code */}
        <Route
          path="/explore/product-details/:code"
          element={<LocaleWrapper><PackageDetail /></LocaleWrapper>}
        />
        {/* Spanish homepage: /INT/es/* */}
        <Route
          path="/es/*"
          element={<LocaleWrapper><HomePage /></LocaleWrapper>}
        />
        {/* English homepage: /INT/* */}
        <Route
          path="/*"
          element={<LocaleWrapper><HomePage /></LocaleWrapper>}
        />
      </Routes>
    </HelmetProvider>
  );
}
