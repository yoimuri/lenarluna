"use client";

import { useState } from "react";
import type { MediaImage } from "@/lib/types";
import { ZoomTrigger, type ViewerImage } from "./PhotoViewer";
import Reveal from "./Reveal";

const INITIAL = 6;

// The Highlights grid. Asymmetric -- one dominant frame plus supporting
// ones -- with a show more / show less control once there are more than
// six, so a long highlight reel doesn't push the whole page down.
export default function SelectsInteractive({
  photos,
  viewerImages,
}: {
  photos: MediaImage[];
  viewerImages: ViewerImage[];
}) {
  const [expanded, setExpanded] = useState(false);
  const hasMore = photos.length > INITIAL;
  const shown = expanded ? photos : photos.slice(0, INITIAL);

  return (
    <>
      <div className="grid grid-cols-1 gap-2.5 sm:auto-rows-[180px] sm:grid-cols-12">
        {shown.map((photo, i) => {
          const src = photo.srcset.find((s) => s.width >= 1280)?.path ?? photo.srcset.at(-1)!.path;
          // Repeat the 7/5/5/4/4/4 rhythm for every block of six, so an
          // expanded grid keeps the same composition instead of degrading
          // into a plain row of equal tiles.
          const slot = i % 6;
          const spanClass =
            slot === 0
              ? "sm:col-span-7 sm:row-span-2"
              : slot === 1 || slot === 2
                ? "sm:col-span-5"
                : "sm:col-span-4";
          return (
            <Reveal key={photo.path} className={spanClass}>
              <ZoomTrigger
                images={viewerImages}
                index={i}
                className="group relative aspect-[3/2] overflow-hidden bg-ink-800 sm:aspect-auto sm:h-full"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={photo.alt}
                  className="h-full w-full object-cover transition-transform duration-base ease-shutter group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-900/80 to-transparent to-45%" />
                <div className="pointer-events-none absolute bottom-4 left-4 right-4">
                  <div className="select-none font-mono text-[9px] tracking-[0.2em] text-gold-500">
                    S—{String(i + 1).padStart(2, "0")}
                  </div>
                  {photo.caption && (
                    <div
                      className={`mt-1.5 font-bold tracking-[-0.012em] ${slot === 0 ? "text-lg" : "text-sm"}`}
                    >
                      {photo.caption}
                    </div>
                  )}
                  {photo.description && slot === 0 && (
                    <div className="mt-1 max-w-[46ch] text-xs leading-relaxed text-bone-100/70">
                      {photo.description}
                    </div>
                  )}
                </div>
              </ZoomTrigger>
            </Reveal>
          );
        })}
      </div>

      {hasMore && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="flex select-none items-center gap-2.5 border border-gold-500 bg-gold-500/10 px-6 py-3 font-mono text-[10px] tracking-[0.18em] text-gold-500 transition-colors duration-fast hover:bg-gold-500/20"
          >
            {expanded ? "SHOW LESS" : `SHOW ALL ${photos.length}`}
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform duration-base ease-shutter ${expanded ? "rotate-180" : ""}`}
            >
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
