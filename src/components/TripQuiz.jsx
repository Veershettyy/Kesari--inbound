import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const LANG_SLUGS = ['de','fr','es','it','pt','pl','hi','ml','mr','ar','zh','ja','ko'];

const RECS = {
  history: {
    short:    { code: 'INBOUND-TEST-02', title: 'Golden Triangle',              img: 'https://kesariselect.s3.ap-south-1.amazonaws.com/aqMM0CNWLJNXmmNPiZlem13GwZlmshYwT9WK1N7q.jpg', descKey: 'recHistoryShort' },
    week:     { code: 'INBOUND-18',      title: 'Rajasthan Royal Tour',          img: 'https://kesariselect.s3.ap-south-1.amazonaws.com/GrKDX67aEiAJpj6KiZrEmD6hldysi2JA5aUBvjvK.jpg', descKey: 'recHistoryWeek' },
    extended: { code: 'INBOUND-05',      title: 'Glorious Forts of Rajasthan',   img: 'https://kesariselect.s3.ap-south-1.amazonaws.com/vqZXiD4zAluKZvRRd4dBRx68WGuiwvS5s2D2qhcP.jpg', descKey: 'recHistoryExtended' },
    grand:    { code: 'INBOUND-13',      title: 'Palace on Wheels',              img: 'https://kesariselect.s3.ap-south-1.amazonaws.com/g4lovfxS7mIrds4xLqwF2NwMnaUN9eX4Wod7N48f.jpg', descKey: 'recHistoryGrand' },
  },
  nature: {
    short:    { code: 'INBOUND-29',   title: 'Lakshadweep Islands',          img: 'https://kesariselect.s3.ap-south-1.amazonaws.com/NgmnWTiwR657g41N1yTlD1YLvN5TqeK8Q3faEpcd.jpg', descKey: 'recNatureShort' },
    week:     { code: 'INBOUND-68',   title: 'Meghalaya — Abode of Clouds',   img: 'https://kesariselect.s3.ap-south-1.amazonaws.com/OIzxLgN4ZddhsGnQfsp1gXWUDXPEs0u5Kgh52b6s.jpg', descKey: 'recNatureWeek' },
    extended: { code: 'Inbound-09',   title: 'Kerala Backwaters',             img: 'https://kesariselect.s3.ap-south-1.amazonaws.com/EyKrYEgJjUYlvYe2FUf54POOrODXuKo4fiSw7V6K.jpg', descKey: 'recNatureExtended' },
    grand:    { code: 'INBOUND-016',  title: 'North East India Tour',         img: 'https://kesariselect.s3.ap-south-1.amazonaws.com/i1L6Gg8KfkWPoaVTzFo5Bgt51utvN7Fbi30ZNAOx.jpg', descKey: 'recNatureGrand' },
  },
  spiritual: {
    short:    { code: 'INBOUND-TEST-03', title: 'Footsteps of Buddha',          img: 'https://kesariselect.s3.ap-south-1.amazonaws.com/2p2n6yIcXvc0wXAkc1tI7QxCxhgRd5UUirUEBx7o.jpg', descKey: 'recSpiritualShort' },
    week:     { code: 'INBOUND-41',      title: 'South India Temple Trail',     img: 'https://kesariselect.s3.ap-south-1.amazonaws.com/bCcO8NST0lDMUgKk17eDCCoCeN41nc0Z822VSgSa.jpg', descKey: 'recSpiritualWeek' },
    extended: { code: 'FIT-INBOUND-15', title: 'Varanasi & Uttar Pradesh',     img: 'https://kesariselect.s3.ap-south-1.amazonaws.com/7iuV5ZInZUpz07PoGNthwsAeHWi63DqdMsYEbpRW.jpg', descKey: 'recSpiritualExtended' },
    grand:    { code: 'INBOUND-12',      title: 'Kerala Ayurveda & Wellness',   img: 'https://kesariselect.s3.ap-south-1.amazonaws.com/e8OvevXBqP8B1jp9U33Vs8RpsDNZGxyImgbx48lW.jpg', descKey: 'recSpiritualGrand' },
  },
  adventure: {
    short:    { code: 'INBOUND-20',     title: 'Uttarakhand Valleys', img: 'https://kesariselect.s3.ap-south-1.amazonaws.com/xUzBoo56v0aJnhOcMEtlc9F4BxDtjhErwbqEYugt.jpg', descKey: 'recAdventureShort' },
    week:     { code: 'INBOUND-014',    title: 'Leh & Ladakh',        img: 'https://kesariselect.s3.ap-south-1.amazonaws.com/FiSyzN84Tj4KsNL4aq18Ves7nY7npfmYKwxeJFQT.jpg', descKey: 'recAdventureWeek' },
    extended: { code: 'INBOUND-50',     title: 'Spiti Valley',        img: 'https://kesariselect.s3.ap-south-1.amazonaws.com/108ZrQjRW2Pd7jkqQtQdl90qCxd03e4n14Xucwh8.jpg', descKey: 'recAdventureExtended' },
    grand:    { code: 'FIT-INBOUND-14', title: 'North East India',    img: 'https://kesariselect.s3.ap-south-1.amazonaws.com/F1U45bPY423hkyCYPJEa8numyj2xQtZUafBzswwp.jpg', descKey: 'recAdventureGrand' },
  },
  luxury: {
    short:    { code: 'INBOUND-35',     title: 'Goa Beach Holiday',  img: 'https://kesariselect.s3.ap-south-1.amazonaws.com/A9aJe227B6KC6oq1muSDJj9tOs9WShoQZwvzNSWV.jpg', descKey: 'recLuxuryShort' },
    week:     { code: 'INBOUND-39',     title: 'Kashmir — Paradise', img: 'https://kesariselect.s3.ap-south-1.amazonaws.com/hGV27s0MPXR5TyOiJHDfSHd0wpuhyfoOV52mihBM.jpg', descKey: 'recLuxuryWeek' },
    extended: { code: 'FIT-INBOUND-16', title: 'Best of Bhutan',    img: 'https://kesariselect.s3.ap-south-1.amazonaws.com/azzfITPvBlSLXzWEQijbIjvC1cmihiJByxhmGQN4.jpg', descKey: 'recLuxuryExtended' },
    grand:    { code: 'INBOUND-40',     title: "Maharaja's Express", img: 'https://kesariselect.s3.ap-south-1.amazonaws.com/lxAgupo7BeHfxz16JQzcnE3yTYDkZDIbckW7vRxZ.jpg', descKey: 'recLuxuryGrand' },
  },
};

