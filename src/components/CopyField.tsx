"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// The email is plain text with a copy button beside it, not a mailto link.
// A mailto gambles on the visitor having a mail client wired up -- on a work
// desktop it often opens nothing at all, and the address is then lost. Text
// they can copy always works.
export default function CopyField({
  value,
  label,
  mark,
  markHref,
  markLabel,
}: {
  value: string;
  label: string;
  /** Optional brand mark shown inside this same box, on the left. */
  mark?: ReactNode;
  /** If set, the mark becomes a link (e.g. the Gmail logo opening Gmail). */
  markHref?: string;
  markLabel?: string;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Older browsers, or a page not served over https. Fall back to the
      // legacy path rather than leaving the button silently doing nothing.
      const ta = document.createElement("textarea");
      ta.value = value;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch {
        /* nothing more we can do -- the address is still on screen to read */
      }
      document.body.removeChild(ta);
    }
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="flex items-center gap-3 border border-ink-700 px-4 py-3">
      {mark &&
        (markHref ? (
          <a
            href={markHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={markLabel || "Open"}
            className="shrink-0 transition-opacity duration-fast hover:opacity-75"
          >
            {mark}
          </a>
        ) : (
          <span className="shrink-0">{mark}</span>
        ))}
      <div className="min-w-0 flex-grow">
        <div className="select-none font-mono text-[9px] tracking-[0.2em] text-muted-400">{label}</div>
        <div className="mt-1 truncate text-sm">{value}</div>
      </div>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy ${label.toLowerCase()}`}
        className="flex shrink-0 select-none items-center gap-1.5 border border-ink-700 px-2.5 py-1.5 font-mono text-[9px] tracking-[0.14em] text-muted-400 transition-colors duration-fast hover:border-gold-500 hover:text-gold-500"
      >
        {copied ? (
          <>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            COPIED
          </>
        ) : (
          <>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="11" height="11" rx="2" />
              <path d="M5 15V5a2 2 0 0 1 2-2h10" />
            </svg>
            COPY
          </>
        )}
      </button>
    </div>
  );
}
