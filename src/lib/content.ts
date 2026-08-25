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
  return {
    name: trim(you.name),
    role: trim(you.role),
    city: trim(you.city),
    since: trim(you.since),
    status: trim(you.status),
    quote: trim(you.quote),
    coverCaption: trim(you.coverCaption),
    siteUrl: normalizeSiteUrl((you as { siteUrl?: string }).siteUrl),
    contactIntro: trim((you as { contactIntro?: string }).contactIntro),
    email: trim(you.email),
    facebookUrl: trim(you.facebookUrl),
    instagramHandle: trim(you.instagramHandle).replace(/^@/, ""),
    phone: trim(you.phone),
    phonePublic: you.phonePublic === true,
  };
}

function normalizeAbout(): AboutYou {
  const stats = Array.isArray(about.stats) ? about.stats : [];
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
      videoWarnings.push(
        `edit-me/4-videos.ts, entry ${i + 1}: "${link}" doesn't look like a YouTube ` +
          `link, so this video won't show up on the site. Check the link and try again.`
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
  }
  return cached;
}

export function getContentWarnings(): string[] {
  getSiteContent(); // ensure normalization (and warning collection) has run
  return videoWarnings;
}
