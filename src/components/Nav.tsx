"use client";

import { useEffect, useState } from "react";

type NavLink = { href: string; label: string };

// Square, hairlined, mono buttons -- the site's own language, not the
// glass-pill look borrowed from the reference site in an earlier pass.
// Transparent over the cover photo, gains a background once scrolled past
// it. Collapses to a single menu button under 640px so five buttons never
// have to squeeze or wrap.
//
// Everything here is select-none: a nav button that shows a text-selection
// highlight when someone drags across it reads as a broken link, not a
// button.
export default function Nav({ name, hasVideos }: { name: string; hasVideos: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links: NavLink[] = [
    { href: "#selects", label: "Selects" },
    { href: "#about", label: "About" },
    { href: "#archive", label: "Archive" },
    ...(hasVideos ? [{ href: "#videos", label: "Videos" }] : []),
    { href: "#contact", label: "Contact" },
  ];

  function toTop(e: React.MouseEvent) {
    e.preventDefault();
    setMenuOpen(false);
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 select-none transition-colors duration-base ${
        scrolled ? "border-b border-ink-700 bg-ink-900/90 backdrop-blur" : "bg-transparent"
      }`}
    >
      <div className="flex items-center justify-between px-5 py-4 sm:px-8 md:px-13">
        {/* The name is the way back to the top -- it behaves like a logo,
            so it should act like one. */}
        <a
          href="#top"
          onClick={toTop}
          aria-label="Back to top"
          className="truncate font-mono text-[11px] tracking-[0.2em] text-bone-100 transition-colors duration-fast hover:text-gold-500"
        >
          {name || "Lenar Joshua M. Luna"}
        </a>

        {/* desktop: the full row of hairline buttons */}
        <nav className="hidden items-center border border-bone-100/10 sm:flex">
          {links.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              className={`px-4 py-2.5 font-mono text-[10px] tracking-[0.16em] transition-colors duration-fast ${
                i < links.length - 1 ? "border-r border-bone-100/10" : ""
              } ${
                link.label === "Contact"
                  ? "bg-gold-500 font-bold text-ink-900 hover:bg-bone-100"
                  : "text-bone-100/70 hover:bg-gold-500/12 hover:text-gold-500"
              }`}
            >
              {link.label.toUpperCase()}
            </a>
          ))}
        </nav>

        {/* mobile: a single menu button */}
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-label="Menu"
          className="flex h-9 w-9 items-center justify-center border border-bone-100/15 text-bone-100/80 transition-colors duration-fast hover:border-gold-500 hover:text-gold-500 sm:hidden"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <nav className="flex flex-col border-t border-ink-700 bg-ink-900/95 backdrop-blur sm:hidden">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`border-b border-ink-700 px-5 py-3.5 text-center font-mono text-[11px] tracking-[0.16em] ${
                link.label === "Contact" ? "bg-gold-500 font-bold text-ink-900" : "text-bone-100/75"
              }`}
            >
              {link.label.toUpperCase()}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
