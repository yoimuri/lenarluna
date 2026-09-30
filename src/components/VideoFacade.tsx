"use client";

import { useEffect, useState } from "react";
import type { VideoSource } from "@/lib/video";
import { videoEmbedUrl, videoThumbnail, videoThumbnailFallback } from "@/lib/video";

// YouTube's "no maxres available" placeholder decodes at 120px wide.
// A real maxresdefault is 1280. Anything at or under this is the placeholder.
const PLACEHOLDER_MAX_WIDTH = 120;

// Poster image plus a play button; the real player only loads once someone
// actually clicks. Keeps the page fast no matter how many videos Lenar adds.
// See BUILD-SPEC.md section 7 and AD-11.
//
// Whether THIS card is playing is passed in, not owned locally -- see
// VideoGrid.tsx. Two players mounted at once fight for bandwidth and the
// second one stalls, so "which one is playing" lives one level up.
export default function VideoFacade({
  source,
  title,
  description,
  index,
  playing,
  onPlay,
  onStop,
}: {
  source: VideoSource;
  title: string;
  description?: string;
  index: number;
  playing: boolean;
  onPlay: () => void;
  onStop: () => void;
}) {
  const [posterFailed, setPosterFailed] = useState(false);
  const [posterGone, setPosterGone] = useState(false);

  // Escape closes it too, matching the photo viewer. Note this listener can
  // only fire while focus is OUTSIDE the iframe -- once someone clicks into
  // the player, key events belong to that cross-origin document and never
  // reach us. The visible close button is the reliable route.
  useEffect(() => {
    if (!playing) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onStop();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [playing, onStop]);

  const fallback = videoThumbnailFallback(source);
  const poster = posterFailed && fallback ? fallback : videoThumbnail(source);

  function posterUnusable() {
    // YouTube gets one retry at a smaller size; Drive has no second address,
    // so a failure there goes straight to the drawn placeholder below.
    if (!posterFailed && fallback) setPosterFailed(true);
    else setPosterGone(true);
  }

  return (
    <div>
      <div className="relative aspect-video overflow-hidden bg-ink-800">
        {playing ? (
          <>
            <iframe
              src={videoEmbedUrl(source)}
              title={title || "Video"}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            {/* Unmounting the iframe is what actually stops playback -- there
                is no way to pause a cross-origin embed without loading that
                platform's player API. Tearing it down returns the card to a
                still and leaves nothing running in the background. */}
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
            {/* Google Drive has no documented thumbnail guarantee the way
                YouTube does, so a missing still is treated as normal rather
                than as an error: the card falls back to its own dark panel
                and still reads as a video. Never a broken-image icon. */}
            {posterGone ? (
              <span className="absolute inset-0 bg-gradient-to-br from-ink-800 to-ink-900" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={poster}
                alt=""
                onError={posterUnusable}
                onLoad={(e) => {
                  if (e.currentTarget.naturalWidth > 0 && e.currentTarget.naturalWidth <= PLACEHOLDER_MAX_WIDTH) {
                    posterUnusable();
                  }
                }}
                className="h-full w-full object-cover opacity-60 transition-opacity duration-base group-hover:opacity-75"
              />
            )}
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
