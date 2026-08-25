import { getBestWork, largestSrc } from "@/lib/media";
import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";
import SelectsInteractive from "./SelectsInteractive";
import type { ViewerImage } from "./PhotoViewer";

// "01 SELECTS" -- whatever sits in public/photos/3-best-work, shown first.
// The "most impressive at a glance" band described in BUILD-SPEC.md §4.
export default function Selects() {
  const photos = getBestWork();
  if (photos.length === 0) return null;

  const viewerImages: ViewerImage[] = photos.map((p) => ({
    src: largestSrc(p),
    alt: p.alt,
    caption: p.caption || undefined,
    description: p.description || undefined,
  }));

  return (
    <section id="selects" className="px-5 pt-13 sm:px-13">
      <Reveal>
        <div className="mb-6">
          <SectionHeader number="01" label="SELECTS" />
          <h2 className="select-none font-display text-[2.2rem] font-black uppercase leading-[0.96] tracking-[-0.035em] sm:text-[2.9rem]">
            Highlights
          </h2>
        </div>
      </Reveal>

      <SelectsInteractive photos={photos} viewerImages={viewerImages} />
    </section>
  );
}
