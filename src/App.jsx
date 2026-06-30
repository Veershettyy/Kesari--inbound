import { useRef, useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

function ScrollToTopOnNav() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}
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
import EnquiryForm from './components/EnquiryForm';
import Reviews from './components/Reviews';
import Footer from './components/Footer';
import BookingModal from './components/BookingModal';
import PackageDetail from './pages/PackageDetail';
import AboutUs from './pages/AboutUs';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';

function useScrollReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });

    const attach = () => {
      document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));
    };
    attach();
    // re-scan after a tick in case React renders cards after mount
    const t = setTimeout(attach, 300);
    return () => { obs.disconnect(); clearTimeout(t); };
  }, []);
}

function WhatsAppBtn() {
  return (
    <a
      href="https://wa.me/912266666666"
      target="_blank"
      rel="noopener noreferrer"
      className="wa-btn"
      aria-label="Chat on WhatsApp"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
      <span className="wa-label">Chat with us</span>
    </a>
  );
}

function StickyEnquireBar() {
  return (
    <div className="sticky-enquire">
      <a href="tel:+912266666666" className="sticky-call-btn">📞 Call Us</a>
      <a href="#enquiry" className="sticky-enquire-btn" onClick={e => {
        e.preventDefault();
        document.querySelector('#enquiry')?.scrollIntoView({ behavior: 'smooth' });
      }}>Enquire Now</a>
    </div>
  );
}

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
  useScrollReveal();

  function openEnquiry() {
    document.querySelector('#enquiry')?.scrollIntoView({ behavior: 'smooth' });
  }

  function handleNavSearch(q) {
    pkgRef.current?.setSearch(q);
    document.querySelector('#packages')?.scrollIntoView({ behavior: 'smooth' });
  }

  function handleThemeFilter(filterKey) {
    pkgRef.current?.setFilter(filterKey);
    document.querySelector('#packages')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <>
      <SeoHead />
      <Navbar onEnquire={openEnquiry} onSearchNav={handleNavSearch} />
      <HeroSlider />
      <Stats />
      <SeasonalPlanner onEnquire={name => setModalPkg(name)} onViewTheme={handleThemeFilter} />
      <AdventureThemes onViewTheme={handleThemeFilter} />
      <WhyIndia onViewTheme={handleThemeFilter} />
      <Destinations onSearch={handleNavSearch} />
      <TourPackages ref={pkgRef} onEnquire={name => setModalPkg(name)} />
      <Reviews />
      <EnquiryForm />
      <Footer onSearch={handleNavSearch} onViewTheme={handleThemeFilter} />
      <StickyEnquireBar />
      <WhatsAppBtn />
      <ScrollToTop />
      {modalPkg && <BookingModal pkgName={modalPkg} onClose={() => setModalPkg(null)} />}
    </>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <ScrollToTopOnNav />
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

        {/* About Us */}
        <Route path="/INT/:lang/about" element={<LocaleWrapper><AboutUs /></LocaleWrapper>} />
        <Route path="/INT/about"       element={<LocaleWrapper><AboutUs /></LocaleWrapper>} />

        {/* Blog list */}
        <Route path="/INT/:lang/blog"  element={<LocaleWrapper><Blog /></LocaleWrapper>} />
        <Route path="/INT/blog"        element={<LocaleWrapper><Blog /></LocaleWrapper>} />

        {/* Blog post */}
        <Route path="/INT/:lang/blog/:slug" element={<LocaleWrapper><BlogPost /></LocaleWrapper>} />
        <Route path="/INT/blog/:slug"       element={<LocaleWrapper><BlogPost /></LocaleWrapper>} />

        {/* Root fallback */}
        <Route path="/*"
          element={<LocaleWrapper><HomePage /></LocaleWrapper>} />
      </Routes>
    </HelmetProvider>
  );
}
