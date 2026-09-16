// Loads and lightly normalizes the edit-me/ files at build time.
// See BUILD-SPEC.md section 8 (content model) and AD-03 (why five files
// instead of one content.json).
//
// AD-07 (fail closed): a genuinely broken edit-me/ file -- a missing comma,
// a field given the wrong type -- already fails `next build` on its own,
// because these are typed TypeScript files and Next type-checks the build.
// Vercel then keeps the last working deploy live and shows a red X on the
// commit; the site does not break, it just doesn't update. What this module
// adds on top of that is normalization for things TypeScript's type system
// can't catch: trimming stray whitespace, dropping a video whose link isn't
// actually a YouTube link, dropping a stats/software/gear row someone left
// completely empty. Those are soft failures by design, same spirit as the
// filename-caption fallback in scripts/optimize-media.mjs -- a mistake here
// should never be able to take the whole page down.

import { you } from "../../edit-me/1-your-details";
import { about } from "../../edit-me/2-about-you";
import { software, gear } from "../../edit-me/3-software-and-gear";
import { videos as rawVideos, intro as rawVideosIntro } from "../../edit-me/4-videos";
import { words as rawWords } from "../../edit-me/7-words-on-the-site";
import type { AboutYou, SiteWords, StatItem, ToolItem, VideoItem, YourDetails } from "./types";
import { extractYouTubeId } from "./youtube";

function trim(s: unknown): string {
  return typeof s === "string" ? s.trim() : "";
}

// Only accept a real, full URL. Something like "lenarluna.vercel.app" with
// no "https://" in front would otherwise be treated as a path on THIS site
// and go nowhere -- rejecting it here just falls back to the in-page
// scroll-to-top link, same as leaving the field blank. Never breaks the
// build over a typo.
function normalizeSiteUrl(s: unknown): string {
  const trimmed = trim(s);
  return /^https?:\/\//i.test(trimmed) ? trimmed : "";
}

function normalizeYou(): YourDetails {
  const name = trim(you.name);
  return {
    name,
    role: trim(you.role),
    city: trim(you.city),
    since: trim(you.since),
    status: trim(you.status),
    quote: trim(you.quote),
    // Falls back to the site owner's own name so a blank quoteAuthor never
    // renders the quote as attributed to no one.
    quoteAuthor: trim((you as { quoteAuthor?: string }).quoteAuthor) || name,
    coverCaption: trim(you.coverCaption),
    siteUrl: normalizeSiteUrl((you as { siteUrl?: string }).siteUrl),
    contactHeading: trim((you as { contactHeading?: string }).contactHeading) || "Book a Shoot",
    contactIntro: trim((you as { contactIntro?: string }).contactIntro),
    email: trim(you.email),
    facebookUrl: trim(you.facebookUrl),
    instagramHandle: trim(you.instagramHandle).replace(/^@/, ""),
    phone: trim(you.phone),
    phonePublic: you.phonePublic === true,
  };
}

function normalizeAbout(): AboutYou {
  // Cast through unknown, same reason as extendedBio/contactHeading/etc.
  // below: about.stats has no fixed type, since edit-me/2-about-you.ts
  // isn't annotated -- TypeScript infers its shape straight from whatever
  // is literally written there. An emptied-out `stats: []` in that file
  // infers as `never[]`, which breaks the .map() below with no array to
  // even be empty about -- this is what happens when a real edit-me file
  // isn't around to infer from. Casting here means an empty, a populated,
  // or a malformed stats array in that file are all handled the same way,
  // regardless of what shape TypeScript would otherwise have guessed.
  const rawStats = (about as { stats?: unknown }).stats;
  const stats: { label?: unknown; value?: unknown }[] = Array.isArray(rawStats) ? rawStats : [];
  return {
    heading: trim(about.heading) || "Behind the Camera",
    story: trim(about.story),
    extendedBio: trim((about as { extendedBio?: string }).extendedBio),
    stats: stats
      .map((s): StatItem => ({ label: trim(s?.label), value: trim(s?.value) }))
      .filter((s) => s.label !== "" && s.value !== ""),
  };
}

// Every word on the site that isn't Lenar's own content -- see
// edit-me/7-words-on-the-site.ts. Each field falls back to the wording the
// site shipped with, so a blanked-out or deleted line degrades to the
// original word instead of rendering an empty heading. Same fail-soft rule
// as the rest of this file: a mistake in an edit-me file should never be
// able to leave a hole in the page.
function pick(value: unknown, fallback: string): string {
  return trim(value) || fallback;
}

