import { useEffect, useRef, useState } from "react";

// Counts from 0 to `end` once it scrolls into view.
export default function CountUp({ end = 50, suffix = "", duration = 1400 }) {
  const ref = useRef(null);
  const [val, setVal] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !end) return;
    // `end` arrives after cars.json loads — re-arm so the count isn't stuck at 0.
    done.current = false;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !done.current) {
          done.current = true;
          const start = performance.now();
          const step = (now) => {
            const t = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            setVal(Math.round(eased * end));
            if (t < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    // Safety net: if the observer never fires (element off-screen in a
    // print/screenshot context, IO unsupported), show the real number anyway.
    const snap = setTimeout(() => setVal((v) => (v === 0 ? end : v)), duration + 900);
    return () => {
      io.disconnect();
      clearTimeout(snap);
    };
  }, [end, duration]);

  return <span ref={ref}>{val}{suffix}</span>;
}
