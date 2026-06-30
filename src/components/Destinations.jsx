import { useTranslation } from 'react-i18next';

const DESTS = [
  { key: 'rajasthan',     search: 'Rajasthan',      img: 'https://tap.kesariselect.com/public/cms/hiddengems/1729764560.webp' },
  { key: 'uttarakhand',   search: 'Uttarakhand',    img: 'https://tap.kesariselect.com/public/cms/hiddengems/1729764609.webp' },
  { key: 'gujarat',       search: 'Gujarat',        img: 'https://tap.kesariselect.com/public/cms/hiddengems/1729764629.webp' },
  { key: 'karnataka',     search: 'Karnataka',      img: 'https://tap.kesariselect.com/public/cms/hiddengems/1729764662.webp' },
  { key: 'kerala',        search: 'Kerala',         img: 'https://tap.kesariselect.com/public/cms/hiddengems/1729764681.webp' },
  { key: 'meghalaya',     search: 'Meghalaya',      img: 'https://tap.kesariselect.com/public/cms/hiddengems/1729764696.webp' },
  { key: 'pondicherry',   search: 'Pondicherry',    img: 'https://tap.kesariselect.com/public/cms/hiddengems/1729764712.webp' },
  { key: 'northEast',     search: 'North East',     img: 'https://tap.kesariselect.com/public/cms/hiddengems/1729764729.webp' },
  { key: 'lehLadakh',     search: 'Ladakh',         img: 'https://tap.kesariselect.com/public/cms/hiddengems/1729764744.webp' },
  { key: 'jammuKashmir',  search: 'Kashmir',        img: 'https://tap.kesariselect.com/public/cms/hiddengems/1729764784.webp' },
  { key: 'delhi',         search: 'Delhi',          img: 'https://tap.kesariselect.com/public/cms/hiddengems/1729764644.webp' },
  { key: 'madhyaPradesh', search: 'Madhya Pradesh', img: 'https://tap.kesariselect.com/public/cms/hiddengems/1729764799.webp' },
];

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
              <img src={d.img} alt={t(`destinations.names.${d.key}`)} loading="lazy" />
              <div className="dest-name">{t(`destinations.names.${d.key}`)}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
