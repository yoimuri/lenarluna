"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Category, MediaImage } from "@/lib/types";
import { largestSrc, thumbSrc } from "@/lib/media";
import { ZoomTrigger, type ViewerImage } from "./PhotoViewer";

const PAGE_SIZE = 8;
const LOAD_MORE = 12;

type Tab = { slug: string; label: string; images: MediaImage[] };

function toViewerImage(img: MediaImage): ViewerImage {
  return {
    // The LARGEST file, not a mid-size one: the viewer is where someone
    // zooms to 200%, and handing it a 1280px file made that pointless.
    src: largestSrc(img),
    alt: img.alt,
    caption: img.caption || undefined,
    description: img.description || undefined,
  };
}

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function ArchiveInteractive({ categories, total }: { categories: Category[]; total: number }) {
  const tabs: Tab[] = useMemo(() => {
    const all: MediaImage[] = categories.flatMap((c) => c.images);
    return [{ slug: "all", label: "All", images: all }, ...categories];
  }, [categories]);

  const [selected, setSelected] = useState(0);
  const [visible, setVisible] = useState(PAGE_SIZE);
  // idle: settled. leaving: old set fading out. enter-start: new set already
  // swapped in but rendered at its offset/hidden starting position (one
  // frame only, so the browser has something to transition FROM). enter-end:
  // same content, now told to animate to visible/centred -- THIS is the
  // class change that actually plays the incoming transition.
  const [phase, setPhase] = useState<"idle" | "leaving" | "enter-start" | "enter-end">("idle");
  const [dir, setDir] = useState<"left" | "right">("right");
  const gridWrapRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  // Which frame the visitor is actually looking at, so the counter reads
  // like a contact sheet being scanned rather than a static "how many are
  // loaded" number.
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStart = useRef<number | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const frames = useRef<number[]>([]);

  const current = tabs[selected];

  function goTo(nextIndex: number) {
    if (nextIndex === selected || nextIndex < 0 || nextIndex >= tabs.length) return;
    const nextDir = nextIndex > selected ? "right" : "left";
    setDir(nextDir);
    timers.current.forEach(clearTimeout);
    timers.current = [];
    frames.current.forEach(cancelAnimationFrame);
    frames.current = [];

    if (prefersReducedMotion()) {
      setSelected(nextIndex);
      setVisible(PAGE_SIZE);
      setActiveIndex(0);
      setPhase("idle");
      return;
    }

    // Lock the grid's current height so the page below doesn't jump while
    // the outgoing set fades and the incoming set (possibly shorter) fades in.
    const wrap = gridWrapRef.current;
    if (wrap) wrap.style.minHeight = `${wrap.offsetHeight}px`;

    setPhase("leaving");
    const t1 = setTimeout(() => {
      setSelected(nextIndex);
      setVisible(PAGE_SIZE);
      setActiveIndex(0);
      setPhase("enter-start");
      // Two rAFs: the first commits the enter-start (offset/hidden) paint,
      // the second flips to enter-end so the browser has a real "from" frame
      // to transition away from instead of collapsing both into one paint.
      const f1 = requestAnimationFrame(() => {
        const f2 = requestAnimationFrame(() => setPhase("enter-end"));
        frames.current.push(f2);
      });
      frames.current.push(f1);
      const t2 = setTimeout(() => {
        setPhase("idle");
        if (wrap) wrap.style.minHeight = "";
      }, 320);
      timers.current.push(t2);
    }, 260);
    timers.current.push(t1);
  }

  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
      frames.current.forEach(cancelAnimationFrame);
    },
    []
  );

  // The Index of Services links to `#cat-<slug>`. Selecting from a hash keeps
  // those rows as ordinary links -- they work with middle-click, they can be
  // copied, and they survive JS being slow -- while still switching the tab
  // here instead of just dumping the visitor at the top of the Archive.
  useEffect(() => {
    function applyHash() {
      const m = window.location.hash.match(/^#cat-(.+)$/);
      if (!m) return;
      const i = tabs.findIndex((t) => t.slug === decodeURIComponent(m[1]));
      if (i < 0) return;
      setSelected(i);
      setVisible(PAGE_SIZE);
      setActiveIndex(0);
      setPhase("idle");
      document.getElementById("archive")?.scrollIntoView({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: "start",
      });
    }
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, [tabs]);

  // Track the most-visible tile. Re-created whenever the rendered set
  // changes (category switch, load more), because the observed nodes change.
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const tiles = Array.from(grid.children) as HTMLElement[];
    if (tiles.length === 0) return;

    const ratios = new Map<number, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const i = Number((entry.target as HTMLElement).dataset.frame);
          if (Number.isNaN(i)) continue;
          ratios.set(i, entry.isIntersecting ? entry.intersectionRatio : 0);
        }
        let bestIndex = -1;
        let bestRatio = 0;
        // Ties go to the LOWEST index, so a row of equally-visible tiles
        // reports the leftmost rather than flickering between them.
        for (const [i, r] of [...ratios.entries()].sort((a, b) => a[0] - b[0])) {
          if (r > bestRatio + 0.01) {
            bestRatio = r;
            bestIndex = i;
          }
        }
        if (bestIndex >= 0) setActiveIndex(bestIndex);
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    tiles.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [selected, visible]);

  function onTouchStart(e: React.TouchEvent) {
    touchStart.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStart.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStart.current;
    touchStart.current = null;
    if (Math.abs(dx) < 40) return;
    if (dx < 0) goTo(selected + 1); // swipe left -> next category
    else goTo(selected - 1); // swipe right -> previous category
  }

  const shown = current.images.slice(0, visible);
  const viewerImages = current.images.map(toViewerImage);
  const remaining = current.images.length - shown.length;

  // "leaving" fades the OUTGOING set out toward the direction of travel.
  // "enter-start" places the INCOMING set already-swapped but still offset
  // and hidden, arriving from the opposite side; "enter-end" (one frame
  // later) tells it to animate to visible/centred. idle just sits still.
  const offsetClass = dir === "right" ? "translate-x-4" : "-translate-x-4";
  const leavingOffsetClass = dir === "right" ? "-translate-x-4" : "translate-x-4";
  const durationClass = phase === "leaving" ? "duration-[260ms]" : "duration-[320ms]";
  const stateClass =
    phase === "leaving"
      ? `opacity-0 ${leavingOffsetClass}`
      : phase === "enter-start"
        ? `opacity-0 ${offsetClass}`
        : "opacity-100 translate-x-0"; // enter-end and idle both settle here

  return (
    <div>
      {/* wrapped category tabs -- never a horizontally-scrolling row (that
          overflowed by a measured 593px in an earlier pass). */}
      <div className="mb-6 grid select-none grid-cols-2 gap-px border border-ink-700 bg-ink-700 sm:grid-cols-4 lg:grid-cols-6">
        {tabs.map((tab, i) => (
          <button
            key={tab.slug}
            type="button"
            onClick={() => goTo(i)}
            className={`px-3 py-3 text-left transition-colors duration-fast ${
              i === selected ? "border-b-2 border-gold-500 bg-ink-700" : "bg-ink-900 hover:bg-ink-800"
            }`}
          >
            <div className={`truncate text-[11px] font-bold uppercase ${i === selected ? "text-bone-100" : "text-muted-400"}`}>
              {tab.label}
            </div>
            <div className={`mt-1 font-mono text-[9px] ${i === selected ? "text-gold-500" : "text-muted-400"}`}>
              {String(tab.images.length).padStart(2, "0")}
            </div>
          </button>
        ))}
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous category"
            onClick={() => goTo(selected - 1)}
            disabled={selected === 0}
            className="flex h-8 w-8 items-center justify-center border border-ink-700 text-muted-400 transition-colors duration-fast hover:border-gold-500 hover:text-gold-500 disabled:opacity-30 disabled:hover:border-ink-700 disabled:hover:text-muted-400"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7" /></svg>
          </button>
          <button
            type="button"
            aria-label="Next category"
            onClick={() => goTo(selected + 1)}
            disabled={selected === tabs.length - 1}
            className="flex h-8 w-8 items-center justify-center border border-ink-700 text-muted-400 transition-colors duration-fast hover:border-gold-500 hover:text-gold-500 disabled:opacity-30 disabled:hover:border-ink-700 disabled:hover:text-muted-400"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
        {/* Reads like a contact sheet being scanned: the left number is the
            frame currently in view, not a count of what happens to be
            loaded. The "of N" only appears while some are still unloaded,
            so the common case is just "FRAME 09 / 66". */}
        <span className="select-none font-mono text-[10px] tracking-[0.16em] text-muted-400">
          FRAME{" "}
          <span className="text-gold-500">
            {String(Math.min(activeIndex + 1, shown.length)).padStart(2, "0")}
          </span>
          {" / "}
          {String(current.images.length).padStart(2, "0")}
          {shown.length < current.images.length && (
            <span className="ml-3 text-muted-400/60">
              {String(shown.length).padStart(2, "0")} SHOWN
            </span>
          )}
        </span>
      </div>

      <div ref={gridWrapRef} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div
          ref={gridRef}
          className={`grid grid-cols-1 gap-2.5 ease-shutter transition-[opacity,transform] sm:grid-cols-2 lg:grid-cols-4 ${durationClass} ${stateClass}`}
        >
          {shown.map((img, i) => (
            <ZoomTrigger
              key={img.path}
              images={viewerImages}
              index={i}
              data-frame={i}
              className="group relative aspect-[3/2] overflow-hidden bg-ink-800"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumbSrc(img)}
                alt={img.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-base ease-shutter group-hover:scale-105"
              />
              <span className="pointer-events-none absolute left-2.5 top-2 select-none font-mono text-[9px] text-bone-100/70 [text-shadow:0_1px_3px_rgba(0,0,0,.9)]">
                {String(i + 1).padStart(2, "0")}/{String(current.images.length).padStart(2, "0")}
              </span>
              {img.caption && (
                <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-900/90 to-transparent p-3 pt-8 opacity-0 transition-opacity duration-base group-hover:opacity-100">
                  <span className="block text-xs font-bold leading-tight">{img.caption}</span>
                  {img.description && (
                    <span className="mt-0.5 block text-[11px] leading-snug text-bone-100/70">
                      {img.description}
                    </span>
                  )}
                </span>
              )}
            </ZoomTrigger>
          ))}
        </div>
      </div>

      {shown.length === 0 && (
        <p className="py-10 text-center font-mono text-xs text-muted-400">
          No photos in this category yet.
        </p>
      )}

      {remaining > 0 && (
        <div className="mt-6 flex justify-center gap-2.5">
          <button
            type="button"
            onClick={() => setVisible((v) => Math.min(current.images.length, v + LOAD_MORE))}
            className="select-none border border-ink-700 px-6 py-3 font-mono text-[10px] tracking-[0.18em] transition-colors duration-fast hover:border-gold-500 hover:text-gold-500"
          >
            LOAD {Math.min(LOAD_MORE, remaining)} MORE
          </button>
          <button
            type="button"
            onClick={() => setVisible(current.images.length)}
            className="select-none border border-gold-500 bg-gold-500/10 px-6 py-3 font-mono text-[10px] tracking-[0.18em] text-gold-500 transition-colors duration-fast hover:bg-gold-500/20"
          >
            LOAD ALL {current.images.length}
          </button>
        </div>
      )}
    </div>
  );
}
