import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const LANG_SLUGS = ['de','fr','es','it','pt','pl','hi','ml','ar','zh','ja','ko'];

const QUESTIONS = [
  {
    id: 'style',
    q: 'What kind of journey calls to you?',
    options: [
      { value: 'history',   icon: '🏛️', label: 'Forts & Palaces',      sub: 'Rajasthan, Golden Triangle' },
      { value: 'nature',    icon: '🌿', label: 'Jungles & Backwaters',  sub: 'Kerala, North East, Islands' },
      { value: 'spiritual', icon: '🕉️', label: 'Temples & Wellness',    sub: 'Varanasi, Rishikesh, Ayurveda' },
      { value: 'adventure', icon: '⛰️', label: 'Mountains & Treks',     sub: 'Ladakh, Spiti, Himachal' },
      { value: 'luxury',    icon: '👑', label: 'Luxury & Experiences',  sub: 'Trains, Resorts, Boutique' },
    ]
  },
  {
    id: 'duration',
    q: 'How many days do you have?',
    options: [
      { value: 'short',    icon: '✈️', label: '3–5 Days',   sub: 'Quick escape' },
      { value: 'week',     icon: '🗓️', label: '6–8 Days',   sub: 'Perfect week' },
      { value: 'extended', icon: '📅', label: '9–14 Days',  sub: 'Extended journey' },
      { value: 'grand',    icon: '🌍', label: '15+ Days',   sub: 'Grand tour' },
    ]
  },
  {
    id: 'group',
    q: 'Who are you travelling with?',
    options: [
      { value: 'couple',  icon: '💑',       label: 'Couple',  sub: 'Romantic getaway' },
      { value: 'family',  icon: '👨‍👩‍👧', label: 'Family',  sub: 'With children' },
      { value: 'friends', icon: '👥',       label: 'Friends', sub: 'Group trip' },
      { value: 'solo',    icon: '🧳',       label: 'Solo',    sub: 'My own pace' },
    ]
  }
];

