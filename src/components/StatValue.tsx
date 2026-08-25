"use client";

import { useEffect, useRef, useState } from "react";

// Counts up to a numeric stat when it scrolls into view. Falls back to plain
// text for anything that isn't a number ("Quezon City", or the LOREM
// placeholders) -- so the same component handles every stat Lenar might write
// without him needing to know which kind he typed.
//
// Re-arms like Reveal (see Reveal.tsx): scrolling the stat fully out of view
// resets the count, so scrolling back down to it plays the count-up again
// instead of it only ever running the first time. Same -8% off-screen band,
// so it only resets once the number is clearly gone, not right at the edge.
export default function StatValue({ value }: { value: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [display, setDisplay] = useState<string | null>(null);
  const frameRef = useRef<number | null>(null);

  // "80+" -> 80 with a "+" suffix; "Quezon City" -> not numeric, no animation.
  const match = value.match(/^(\d+)(\D*)$/);
  const target = match ? parseInt(match[1], 10) : null;
  const suffix = match ? match[2] : "";

  useEffect(() => {
    if (target === null) return;
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const runCount = () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      const duration = 900;
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        // ease-out so it decelerates into the final number
        const eased = 1 - Math.pow(1 - t, 3);
        setDisplay(String(Math.round(eased * target)));
        frameRef.current = t < 1 ? requestAnimationFrame(tick) : null;
      };
      frameRef.current = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          runCount();
        } else {
          // Off screen: stop mid-count if it was still running, and clear
          // the shown value so the next entry starts the count from 0 again.
          if (frameRef.current !== null) {
            cancelAnimationFrame(frameRef.current);
            frameRef.current = null;
          }
          setDisplay(null);
        }
      },
      { threshold: 0, rootMargin: "-8% 0px -8% 0px" }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [target]);

  return (
    <p
      ref={ref}
      className="font-display text-[clamp(1.5rem,5vw,2.5rem)] leading-none text-bone-100 tabular-nums"
    >
      {target !== null && display !== null ? `${display}${suffix}` : value}
    </p>
  );
}
