"use client";

import { useEffect, useRef, type ReactNode } from "react";

// The "aperture reveal" -- see BUILD-SPEC.md section 6.1. Wrap any block of
// content with this and it clip-path wipes + settles into place as it enters
// the viewport.
//
// It re-arms: leaving the viewport resets it, so scrolling back up and down
// plays the reveal again instead of the page going flat after one pass.
// The reset only fires once an element is clearly OFF screen (a negative
// rootMargin band), never while it is merely near the edge -- resetting at
// the boundary is what makes this kind of effect strobe when someone
// scrolls slowly.
export default function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Honour the OS setting directly: never hide content that will not be
    // animated back into view.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.classList.add("is-visible");
        else el.classList.remove("is-visible");
      },
      { threshold: 0, rootMargin: "-8% 0px -8% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
}
