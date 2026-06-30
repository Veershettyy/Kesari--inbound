import { useRef, useState, useEffect } from 'react';
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
import EnquiryForm from './components/EnquiryForm';
import Footer from './components/Footer';
import BookingModal from './components/BookingModal';
import PackageDetail from './pages/PackageDetail';

function ScrollToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  if (!show) return null;
  return (
    <button className="scroll-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top">
      ↑
    </button>
  );
}

function HomePage() {
  const [modalPkg, setModalPkg] = useState(null);
  const pkgRef = useRef(null);

  function openEnquiry() {
    document.querySelector('#enquiry')?.scrollIntoView({ behavior: 'smooth' });
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
      <SeasonalPlanner onEnquire={name => setModalPkg(name)} />
      <AdventureThemes />
      <WhyIndia />
      <Destinations onSearch={handleNavSearch} />
      <TourPackages ref={pkgRef} onEnquire={name => setModalPkg(name)} />
      <Reviews />
      <EnquiryForm />
      <Footer />
      <ScrollToTop />
      {modalPkg && <BookingModal pkgName={modalPkg} onClose={() => setModalPkg(null)} />}
    </>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <Routes>
        {/* Package detail — /INT/es/explore/product-details/:code */}
        <Route path="/INT/es/explore/product-details/:code"
          element={<LocaleWrapper><PackageDetail /></LocaleWrapper>} />

        {/* Package detail — /INT/explore/product-details/:code */}
        <Route path="/INT/explore/product-details/:code"
          element={<LocaleWrapper><PackageDetail /></LocaleWrapper>} />

        {/* Package detail — legacy /es-es/explore/product-details/:code */}
        <Route path="/es-es/explore/product-details/:code"
          element={<LocaleWrapper><PackageDetail /></LocaleWrapper>} />

        {/* Spanish homepage — /INT/es/* */}
        <Route path="/INT/es/*"
          element={<LocaleWrapper><HomePage /></LocaleWrapper>} />

        {/* Dynamic language package detail — /INT/:lang/explore/product-details/:code */}
        <Route path="/INT/:lang/explore/product-details/:code"
          element={<LocaleWrapper><PackageDetail /></LocaleWrapper>} />

        {/* Dynamic language homepage — /INT/:lang/* (e.g. /INT/fr, /INT/de, /INT/ja) */}
        <Route path="/INT/:lang/*"
          element={<LocaleWrapper><HomePage /></LocaleWrapper>} />

        {/* English homepage — /INT/* */}
        <Route path="/INT/*"
          element={<LocaleWrapper><HomePage /></LocaleWrapper>} />

        {/* Legacy Spanish — /es-es/* (kept until confirmed removable) */}
        <Route path="/es-es/*"
          element={<LocaleWrapper><HomePage /></LocaleWrapper>} />

        {/* Root fallback */}
        <Route path="/*"
          element={<LocaleWrapper><HomePage /></LocaleWrapper>} />
      </Routes>
    </HelmetProvider>
  );
}
