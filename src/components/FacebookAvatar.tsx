import { ZoomTrigger } from "./PhotoViewer";
import { largestSrc, thumbSrc } from "@/lib/media";
import type { MediaImage } from "@/lib/types";

// The Facebook-profile-picture gag: a round picture breaking the cover
// photo's bottom edge. Self-contained on purpose -- see the fence around
// where this is used in ProfileBand.tsx. Deleting this component and that
// fenced block removes the whole feature and leaves nothing behind.
export default function FacebookAvatar({ photo, name }: { photo: MediaImage; name: string }) {
  // Two different files on purpose: a small one to draw the 150px circle,
  // the biggest one for the viewer it opens into.
  const src = thumbSrc(photo);
  const fullSrc = largestSrc(photo);
  if (!src) return null;

  return (
    <div className="flex items-end gap-4">
      <div className="relative h-[110px] w-[110px] flex-shrink-0 rounded-full bg-ink-900 p-[5px] shadow-[0_0_0_1px_#B08850,0_16px_40px_rgba(0,0,0,0.8)] sm:h-[150px] sm:w-[150px]">
        <ZoomTrigger
          images={[{ src: fullSrc, alt: name }]}
          index={0}
          zoomable={false}
          cue="none"
          className="h-full w-full overflow-hidden rounded-full"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={name}
            className="h-full w-full rounded-full object-cover"
            style={{ objectPosition: "50% 20%" }}
          />
        </ZoomTrigger>
      </div>
      <div className="pb-3 sm:pb-4">
        <div className="select-none font-mono text-[10px] font-bold tracking-[0.26em] text-gold-500/90">
          THE MAN HIMSELF
        </div>
      </div>
    </div>
  );
}
