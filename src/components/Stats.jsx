import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from 'react';

const STATS = [
  { end: 42,  suffix: '+',      key: 'years'  },
  { end: 700, suffix: '+',      key: 'team'   },
  { end: 10,  suffix: ' Lakh+', key: 'guests' },
  { end: 550, suffix: '+',      key: 'tours'  },
  { end: 80,  suffix: '%',      key: 'repeat' },
];

function CountUp({ end, suffix, started }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!started) return;
    const dur = 2400;
    let t0 = null;
    const frame = ts => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3); // cubic ease-out
      setCount(Math.floor(eased * end));
      if (p < 1) requestAnimationFrame(frame);
      else setCount(end);
    };
    requestAnimationFrame(frame);
  }, [started, end]);

  return <>{count}{suffix}</>;
}

export default function Stats() {
  const { t } = useTranslation('home');
  const ref = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setStarted(true); obs.disconnect(); } },
      { threshold: 0.35 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="stats" ref={ref}>
      <div className="stats-row">
        {STATS.map(s => (
          <div key={s.key} className="stat">
            <div className="stat-n">
              <CountUp end={s.end} suffix={s.suffix} started={started} />
            </div>
            <div className="stat-l">{t(`stats.${s.key}`)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
