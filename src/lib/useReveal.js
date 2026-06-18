import { useEffect } from "react";

// Reveals elements with the `.reveal` class as they scroll into view by adding
// `.reveal--in`. Call once near the top of a page; re-runs when `deps` change
// (e.g. after async content like cars loads and adds more `.reveal` nodes).
export function useReveal(deps = []) {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll(".reveal:not(.reveal--in)"));
    if (!els.length) return;

    if (typeof IntersectionObserver === "undefined") {
      els.forEach((el) => el.classList.add("reveal--in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("reveal--in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
