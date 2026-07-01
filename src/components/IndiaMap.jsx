import { useState } from 'react';
import { useTranslation } from 'react-i18next';

// Simplified India outline — viewBox 0 0 400 490
const INDIA_PATH =
  "M 165,8 C 190,5 215,8 240,18 C 268,28 298,42 328,55 C 355,68 378,92 385,122 " +
  "C 390,145 388,172 375,196 L 355,208 L 340,200 L 325,210 L 310,232 " +
  "L 295,252 L 280,278 L 265,304 L 250,332 L 234,362 L 216,400 " +
  "L 204,440 L 198,468 L 192,480 L 186,468 L 178,440 L 162,402 " +
  "L 146,362 L 130,330 L 115,298 L 103,268 L 94,240 L 87,218 L 80,206 " +
  "C 70,198 58,208 48,220 C 38,232 24,246 12,244 C 4,242 0,232 6,220 " +
  "C 14,208 28,200 44,194 C 58,188 72,178 80,164 " +
  "L 88,144 L 96,118 C 102,98 112,78 126,60 C 140,44 154,26 165,8 Z";

const REGIONS = [
  { id: 'kashmir',   label: 'Ladakh & Kashmir',  emoji: '🏔️', cx: 148, cy: 74,  search: 'ladakh',    color: '#3A7BBF', desc: 'High-altitude drama' },
  { id: 'delhi',     label: 'Delhi & Agra',       emoji: '🏛️', cx: 172, cy: 152, search: 'delhi',     color: '#C44B00', desc: 'The Golden Triangle' },
  { id: 'rajasthan', label: 'Rajasthan',           emoji: '🏯', cx: 96,  cy: 184, search: 'rajasthan', color: '#E07B1A', desc: 'Forts & desert sunsets' },
  { id: 'northeast', label: 'North East India',    emoji: '🌿', cx: 320, cy: 174, search: 'meghalaya', color: '#2D6A4F', desc: 'Abode of clouds' },
  { id: 'goa',       label: 'Goa & Maharashtra',  emoji: '⛵', cx: 118, cy: 278, search: 'goa',       color: '#E85D04', desc: 'Beaches & heritage' },
  { id: 'mp',        label: 'Central India',       emoji: '🐯', cx: 196, cy: 248, search: 'madhya',    color: '#6B4226', desc: 'Tigers & temples' },
  { id: 'kerala',    label: 'Kerala',              emoji: '🌴', cx: 168, cy: 415, search: 'kerala',    color: '#40916C', desc: "God's Own Country" },
  { id: 'south',     label: 'South India',         emoji: '🛕', cx: 196, cy: 384, search: 'mysore',    color: '#7B2D8B', desc: 'Temples & spice trails' },
];

export default function IndiaMap({ onSearch }) {
  const [hovered, setHovered] = useState(null);
  const { t } = useTranslation('home');

  function handleClick(r) {
    onSearch(r.search);
    setTimeout(() => document.querySelector('#packages')?.scrollIntoView({ behavior: 'smooth' }), 100);
  }

  return (
    <section className="india-map-sec">
      <div className="wrap">
        <div className="tag">{t('map.tag')}</div>
        <h2 className="h2">{t('map.title')}</h2>
        <p className="sub">{t('map.subtitle')}</p>

        <div className="india-map-layout">
          {/* SVG Map */}
          <div className="india-map-wrap">
            <svg viewBox="0 0 400 490" className="india-svg" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <filter id="pin-shadow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="rgba(0,0,0,0.25)" />
                </filter>
              </defs>

              {/* India fill */}
              <path d={INDIA_PATH} fill="#DDE8F4" stroke="#A8BDD4" strokeWidth="1.5" strokeLinejoin="round" />

              {/* Region pins */}
              {REGIONS.map(r => {
                const active = hovered === r.id;
                const tipLeft = r.cx < 200;
                return (
                  <g
                    key={r.id}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleClick(r)}
                    onMouseEnter={() => setHovered(r.id)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    {active && <circle cx={r.cx} cy={r.cy} r="20" fill={r.color} opacity="0.18" />}
                    <circle
                      cx={r.cx} cy={r.cy}
                      r={active ? 13 : 9}
                      fill={r.color}
                      stroke="#fff" strokeWidth="2.5"
                      filter="url(#pin-shadow)"
                      style={{ transition: 'r 0.18s' }}
                    />
                    <text x={r.cx} y={r.cy + 4.5} textAnchor="middle" fontSize={active ? 10 : 8} style={{ pointerEvents: 'none', userSelect: 'none' }}>
                      {r.emoji}
                    </text>

                    {active && (
                      <>
                        <rect
                          x={tipLeft ? r.cx + 16 : r.cx - 112}
                          y={r.cy - 20}
                          width={96} height={30}
                          rx={6}
                          fill={r.color}
                        />
                        <text
                          x={tipLeft ? r.cx + 64 : r.cx - 64}
                          y={r.cy - 8}
                          textAnchor="middle" fontSize={9} fill="#fff" fontWeight="bold"
                          style={{ pointerEvents: 'none', userSelect: 'none' }}
                        >{t(`map.regions.${r.id}.label`, { defaultValue: r.label })}</text>
                        <text
                          x={tipLeft ? r.cx + 64 : r.cx - 64}
                          y={r.cy + 4}
                          textAnchor="middle" fontSize={8} fill="rgba(255,255,255,0.82)"
                          style={{ pointerEvents: 'none', userSelect: 'none' }}
                        >{t(`map.regions.${r.id}.desc`, { defaultValue: r.desc })}</text>
                      </>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Region list */}
          <div className="india-region-list">
            {REGIONS.map(r => (
              <button
                key={r.id}
                className={`india-region-btn${hovered === r.id ? ' active' : ''}`}
                style={{ '--rc': r.color }}
                onClick={() => handleClick(r)}
                onMouseEnter={() => setHovered(r.id)}
                onMouseLeave={() => setHovered(null)}
              >
                <span className="irb-icon">{r.emoji}</span>
                <div className="irb-text">
                  <div className="irb-label">{t(`map.regions.${r.id}.label`, { defaultValue: r.label })}</div>
                  <div className="irb-sub">{t(`map.regions.${r.id}.desc`, { defaultValue: r.desc })}</div>
                </div>
                <span className="irb-arrow">→</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
