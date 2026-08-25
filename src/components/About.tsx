import { getAboutPhoto, displaySrc } from "@/lib/media";
import { getSiteContent } from "@/lib/content";
import SectionHeader from "./SectionHeader";
import SoftwareGear from "./SoftwareGear";
import StatValue from "./StatValue";
import Reveal from "./Reveal";

function initials(name: string): string {
  const words = name.split(" ").filter((w) => w.replace(/\./g, "").length > 1);
  return words.slice(0, 3).map((w) => w[0]?.toUpperCase() ?? "").join("");
}

// "02 ABOUT" -- portrait filed like every other frame on the page (REF—00),
// his story, the software/gear split, and a stats strip. Comes before the
// archive: SELECTS already proved he can shoot, so by the time a visitor
// reaches this far they've decided they like the work and now want the
// person. See BUILD-SPEC.md section 4.
export default function About() {
  const { you, about, software, gear } = getSiteContent();
  const photo = getAboutPhoto();
  const src = photo ? displaySrc(photo) : undefined;

  return (
    <section id="about" className="px-5 py-16 sm:px-13 sm:py-22">
      <Reveal>
        <SectionHeader number="02" label="ABOUT" />
      </Reveal>

      <div className="grid grid-cols-1 gap-9 lg:grid-cols-12 lg:items-start">
        <Reveal className="lg:col-span-4">
          <div className="portrait-grade relative aspect-[4/5] overflow-hidden bg-ink-800">
            {src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={src} alt={you.name} className="h-full w-full object-cover" style={{ objectPosition: "50% 40%" }} />
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="px-6 text-center font-mono text-xs text-muted-400">
                  Add a photo to public/photos/4-about-photo
                </p>
              </div>
            )}
          </div>
          <div className="mt-3 flex items-baseline justify-between border-t border-ink-700 pt-2.5">
            <div>
              <div className="text-sm font-black uppercase tracking-[-0.01em]">{you.name}</div>
              <div className="mt-1 font-mono text-[9px] tracking-[0.18em] text-gold-500">
                {you.role.toUpperCase() || "PHOTOGRAPHER · VIDEOGRAPHER"}
              </div>
            </div>
            <div className="font-mono text-[9px] text-muted-400">{initials(you.name) || "LJL"}—00</div>
          </div>
        </Reveal>

        <Reveal className="lg:col-span-8">
          <h2 className="max-w-[17ch] font-display text-[1.9rem] font-black uppercase leading-[1.08] tracking-[-0.03em] sm:text-[2.15rem]">
            {about.heading}
          </h2>

          {about.story && (
            <div className="mt-5 max-w-[58ch] text-[15px] leading-[1.82] text-muted-400">
              {about.story.split(/\n\s*\n/).map((para, i) => (
                <p key={i} className={i > 0 ? "mt-4" : ""}>
                  {para}
                </p>
              ))}
            </div>
          )}

          {/* SOFTWARE USED, then GEAR USED, then the longer bio underneath
              both -- the part someone reads once they've scrolled this far
              and want the full story. */}
          <SoftwareGear software={software} gear={gear} />

          {about.extendedBio && (
            <div className="mt-9 border-t border-ink-700 pt-6">
              <div className="mb-3 select-none font-mono text-[10px] tracking-[0.22em] text-muted-400">
                MORE ABOUT HIM
              </div>
              <div className="max-w-[62ch] text-[15px] leading-[1.85] text-muted-400">
                {about.extendedBio.split(/\n\s*\n/).map((para, i) => (
                  <p key={i} className={i > 0 ? "mt-4" : ""}>
                    {para}
                  </p>
                ))}
              </div>
            </div>
          )}

          {about.stats.length > 0 && (
            <div className="mt-7 grid grid-cols-2 gap-5 border-t border-ink-700 pt-5 sm:grid-cols-4">
              {about.stats.map((stat) => (
                <div key={stat.label}>
                  <StatValue value={stat.value} />
                  <div className="mt-1.5 font-mono text-[9px] tracking-[0.16em] text-muted-400">
                    {stat.label.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
