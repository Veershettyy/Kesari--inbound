import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

const SLIDES = [
  { img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1600&auto=format&fit=crop', key: 'slide1', btn: 'exploreWithUs', pos: 'center 60%' },
  { img: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1600&auto=format&fit=crop',    key: 'slide2', btn: 'bookTheTrip',   pos: 'center 40%' },
  { img: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1600&auto=format&fit=crop', key: 'slide3', btn: 'planYourTrip',  pos: 'center 50%' },
];

export default function HeroSlider() {
  const { t, i18n } = useTranslation(['home', 'common']);
  const [cur, setCur] = useState(0);
  const isEs = i18n.language === 'es-ES';

  const go = useCallback(n => setCur(c => ((c + n) + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    const timer = setInterval(() => go(1), 5500);
    return () => clearInterval(timer);
  }, [go]);

  return (
    <section className="hero">
      {SLIDES.map((s, i) => (
        <div key={s.key} className={`slide${i === cur ? ' active' : ''}`} style={{ backgroundImage: `url('${s.img}')`, backgroundPosition: s.pos }}>
          <div className="slide-content">
            <span className="slide-tag">{t(`home:hero.${s.key}.tag`)}</span>
            <h1 className="slide-title">{t(`home:hero.${s.key}.title`)}</h1>
            <p className="slide-desc">{t(`home:hero.${s.key}.desc`)}</p>
            <a href="#packages" className="btn-hero">{t(`common:buttons.${s.btn}`)}</a>
          </div>
        </div>
      ))}
      <div className="s-arrows">
        <button onClick={() => go(-1)}>&#8592;</button>
        <button onClick={() => go(1)}>&#8594;</button>
      </div>
      <div className="s-dots">
        {SLIDES.map((_, i) => (
          <div key={i} className={`dot${i === cur ? ' active' : ''}`} onClick={() => setCur(i)} />
        ))}
      </div>
    </section>
  );
}
