// Third-party proof shown under the hero copy. `score`/`count` stay null until
// we have verified numbers — the pill then links out without claiming a rating.
const SOURCES = [
  {
    key: "google",
    label: "Google Reviews",
    href: "https://maps.google.com/?q=US+Star+Auto+Sale+7665+Maynardville+Pike+Knoxville+TN",
    score: null,
    count: null,
  },
  {
    key: "carfax",
    label: "CARFAX",
    logo: "/assets/icons/carfax.svg",
    href: "https://www.carfax.com/Reviews-US-Star-Auto-Sales-Knoxville-TN_RJR0DUB8CK",
    score: null,
    count: null,
  },
  {
    key: "cargurus",
    label: "CarGurus",
    logo: "/assets/icons/cargurus.svg",
    href: "https://www.cargurus.com/Cars/m-US-Star-Auto-Group-LLC-sp463559",
    score: null,
    count: null,
  },
];

export default function HeroRatings() {
  return (
    <div className="hero-ratings">
      {SOURCES.map((s) => (
        <a className="hero-rating" key={s.key} href={s.href} target="_blank" rel="noopener noreferrer">
          <span className="hero-rating__mark">
            {s.logo ? (
              <img src={s.logo} alt="" loading="lazy" decoding="async" />
            ) : (
              <span className="gmark" aria-hidden="true" style={{ fontSize: 15 }}>
                <i className="g1">G</i><i className="g2">o</i><i className="g3">o</i>
                <i className="g4">g</i><i className="g5">l</i><i className="g6">e</i>
              </span>
            )}
          </span>
          <span className="hero-rating__txt">
            {s.score != null ? <b>★ {s.score}{s.count ? ` · ${s.count}+` : ""}</b> : null}
            <span>{s.label}</span>
          </span>
        </a>
      ))}
    </div>
  );
}
