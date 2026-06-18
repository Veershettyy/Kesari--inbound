import { useTranslation } from 'react-i18next';
import useLocalizedUrl from '../hooks/useLocalizedUrl';

const BASE = 'https://inbound.kesariselect.com';
const DESTS = [
  { key: 'rajasthan',     url: '/explore/india/west-india/rajasthan',            img: 'https://tap.kesariselect.com/public/cms/hiddengems/1729764560.webp' },
  { key: 'uttarakhand',   url: '/explore/india/north-india/uttarakhand',          img: 'https://tap.kesariselect.com/public/cms/hiddengems/1729764609.webp' },
  { key: 'gujarat',       url: '/explore/india/west-india/gujarat',               img: 'https://tap.kesariselect.com/public/cms/hiddengems/1729764629.webp' },
  { key: 'karnataka',     url: '/explore/india/south-india/karnataka',            img: 'https://tap.kesariselect.com/public/cms/hiddengems/1729764662.webp' },
  { key: 'kerala',        url: '/explore/india/south-india/kerala',               img: 'https://tap.kesariselect.com/public/cms/hiddengems/1729764681.webp' },
  { key: 'meghalaya',     url: '/explore/india/west-india/meghalaya',             img: 'https://tap.kesariselect.com/public/cms/hiddengems/1729764696.webp' },
  { key: 'pondicherry',   url: '/explore/india/south-india/pondicherry',          img: 'https://tap.kesariselect.com/public/cms/hiddengems/1729764712.webp' },
  { key: 'northEast',     url: '/explore/india/east-india/north-east',            img: 'https://tap.kesariselect.com/public/cms/hiddengems/1729764729.webp' },
  { key: 'lehLadakh',     url: '/explore/india/north-india/leh-and-ladakh',       img: 'https://tap.kesariselect.com/public/cms/hiddengems/1729764744.webp' },
  { key: 'jammuKashmir',  url: '/explore/india/north-india/jammu-and-kashmir',    img: 'https://tap.kesariselect.com/public/cms/hiddengems/1729764784.webp' },
  { key: 'delhi',         url: '/explore/india/north-india/delhi',                img: 'https://tap.kesariselect.com/public/cms/hiddengems/1729764644.webp' },
  { key: 'madhyaPradesh', url: '/explore/india/north-india/madhya-pradesh',       img: 'https://tap.kesariselect.com/public/cms/hiddengems/1729764799.webp' },
];

export default function Destinations() {
  const { t } = useTranslation('home');
  const localizeUrl = useLocalizedUrl();
  return (
    <div id="destinations" className="sec">
      <div className="wrap">
        <div className="tag">{t('destinations.tag')}</div>
        <h2 className="h2">{t('destinations.title')}</h2>
        <p className="sub">{t('destinations.subtitle')}</p>
        <div className="dest-grid">
          {DESTS.map(d => (
            <a key={d.key} className="dest-card" href={localizeUrl(BASE + d.url)} target="_blank" rel="noreferrer">
              <img src={d.img} alt={t(`destinations.names.${d.key}`)} loading="lazy" />
              <div className="dest-name">{t(`destinations.names.${d.key}`)}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
