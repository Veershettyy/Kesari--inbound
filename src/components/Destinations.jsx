import { useTranslation } from 'react-i18next';

const U = (id, pos = 'center') =>
  `https://images.unsplash.com/${id}?w=800&h=600&auto=format&fit=crop&q=85`;

const DESTS = [
  { key: 'rajasthan',     search: 'Rajasthan',      img: U('photo-1477587458883-47145ed94245') },
  { key: 'uttarakhand',   search: 'Uttarakhand',    img: U('photo-1506905925346-21bda4d32df4') },
  { key: 'gujarat',       search: 'Gujarat',        img: U('photo-1625466247813-5dea539f9a14') },
  { key: 'karnataka',     search: 'Karnataka',      img: U('photo-1580060839134-75a5edca2e99') },
  { key: 'kerala',        search: 'Kerala',         img: U('photo-1602216056096-3b40cc0c9944') },
  { key: 'meghalaya',     search: 'Meghalaya',      img: U('photo-1594812072-bfec8d9f5db2') },
  { key: 'pondicherry',   search: 'Pondicherry',    img: U('photo-1583417319070-4a69db38a482') },
  { key: 'northEast',     search: 'North East',     img: U('photo-1574482620826-5e0dd56f2c36') },
  { key: 'lehLadakh',     search: 'Ladakh',         img: U('photo-1524666041070-9d87656c25bb') },
  { key: 'jammuKashmir',  search: 'Kashmir',        img: U('photo-1547036967-23d11aacaee0') },
  { key: 'delhi',         search: 'Delhi',          img: U('photo-1587474260584-136574528ed5') },
  { key: 'madhyaPradesh', search: 'Madhya Pradesh', img: U('photo-1589494517086-6c8c1e89c5cb') },
];

const FALLBACK = 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&h=600&auto=format&fit=crop&q=85';

export default function Destinations({ onSearch }) {
  const { t } = useTranslation('home');

  function handleClick(e, search) {
    e.preventDefault();
    if (onSearch) onSearch(search);
    document.querySelector('#packages')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div id="destinations" className="sec">
      <div className="wrap">
        <div className="tag">{t('destinations.tag')}</div>
        <h2 className="h2">{t('destinations.title')}</h2>
        <p className="sub">{t('destinations.subtitle')}</p>
        <div className="dest-grid">
          {DESTS.map(d => (
            <a key={d.key} className="dest-card" href="#packages" onClick={e => handleClick(e, d.search)}>
              <img
                src={d.img}
                alt={t(`destinations.names.${d.key}`)}
                loading="lazy"
                onError={e => { e.target.src = FALLBACK; }}
              />
              <div className="dest-name">{t(`destinations.names.${d.key}`)}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
