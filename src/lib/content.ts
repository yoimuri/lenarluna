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
import type { AboutYou, StatItem, ToolItem, VideoItem, YourDetails } from "./types";
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
