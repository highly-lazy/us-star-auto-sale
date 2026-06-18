import { useEffect, useState } from "react";

// Speedometer "ignition" intro. Plays once per browser session: a gauge needle
// sweeps from 0, the digits count up, the brand reveals, then it fades away.
const KEY = "usstar_intro_shown";

export default function SpeedIntro() {
  const [show, setShow] = useState(() => {
    try {
      return !sessionStorage.getItem(KEY);
    } catch {
      return true;
    }
  });
  const [leaving, setLeaving] = useState(false);
  const [mph, setMph] = useState(0);

  useEffect(() => {
    if (!show) return;

    // Lock scroll while the intro is up.
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Count the digits up to 180.
    let raf;
    const start = performance.now();
    const DURATION = 1500;
    const tick = (now) => {
      const t = Math.min((now - start) / DURATION, 1);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setMph(Math.round(eased * 180));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const leaveTimer = setTimeout(() => setLeaving(true), 1900);
    const doneTimer = setTimeout(() => {
      try { sessionStorage.setItem(KEY, "1"); } catch { /* ignore */ }
      document.body.style.overflow = prev;
      setShow(false);
    }, 2500);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(leaveTimer);
      clearTimeout(doneTimer);
      document.body.style.overflow = prev;
    };
  }, [show]);

  if (!show) return null;

  return (
    <div className={`intro${leaving ? " intro--leaving" : ""}`} role="status" aria-label="Loading US Star Auto Sale">
      <div className="intro-gauge">
        <svg viewBox="0 0 200 200" aria-hidden="true">
          {/* track */}
          <path className="gauge-track" d="M30 165 A 85 85 0 1 1 170 165" />
          {/* progress arc */}
          <path className="gauge-fill" d="M30 165 A 85 85 0 1 1 170 165" />
          {/* tick marks */}
          {Array.from({ length: 9 }).map((_, i) => {
            const a = (-220 + (i * 260) / 8) * (Math.PI / 180);
            const x1 = 100 + Math.cos(a) * 78;
            const y1 = 100 + Math.sin(a) * 78;
            const x2 = 100 + Math.cos(a) * 68;
            const y2 = 100 + Math.sin(a) * 68;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} className="gauge-tick" />;
          })}
          {/* needle */}
          <g className="gauge-needle">
            <line x1="100" y1="100" x2="100" y2="38" />
            <circle cx="100" cy="100" r="9" />
          </g>
        </svg>
        <div className="intro-readout">
          <span className="intro-mph">{mph}</span>
          <span className="intro-unit">MPH</span>
        </div>
      </div>

      <div className="intro-brand">
        <span className="intro-star">★</span>
        US Star Auto Sale
      </div>
      <div className="intro-tag">Premium Used Cars · Knoxville, TN</div>
    </div>
  );
}
