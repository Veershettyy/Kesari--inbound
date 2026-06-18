import { useTranslation } from 'react-i18next';

const STATS = [
  { value: '42+', key: 'years' },
  { value: '700+', key: 'team' },
  { value: '10 Lakh+', key: 'guests' },
  { value: '550+', key: 'tours' },
  { value: '80%', key: 'repeat' },
];

export default function Stats() {
  const { t } = useTranslation('home');
  return (
    <div className="stats">
      <div className="stats-row">
        {STATS.map(s => (
          <div key={s.key} className="stat">
            <div className="stat-n">{s.value}</div>
            <div className="stat-l">{t(`stats.${s.key}`)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