const RECS = {
  history: {
    short:    { code: 'INBOUND-TEST-02', title: 'Golden Triangle',              img: 'https://kesariselect.s3.ap-south-1.amazonaws.com/aqMM0CNWLJNXmmNPiZlem13GwZlmshYwT9WK1N7q.jpg', desc: 'Delhi, Agra & Jaipur — India\'s most iconic 5-day circuit, perfectly paced.' },
    week:     { code: 'INBOUND-18',      title: 'Rajasthan Royal Tour',          img: 'https://kesariselect.s3.ap-south-1.amazonaws.com/GrKDX67aEiAJpj6KiZrEmD6hldysi2JA5aUBvjvK.jpg', desc: 'Jaipur, Jodhpur, Jaisalmer & Udaipur — the full royal Rajasthan experience.' },
    extended: { code: 'INBOUND-05',      title: 'Glorious Forts of Rajasthan',   img: 'https://kesariselect.s3.ap-south-1.amazonaws.com/vqZXiD4zAluKZvRRd4dBRx68WGuiwvS5s2D2qhcP.jpg', desc: 'Every fort, every palace, every sunset — the definitive Rajasthan journey.' },
    grand:    { code: 'INBOUND-13',      title: 'Palace on Wheels',              img: 'https://kesariselect.s3.ap-south-1.amazonaws.com/g4lovfxS7mIrds4xLqwF2NwMnaUN9eX4Wod7N48f.jpg', desc: 'India\'s legendary luxury train — a grand royal journey across Rajasthan.' },
  },
  nature: {
    short:    { code: 'INBOUND-29',   title: 'Lakshadweep Islands',         img: 'https://kesariselect.s3.ap-south-1.amazonaws.com/NgmnWTiwR657g41N1yTlD1YLvN5TqeK8Q3faEpcd.jpg', desc: 'Pristine coral atolls, crystal lagoons — India\'s most untouched islands.' },
    week:     { code: 'INBOUND-68',   title: 'Meghalaya — Abode of Clouds',  img: 'https://kesariselect.s3.ap-south-1.amazonaws.com/OIzxLgN4ZddhsGnQfsp1gXWUDXPEs0u5Kgh52b6s.jpg', desc: 'Living root bridges, sacred forests, and the world\'s wettest place.' },
    extended: { code: 'Inbound-09',   title: 'Kerala Backwaters',            img: 'https://kesariselect.s3.ap-south-1.amazonaws.com/EyKrYEgJjUYlvYe2FUf54POOrODXuKo4fiSw7V6K.jpg', desc: 'Houseboats, spice gardens, and God\'s Own Country at its finest.' },
    grand:    { code: 'INBOUND-016',  title: 'North East India Tour',        img: 'https://kesariselect.s3.ap-south-1.amazonaws.com/i1L6Gg8KfkWPoaVTzFo5Bgt51utvN7Fbi30ZNAOx.jpg', desc: 'Kaziranga, Gangtok, Shillong — India\'s last great wilderness frontier.' },
  },
  spiritual: {
    short:    { code: 'INBOUND-TEST-03', title: 'Footsteps of Buddha',         img: 'https://kesariselect.s3.ap-south-1.amazonaws.com/2p2n6yIcXvc0wXAkc1tI7QxCxhgRd5UUirUEBx7o.jpg', desc: 'Bodh Gaya, Sarnath & Kushinagar — the complete Buddhist pilgrimage circuit.' },
    week:     { code: 'INBOUND-41',      title: 'South India Temple Trail',    img: 'https://kesariselect.s3.ap-south-1.amazonaws.com/bCcO8NST0lDMUgKk17eDCCoCeN41nc0Z822VSgSa.jpg', desc: 'The magnificent Dravidian temples of Tamil Nadu in one stunning journey.' },
    extended: { code: 'FIT-INBOUND-15', title: 'Varanasi & Uttar Pradesh',    img: 'https://kesariselect.s3.ap-south-1.amazonaws.com/7iuV5ZInZUpz07PoGNthwsAeHWi63DqdMsYEbpRW.jpg', desc: 'The Ganga Aarti, sacred ghats, and the spiritual soul of ancient India.' },
    grand:    { code: 'INBOUND-12',      title: 'Kerala Ayurveda & Wellness',  img: 'https://kesariselect.s3.ap-south-1.amazonaws.com/e8OvevXBqP8B1jp9U33Vs8RpsDNZGxyImgbx48lW.jpg', desc: 'A deep Panchakarma wellness retreat in the birthplace of Ayurveda.' },
  },
  adventure: {
    short:    { code: 'INBOUND-20',     title: 'Uttarakhand Valleys', img: 'https://kesariselect.s3.ap-south-1.amazonaws.com/xUzBoo56v0aJnhOcMEtlc9F4BxDtjhErwbqEYugt.jpg', desc: 'Rhododendron trails, river camps, and the Himalayan foothills in bloom.' },
    week:     { code: 'INBOUND-014',    title: 'Leh & Ladakh',        img: 'https://kesariselect.s3.ap-south-1.amazonaws.com/FiSyzN84Tj4KsNL4aq18Ves7nY7npfmYKwxeJFQT.jpg', desc: 'Pangong Lake, Nubra Valley, and the world\'s highest motorable roads.' },
    extended: { code: 'INBOUND-50',     title: 'Spiti Valley',        img: 'https://kesariselect.s3.ap-south-1.amazonaws.com/108ZrQjRW2Pd7jkqQtQdl90qCxd03e4n14Xucwh8.jpg', desc: 'Ancient monasteries and dramatic Himalayan landscapes at high altitude.' },
    grand:    { code: 'FIT-INBOUND-14', title: 'North East India',    img: 'https://kesariselect.s3.ap-south-1.amazonaws.com/F1U45bPY423hkyCYPJEa8numyj2xQtZUafBzswwp.jpg', desc: 'Tawang, Ziro Valley, and India\'s wildest northeastern frontier.' },
  },
  luxury: {
    short:    { code: 'INBOUND-35',     title: 'Goa Beach Holiday',  img: 'https://kesariselect.s3.ap-south-1.amazonaws.com/A9aJe227B6KC6oq1muSDJj9tOs9WShoQZwvzNSWV.jpg', desc: 'Sun, heritage villas, and Goa at its most indulgent and relaxed.' },
    week:     { code: 'INBOUND-39',     title: 'Kashmir — Paradise', img: 'https://kesariselect.s3.ap-south-1.amazonaws.com/hGV27s0MPXR5TyOiJHDfSHd0wpuhyfoOV52mihBM.jpg', desc: 'Shikara rides on Dal Lake, tulip gardens, and Mughal masterpieces.' },
    extended: { code: 'FIT-INBOUND-16', title: 'Best of Bhutan',    img: 'https://kesariselect.s3.ap-south-1.amazonaws.com/azzfITPvBlSLXzWEQijbIjvC1cmihiJByxhmGQN4.jpg', desc: 'Tiger\'s Nest, Punakha Dzong, and the blissful Kingdom of Happiness.' },
    grand:    { code: 'INBOUND-40',     title: "Maharaja's Express", img: 'https://kesariselect.s3.ap-south-1.amazonaws.com/lxAgupo7BeHfxz16JQzcnE3yTYDkZDIbckW7vRxZ.jpg', desc: 'India\'s most opulent luxury train — the ultimate grand experience.' },
  },
};

export default function TripQuiz({ onEnquire }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

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
            <span className="quiz-banner-tag">✨ Personalised For You</span>
            <h2 className="quiz-banner-title">Not sure where to start?</h2>
            <p className="quiz-banner-sub">Answer 3 quick questions and we'll find your perfect India journey.</p>
          </div>
          <button className="quiz-banner-btn" onClick={() => setOpen(true)}>
            Find My Perfect Trip →
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
                  <span className="quiz-step-label">{step + 1} of {QUESTIONS.length}</span>
                </div>

                <h3 className="quiz-question">{QUESTIONS[step].q}</h3>

                {step > 0 && (
                  <button className="quiz-back" onClick={() => setStep(s => s - 1)}>← Back</button>
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
                <div className="quiz-result-tag">✨ Your Perfect Trip</div>
                <img
                  className="quiz-result-img"
                  src={rec.img}
                  alt={rec.title}
                  onError={e => { e.target.src = 'https://tap.kesariselect.com/public/cms/hiddengems/1729764681.webp'; }}
                />
                <h3 className="quiz-result-title">{rec.title}</h3>
                <p className="quiz-result-desc">{rec.desc}</p>
                <div className="quiz-result-btns">
                  <button className="btn-hero" onClick={() => {
                    close();
                    navigate(`${getBase()}/explore/product-details/${rec.code}`);
                  }}>View Full Itinerary</button>
                  <button className="quiz-enquire-btn" onClick={() => {
                    close();
                    onEnquire?.(rec.title);
                  }}>Enquire Now</button>
                </div>
                <button className="quiz-retake" onClick={reset}>↺ Try different answers</button>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}
