const CARDS = [
  {
    icon: '🧭',
    title: 'Expert Local Guides',
    desc: 'Every tour is led by certified, English-speaking guides with deep knowledge of Indian history, culture, and hidden gems.',
  },
  {
    icon: '✏️',
    title: 'Personalised Itineraries',
    desc: 'No two trips are the same. We craft each journey around your interests, pace, and budget — from luxury trains to spiritual retreats.',
  },
  {
    icon: '🕐',
    title: '24/7 On-Ground Support',
    desc: 'Our team is reachable around the clock throughout your trip. Any issue, any hour — we handle it so you can focus on the experience.',
  },
  {
    icon: '🏆',
    title: '42 Years of Excellence',
    desc: 'Since 1984, we have crafted unforgettable journeys for over 10 lakh travellers. Our legacy speaks for itself.',
  },
];

export default function WhyBookUs() {
  return (
    <div className="wbu-section">
      <div className="wrap">
        <div className="tag">WHY CHOOSE US</div>
        <h2 className="h2">Why Book With KeSARi Inbound</h2>
        <p className="sub">Trusted by travellers from over 50 countries to deliver extraordinary India experiences</p>
        <div className="wbu-grid">
          {CARDS.map((c, i) => (
            <div key={i} className="wbu-card fade-up" style={{ transitionDelay: `${i * 0.1}s` }}>
              <div className="wbu-icon">{c.icon}</div>
              <div className="wbu-title">{c.title}</div>
              <div className="wbu-desc">{c.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