export default function TripQuiz({ onEnquire }) {
  const { t } = useTranslation('common');
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  const QUESTIONS = [
    {
      id: 'style',
      q: t('quiz.q1'),
      options: [
        { value: 'history',   icon: '🏛️', label: t('quiz.styleHistory'),   sub: t('quiz.styleHistorySub') },
        { value: 'nature',    icon: '🌿', label: t('quiz.styleNature'),    sub: t('quiz.styleNatureSub') },
        { value: 'spiritual', icon: '🕉️', label: t('quiz.styleSpiritual'), sub: t('quiz.styleSpiritualSub') },
        { value: 'adventure', icon: '⛰️', label: t('quiz.styleAdventure'), sub: t('quiz.styleAdventureSub') },
        { value: 'luxury',    icon: '👑', label: t('quiz.styleLuxury'),    sub: t('quiz.styleLuxurySub') },
      ]
    },
    {
      id: 'duration',
      q: t('quiz.q2'),
      options: [
        { value: 'short',    icon: '✈️', label: t('quiz.dur35'),  sub: t('quiz.dur35Sub') },
        { value: 'week',     icon: '🗓️', label: t('quiz.dur68'),  sub: t('quiz.dur68Sub') },
        { value: 'extended', icon: '📅', label: t('quiz.dur914'), sub: t('quiz.dur914Sub') },
        { value: 'grand',    icon: '🌍', label: t('quiz.dur15'),  sub: t('quiz.dur15Sub') },
      ]
    },
    {
      id: 'group',
      q: t('quiz.q3'),
      options: [
        { value: 'couple',  icon: '💑',       label: t('quiz.groupCouple'),  sub: t('quiz.groupCoupleSub') },
        { value: 'family',  icon: '👨‍👩‍👧', label: t('quiz.groupFamily'),  sub: t('quiz.groupFamilySub') },
        { value: 'friends', icon: '👥',       label: t('quiz.groupFriends'), sub: t('quiz.groupFriendsSub') },
        { value: 'solo',    icon: '🧳',       label: t('quiz.groupSolo'),    sub: t('quiz.groupSoloSub') },
      ]
    }
  ];

  function getBase() {
    const m = location.pathname.match(/^\/INT\/([^/]+)/);
    if (m && LANG_SLUGS.includes(m[1])) return `/INT/${m[1]}`;
    return '/INT';
  }

  function pick(val) {
    const q = QUESTIONS[step];
    const next = { ...answers, [q.id]: val };
    setAnswers(next);
    if (step < QUESTIONS.length - 1) {
      setStep(s => s + 1);
    } else {
      setStep(QUESTIONS.length);
    }
  }

  function reset() {
    setStep(0);
    setAnswers({});
  }

  function close() {
    setOpen(false);
    setTimeout(reset, 300);
  }

  const rec = step === QUESTIONS.length ? RECS[answers.style]?.[answers.duration] : null;
  const isFiveOpts = step < QUESTIONS.length && QUESTIONS[step].options.length === 5;

  return (
    <>
      <div className="quiz-banner">
        <div className="quiz-banner-inner">
          <div className="quiz-banner-text">
            <span className="quiz-banner-tag">✨ {t('quiz.bannerTag')}</span>
            <h2 className="quiz-banner-title">{t('quiz.bannerTitle')}</h2>
            <p className="quiz-banner-sub">{t('quiz.bannerSub')}</p>
          </div>
          <button className="quiz-banner-btn" onClick={() => setOpen(true)}>
            {t('quiz.bannerBtn')}
          </button>
        </div>
      </div>

      {open && (
        <div className="quiz-overlay" onClick={e => e.target === e.currentTarget && close()}>
          <div className="quiz-modal">
            <button className="quiz-close" onClick={close}>✕</button>

            {step < QUESTIONS.length ? (
              <>
                <div className="quiz-progress">
                  {QUESTIONS.map((_, i) => (
                    <div key={i} className={`quiz-dot${i <= step ? ' active' : ''}`} />
                  ))}
                  <span className="quiz-step-label">{step + 1} {t('quiz.of')} {QUESTIONS.length}</span>
                </div>

                <h3 className="quiz-question">{QUESTIONS[step].q}</h3>

                {step > 0 && (
                  <button className="quiz-back" onClick={() => setStep(s => s - 1)}>← {t('quiz.back')}</button>
                )}

                <div className={`quiz-options${isFiveOpts ? ' quiz-options-5' : ''}`}>
                  {QUESTIONS[step].options.map(o => (
                    <button key={o.value} className="quiz-opt" onClick={() => pick(o.value)}>
                      <span className="quiz-opt-icon">{o.icon}</span>
                      <span className="quiz-opt-label">{o.label}</span>
                      <span className="quiz-opt-sub">{o.sub}</span>
                    </button>
                  ))}
                </div>
              </>
            ) : rec ? (
              <div className="quiz-result">
                <div className="quiz-result-tag">✨ {t('quiz.resultTag')}</div>
                <img
                  className="quiz-result-img"
                  src={rec.img}
                  alt={rec.title}
                  onError={e => { e.target.src = 'https://tap.kesariselect.com/public/cms/hiddengems/1729764681.webp'; }}
                />
                <h3 className="quiz-result-title">{rec.title}</h3>
                <p className="quiz-result-desc">{t(`quiz.${rec.descKey}`)}</p>
                <div className="quiz-result-btns">
                  <button className="btn-hero" onClick={() => {
                    close();
                    navigate(`${getBase()}/explore/product-details/${rec.code}`);
                  }}>{t('quiz.viewItinerary')}</button>
                  <button className="quiz-enquire-btn" onClick={() => {
                    close();
                    onEnquire?.(rec.title);
                  }}>{t('quiz.enquireNow')}</button>
                </div>
                <button className="quiz-retake" onClick={reset}>↺ {t('quiz.retake')}</button>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}
