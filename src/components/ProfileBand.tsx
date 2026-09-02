import { getCoverPhoto, getProfilePicture, displaySrc, largestSrc } from "@/lib/media";
import { getSiteContent } from "@/lib/content";
import { ZoomTrigger } from "./PhotoViewer";
import FacebookAvatar from "./FacebookAvatar";

// The site's answer to a Facebook profile, set in the site's own type: a
// full-bleed cover photo, a round picture breaking its bottom edge, and a
// one-line quote beside it. See BUILD-SPEC.md section 4, "2. Profile band".
export default function ProfileBand() {
  const { you } = getSiteContent();
  const cover = getCoverPhoto();
  const profile = getProfilePicture();

  return (
    <>
      <div className="relative h-[64vh] min-h-[420px] overflow-hidden sm:h-[640px]">
        {cover ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={displaySrc(cover)}
              alt={you.name}
              className="hero-bg absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: "52% 30%" }}
            />
            {/* The clickable layer sits UNDER the name block (z-10 vs z-20),
                so the cover's hit area stops at the type instead of swallowing
                clicks meant for it. */}
            {/* No hover cue at all on the cover: a badge floating over the
                hero photo reads as clutter on the one image that is meant to
                be looked at, not operated. It still opens a full view on
                click; it just does not advertise it. */}
            <ZoomTrigger
              images={[{ src: largestSrc(cover), alt: you.name, caption: you.coverCaption || undefined }]}
              index={0}
              zoomable={false}
              cue="none"
              className="absolute inset-0 z-10 h-full w-full"
            >
              <span className="sr-only">View cover photo full size</span>
            </ZoomTrigger>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-ink-800">
            <p className="font-mono text-xs text-muted-400">
              Add a photo to public/photos/1-cover-photo
            </p>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-ink-900/50 via-transparent to-ink-900" />

        {you.coverCaption && (
          /* Position flips by width, because the bottom of this photo is
             crowded from both sides: on desktop the caption sits bottom-right,
             clear of the name (bottom-left) and of the avatar/quote band that
             pulls up over the cover's edge. On a phone the name is nearly
             full-width and there is no clear bottom-right, so the caption
             moves to the top instead, under the nav. */
          <p className="pointer-events-none absolute right-5 top-20 z-20 max-w-[60%] select-none text-right font-mono text-[9px] tracking-[0.16em] text-bone-100/55 xl:bottom-28 xl:right-13 xl:top-auto xl:max-w-[40%]">
            {you.coverCaption}
          </p>
        )}

        {/* z-20 puts the whole type block above the cover's click layer.
            The bottom offset has to clear the avatar row, which pulls up
            over this photo's bottom edge -- at bottom-8 the profile circle
            sat on top of the role line on a phone. */}
        <div className="absolute bottom-20 left-5 z-20 sm:bottom-[74px] sm:left-13">
          <div className="mb-4 h-[2px] w-10 bg-gold-500 sm:mb-5" />
          <h1 className="select-none font-display text-[2.6rem] font-black uppercase leading-[0.86] tracking-[-0.042em] sm:text-[4.2rem] lg:text-[4.75rem]">
            {(you.name || "Lenar Joshua M. Luna").split(" ").reduce<string[]>((lines, word, i, arr) => {
              const mid = Math.ceil(arr.length / 2);
              if (i === 0) lines.push("");
              if (i === mid) lines.push("");
              lines[lines.length - 1] = `${lines[lines.length - 1]} ${word}`.trim();
              return lines;
            }, []).map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </h1>
          {/* Tighter tracking on a phone: at 0.24em this line ran to within
              4px of the right edge at 375px and read as clipped. */}
          <p className="mt-4 inline-block select-none pr-5 font-mono text-[9px] uppercase tracking-[0.14em] text-gold-500 sm:mt-5 sm:pr-0 sm:text-[11px] sm:tracking-[0.24em]">
            {you.role || "Photography · Videography · Video Editing"}
          </p>
        </div>
      </div>

      {/* Avatar and quote share one row -- the round picture breaks the
          cover's bottom edge, his line sits beside him. */}
      <div className="relative z-20 -mt-12 grid grid-cols-1 items-end gap-6 px-5 pb-10 sm:-mt-[58px] sm:px-13 sm:pb-12 lg:grid-cols-12 lg:items-center lg:gap-11">
        {/* ▼▼▼ MEME BLOCK — DELETE FROM HERE ▼▼▼
            Delete this whole {profile && (...)} block plus
            src/components/FacebookAvatar.tsx to remove the profile-picture
            gag. The quote beside it is a SEPARATE block and keeps working on
            its own -- it already falls back to lg:col-span-12 when there is
            no profile picture, so nothing else needs touching. */}
        {profile && (
          <div className="lg:col-span-5">
            <FacebookAvatar photo={profile} name={you.name} />
          </div>
        )}
        {/* ▲▲▲ MEME BLOCK — DELETE TO HERE ▲▲▲ */}

        {you.quote && (
          <div className={profile ? "lg:col-span-7" : "lg:col-span-12"}>
            <div className="border-l-2 border-gold-500 py-1 pl-5 sm:pl-6">
              <svg width="20" height="16" viewBox="0 0 24 20" fill="#B08850" opacity="0.45" className="mb-2">
                <path d="M0 20V11C0 4.9 3.4 1 9.2 0l1 2.6C6.6 3.7 4.9 5.7 4.9 8.4H9V20H0zm14 0v-9c0-6.1 3.4-10 9.2-11l1 2.6c-3.6 1.1-5.3 3.1-5.3 5.8H23V20h-9z" />
              </svg>
              {/* Instrument Serif italic -- the one "designed" typeface on the
                  page, used here and nowhere else so it stays an accent. */}
              <p className="font-quote text-[1.6rem] italic leading-[1.3] text-bone-100 sm:text-[2rem]">
                {you.quote}
              </p>
              <p className="mt-3 select-none font-mono text-[9px] tracking-[0.2em] text-muted-400">
                — {(you.quoteAuthor || you.name || "LENAR JOSHUA M. LUNA").toUpperCase()}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
