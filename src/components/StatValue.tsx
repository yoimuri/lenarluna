"use client";

import { useEffect, useRef, useState } from "react";

// Counts up to a numeric stat when it scrolls into view. Falls back to plain
// text for anything that isn't a number ("Quezon City", or the LOREM
// placeholders) -- so the same component handles every stat Lenar might write
// without him needing to know which kind he typed.
export default function StatValue({ value }: { value: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [display, setDisplay] = useState<string | null>(null);

  // "80+" -> 80 with a "+" suffix; "Quezon City" -> not numeric, no animation.
  const match = value.match(/^(\d+)(\D*)$/);
  const target = match ? parseInt(match[1], 10) : null;
  const suffix = match ? match[2] : "";

  useEffect(() => {
    if (target === null) return;
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const duration = 900;
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          // ease-out so it decelerates into the final number
          const eased = 1 - Math.pow(1 - t, 3);
          setDisplay(String(Math.round(eased * target)));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
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