function normalizeWords(): SiteWords {
  const w = (rawWords ?? {}) as Record<string, Record<string, unknown>>;
  const menu = w.menu ?? {};
  const highlights = w.highlights ?? {};
  const about = w.about ?? {};
  const serviceIndex = w.serviceIndex ?? {};
  const gallery = w.gallery ?? {};
  const videos = w.videos ?? {};
  const contact = w.contact ?? {};
  const small = w.smallLabels ?? {};

  // Category display names: drop any blank value so the folder-derived
  // label shows through instead of an empty tab.
  const rawNames = (w.categoryNames ?? {}) as Record<string, unknown>;
  const categoryNames: Record<string, string> = {};
  for (const [slug, label] of Object.entries(rawNames)) {
    const clean = trim(label);
    if (clean) categoryNames[slug] = clean;
  }

  return {
    menu: {
      highlights: pick(menu.highlights, "Selects"),
      about: pick(menu.about, "About"),
      gallery: pick(menu.gallery, "Gallery"),
      videos: pick(menu.videos, "Videos"),
      contact: pick(menu.contact, "Contact"),
    },
    highlights: {
      smallLabel: pick(highlights.smallLabel, "SELECTS"),
      heading: pick(highlights.heading, "Highlights"),
    },
    about: {
      smallLabel: pick(about.smallLabel, "ABOUT"),
      moreAboutLabel: pick(about.moreAboutLabel, "MORE ABOUT HIM"),
    },
    serviceIndex: { title: pick(serviceIndex.title, "INDEX OF SERVICES") },
    gallery: {
      smallLabel: pick(gallery.smallLabel, "GALLERY"),
      heading: pick(gallery.heading, "Explore Highlights by Category"),
      allTabLabel: pick(gallery.allTabLabel, "All"),
    },
    categoryNames,
    videos: {
      smallLabel: pick(videos.smallLabel, "VIDEOS"),
      heading: pick(videos.heading, "Work That Moves"),
    },
    contact: {
      smallLabel: pick(contact.smallLabel, "CONTACT"),
      facebookButton: pick(contact.facebookButton, "MESSAGE ON FACEBOOK"),
      emailLabel: pick(contact.emailLabel, "EMAIL"),
      instagramLabel: pick(contact.instagramLabel, "INSTAGRAM"),
      phoneLabel: pick(contact.phoneLabel, "PHONE"),
    },
    smallLabels: {
      based: pick(small.based, "BASED"),
      shootingSince: pick(small.shootingSince, "SHOOTING SINCE"),
      framesOnFile: pick(small.framesOnFile, "FRAMES ON FILE"),
      status: pick(small.status, "STATUS"),
      softwareUsed: pick(small.softwareUsed, "SOFTWARE USED"),
      gearUsed: pick(small.gearUsed, "GEAR USED"),
      profileTag: pick(small.profileTag, "THE MAN HIMSELF"),
      backToTop: pick(small.backToTop, "BACK TO TOP"),
    },
  };
}

function normalizeTools(list: ToolItem[]): ToolItem[] {
  if (!Array.isArray(list)) return [];
  return list
    .map((t): ToolItem => ({ name: trim(t?.name), use: trim(t?.use) }))
    .filter((t) => t.name !== "");
}

const videoWarnings: string[] = [];

function normalizeVideos(): VideoItem[] {
  if (!Array.isArray(rawVideos)) return [];
  const out: VideoItem[] = [];
  rawVideos.forEach((v, i) => {
    const link = trim(v?.link);
    const title = trim(v?.title);
    const description = trim((v as { description?: string })?.description);
    if (!link) return; // an empty placeholder block, nothing to warn about
    const id = extractYouTubeId(link);
    if (!id) {
      const isFacebook = /facebook\.com|fb\.watch/i.test(link);
      videoWarnings.push(
        `edit-me/4-videos.ts, entry ${i + 1}: "${link}" doesn't work here -- ` +
          (isFacebook
            ? `only YouTube links are supported right now, not Facebook. `
            : `it doesn't look like a YouTube link. `) +
          `This video won't show up on the site until the link is fixed.`
      );
      return;
    }
    out.push({ link, title, description });
  });
  return out;
}

let cached: {
  you: YourDetails;
  about: AboutYou;
  software: ToolItem[];
  gear: ToolItem[];
  videos: VideoItem[];
  videosIntro: string;
  contactIntro: string;
  words: SiteWords;
} | null = null;

export function getSiteContent() {
  if (!cached) {
    cached = {
      you: normalizeYou(),
      about: normalizeAbout(),
      software: normalizeTools(software),
      gear: normalizeTools(gear),
      videos: normalizeVideos(),
      videosIntro: trim(rawVideosIntro),
      contactIntro: normalizeYou().contactIntro,
      words: normalizeWords(),
    };
    // A dropped video (a link that doesn't look like YouTube) used to fail
    // completely silently -- getContentWarnings() existed but nothing ever
    // called it, so a video could vanish from the site with zero trace
    // anywhere, not even in the build log. This is the one place content is
    // loaded exactly once per build, so it's the right spot to actually
    // surface that: console.warn lands in `npm run build`'s output locally,
    // and in Vercel's build log in production -- the same place Clint
    // already checks for a broken build (see CLINT-RUNBOOK.md).
    for (const w of videoWarnings) console.warn(`[content] ${w}`);
  }
  return cached;
}

export function getContentWarnings(): string[] {
  getSiteContent(); // ensure normalization (and warning collection) has run
  return videoWarnings;
}
