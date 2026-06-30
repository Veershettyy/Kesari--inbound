import { useTranslation } from 'react-i18next';

const U = id => `https://images.unsplash.com/${id}?w=800&h=600&auto=format&fit=crop&q=85`;
// KeSARi's own destination images — guaranteed accurate for each region
const K = f => `https://tap.kesariselect.com/public/cms/hiddengems/${f}`;

const DESTS = [
  // Unsplash only where photo ID is verified
  { key: 'rajasthan',     search: 'Rajasthan',      img: U('photo-1477587458883-47145ed94245') }, // Hawa Mahal Jaipur
  { key: 'uttarakhand',   search: 'Uttarakhand',    img: U('photo-1506905925346-21bda4d32df4') }, // Himalayan valley
  { key: 'gujarat',       search: 'Gujarat',        img: K('1729764629.webp') },
  { key: 'karnataka',     search: 'Karnataka',      img: K('1729764662.webp') },
  { key: 'kerala',        search: 'Kerala',         img: U('photo-1602216056096-3b40cc0c9944') }, // Backwaters
  { key: 'meghalaya',     search: 'Meghalaya',      img: K('1729764696.webp') },
  { key: 'pondicherry',   search: 'Pondicherry',    img: K('1729764712.webp') },
  { key: 'northEast',     search: 'North East',     img: K('1729764729.webp') },
  { key: 'lehLadakh',     search: 'Ladakh',         img: U('photo-1524666041070-9d87656c25bb') }, // Pangong lake
  { key: 'jammuKashmir',  search: 'Kashmir',        img: U('photo-1547036967-23d11aacaee0') },    // Dal Lake
  { key: 'delhi',         search: 'Delhi',          img: U('photo-1587474260584-136574528ed5') }, // India Gate
  { key: 'madhyaPradesh', search: 'Madhya Pradesh', img: K('1729764799.webp') },
];

const FALLBACK = 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&h=600&auto=format&fit=crop&q=85';

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
