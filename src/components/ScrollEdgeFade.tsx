"use client";

import { useEffect, useRef } from "react";

// Replaces the old scroll-progress line (removed at Clint's request). Content
// dissolves into the edge it's leaving instead of being cut off by it:
// scrolling down darkens the top edge and clears the bottom; scrolling up
// does the mirror. Both clear completely at the very top and bottom of the
// page. See BUILD-SPEC.md section 6, "7. Scroll edge fade".
//
// Driven by one throttled scroll listener writing two CSS custom properties
// on the root element -- not a per-frame loop, and not React state, so this
// never causes a re-render.
export default function ScrollEdgeFade() {
  const lastY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    lastY.current = window.scrollY;

    function apply() {
      const y = window.scrollY;
      const direction = y > lastY.current ? "down" : y < lastY.current ? "up" : null;
      lastY.current = y;

      const atTop = y <= 2;
      const doc = document.documentElement;
      const atBottom = y + window.innerHeight >= doc.scrollHeight - 2;

      let top = direction === "down" ? 1 : 0;
      let bottom = direction === "up" ? 1 : 0;
      if (atTop) top = 0;
      if (atBottom) bottom = 0;

      doc.style.setProperty("--fade-top-opacity", String(top));
      doc.style.setProperty("--fade-bottom-opacity", String(bottom));
      ticking.current = false;
    }

    function onScroll() {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(apply);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="edge-fade-top" aria-hidden="true" />
      <div className="edge-fade-bottom" aria-hidden="true" />
    </>
  );
}
