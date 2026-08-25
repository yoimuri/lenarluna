"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import YouTubeFacade from "./YouTubeFacade";
import type { VideoItem } from "@/lib/types";

// One video plays at a time. This holds "which index is active" so starting
// a new video (setActiveIndex) always stops whichever one was already
// playing, instead of every card owning its own on/off switch and letting
// two autoplaying YouTube embeds run at once (see YouTubeFacade.tsx).
//
// Split out from Videos.tsx because Videos.tsx reads content from disk
// (getSiteContent) and must stay a server component -- that read can only
// happen at build/request time, never re-run in the browser. This piece is
// just the interactive grid, handed the already-loaded videos as a prop.
export default function VideoGrid({ videos }: { videos: VideoItem[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {videos.map((v, i) => (
        <Reveal key={v.link}>
          <YouTubeFacade
            link={v.link}
            title={v.title}
            description={v.description}
            index={i}
            playing={activeIndex === i}
            onPlay={() => setActiveIndex(i)}
            onStop={() => setActiveIndex((current) => (current === i ? null : current))}
          />
        </Reveal>
      ))}
    </div>
  );
}
