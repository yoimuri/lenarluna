"use client";

import { useEffect, useState } from "react";
import { extractYouTubeId, youtubeEmbedUrl, youtubeThumbnail } from "@/lib/youtube";

// YouTube's "no maxres available" placeholder decodes at 120px wide.
// A real maxresdefault is 1280. Anything at or under this is the placeholder.
const PLACEHOLDER_MAX_WIDTH = 120;

// Poster image plus a play button; the real YouTube iframe only loads once
// someone actually clicks. Keeps the page fast no matter how many videos
// Lenar adds. See BUILD-SPEC.md section 7 and AD-11.
//
// Whether THIS card is playing is passed in, not owned locally -- see
// VideoGrid.tsx. Every embed autoplays, so two of these mounted at once are
// two autoplaying cross-origin iframes fighting for bandwidth/CPU, and the
// second one stalls at "loading" instead of starting. Controlling "which one
// is playing" from one place, one level up, is what makes starting a new
// video stop the previous one instead of piling up.
export default function YouTubeFacade({
  link,
  title,
  description,
  index,
  playing,
  onPlay,
  onStop,
}: {
  link: string;
  title: string;
  description?: string;
  index: number;
  playing: boolean;
  onPlay: () => void;
  onStop: () => void;
}) {
  const id = extractYouTubeId(link);
  const [posterFailed, setPosterFailed] = useState(false);

  // Escape closes it too, matching the photo viewer. Note this listener can
  // only fire while focus is OUTSIDE the iframe -- once someone clicks into
  // the YouTube player, key events belong to that cross-origin document and
  // never reach us. The visible close button is the reliable route; this is
  // a convenience on top of it, not a replacement for it.
  useEffect(() => {
    if (!playing) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onStop();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [playing, onStop]);

  if (!id) return null;

  // Not every video has a maxresdefault. When it's missing YouTube does NOT
  // 404 -- it serves a 120x90 grey placeholder with HTTP 200, so `onError`
  // never fires and you get a grey card instead of a thumbnail. Checking the
  // decoded width is the only reliable way to catch it.
  const poster = posterFailed ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : youtubeThumbnail(id);

  return (
    <div>
      <div className="relative aspect-video overflow-hidden bg-ink-800">
        {playing ? (
          <>
            <iframe
              src={youtubeEmbedUrl(id)}
              title={title || "Video"}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            {/* Unmounting the iframe is what actually stops playback -- there
                is no way to pause a cross-origin YouTube embed without
                loading their player API, and that is a whole extra script
                for one button. Tearing it down returns the card to a still
                poster and leaves nothing running in the background. */}
            <button
              type="button"
              onClick={onStop}
              aria-label={`Stop ${title || "video"}`}
              className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-bone-100/30 bg-ink-900/80 text-bone-100 backdrop-blur-sm transition-colors duration-fast hover:border-gold-500 hover:text-gold-500"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onPlay}
            className="group relative block h-full w-full"
            aria-label={`Play ${title || "video"}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={poster}
              alt=""
              onError={() => setPosterFailed(true)}
              onLoad={(e) => {
                if (!posterFailed && e.currentTarget.naturalWidth > 0 && e.currentTarget.naturalWidth <= PLACEHOLDER_MAX_WIDTH) {
                  setPosterFailed(true);
                }
              }}
              className="h-full w-full object-cover opacity-60 transition-opacity duration-base group-hover:opacity-75"
            />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold-500/90 shadow-[0_8px_30px_rgba(0,0,0,0.7)] transition-transform duration-fast group-hover:scale-105">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="#0F0F0A">
                  <path d="M7 4.5v15l13-7.5z" />
                </svg>
              </span>
            </span>
            <span className="absolute left-2.5 top-2 font-mono text-[9px] tracking-[0.2em] text-gold-500 [text-shadow:0_1px_3px_rgba(0,0,0,.9)]">
              V—{String(index + 1).padStart(2, "0")}
            </span>
          </button>
        )}
      </div>
      {(title || description) && (
        <div className="mt-2.5 border-t border-ink-700 pt-2.5">
          {title && <div className="text-sm font-bold">{title}</div>}
          {description && (
            <p className="mt-1 text-xs leading-relaxed text-muted-400">{description}</p>
          )}
        </div>
      )}
    </div>
  );
}
