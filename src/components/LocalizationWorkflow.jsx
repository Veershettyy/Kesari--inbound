import { useTranslation } from 'react-i18next';

const ICONS = ['🌐','🧠','✅','⚡','🔍','🖼️','📧','🤖','👤'];

export default function LocalizationWorkflow() {
  const { t } = useTranslation('home');
  const levels = t('workflow.levels', { returnObjects: true });

  return (
    <div className="wf-section">
      <div className="wf-wrap">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div className="tag">{t('workflow.tag')}</div>
          <h2 className="h2" style={{ marginBottom: '10px' }}>{t('workflow.title')}</h2>
          <p className="sub" style={{ maxWidth: '580px', margin: '0 auto' }}>{t('workflow.subtitle')}</p>
        </div>
        <div className="wf-grid">
          {levels.map((lv, i) => (
            <div key={i} className="wf-card">
              <div className="wf-num">{i + 1}</div>
              <div className="wf-icon">{ICONS[i]}</div>
              <div className="wf-badge">{lv.badge}</div>
              <div className="wf-title">{lv.title}</div>
              <div className="wf-desc">{lv.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
