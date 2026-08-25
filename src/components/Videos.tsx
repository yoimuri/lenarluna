import { getSiteContent } from "@/lib/content";
import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";
import YouTubeFacade from "./YouTubeFacade";

// "04 VIDEOS" -- its own section with its own nav button, entirely out of
// the archive (AD-10). Renders nothing at all if there are no videos yet --
// see Nav.tsx for the matching nav-button hide. See BUILD-SPEC.md section 4.
export default function Videos() {
  const { videos, videosIntro } = getSiteContent();
  if (videos.length === 0) return null;

  return (
    <section id="videos" className="bg-[#12120C] px-5 py-16 sm:px-13 sm:py-22">
      <Reveal>
        <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <SectionHeader number="04" label="VIDEOS" />
            <h2 className="font-display text-[2.2rem] font-black uppercase leading-[0.96] tracking-[-0.035em] sm:text-[2.9rem]">
              Work That Moves
            </h2>
          </div>
          {videosIntro && (
            <p className="max-w-[38ch] text-sm leading-relaxed text-muted-400 sm:text-right">
              {videosIntro}
            </p>
          )}
        </div>
      </Reveal>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((v, i) => (
          <Reveal key={v.link}>
            <YouTubeFacade link={v.link} title={v.title} description={v.description} index={i} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
