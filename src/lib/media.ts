// Reads the manifest scripts/optimize-media.mjs generates before every
// build, and layers the captions.ts override on top of each photo's
// filename-derived caption (AD-09 step 1). See BUILD-SPEC.md AD-01 and
// section 9.

import type { Category, MediaImage, MediaManifest } from "./types";
import { captions } from "../../edit-me/5-captions";
import { highlights } from "../../edit-me/6-highlights";

let manifest: MediaManifest | null = null;

const EMPTY_MANIFEST: MediaManifest = {
  generatedAt: "",
  coverPhoto: null,
  profilePicture: null,
  bestWork: [],
  aboutPhoto: null,
  categories: [],
  totalPhotos: 0,
  warnings: [],
};

function loadManifest(): MediaManifest {
  if (manifest) return manifest;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    manifest = require("./media-manifest.json") as MediaManifest;
  } catch {
    // Manifest not generated yet (e.g. running lint before the first `npm run dev`).
    manifest = EMPTY_MANIFEST;
  }
  return manifest;
}

/**
 * The biggest file we generated for this photo. Use this anywhere the photo
 * can be inspected close-up -- above all the zoom viewer, where handing it a
 * 1280px file makes zooming to 200% pointless.
 */
export function largestSrc(img: MediaImage): string {
  return img.srcset.reduce((a, b) => (b.width > a.width ? b : a), img.srcset[0]).path;
}

/** A grid-thumbnail-sized file. */
export function thumbSrc(img: MediaImage): string {
  return img.srcset.find((s) => s.width >= 640)?.path ?? largestSrc(img);
}

/** A mid-sized file, for hero/portrait slots that fill a column. */
export function displaySrc(img: MediaImage): string {
  return img.srcset.find((s) => s.width >= 1280)?.path ?? largestSrc(img);
}

// Applies the edit-me/5-captions.ts override on top of a photo's
// filename-derived caption. Cover and profile photos never go through this
// (see scripts/optimize-media.mjs) so they always arrive with caption: "".
function withCaptionOverride(img: MediaImage): MediaImage {
  const entry = captions[img.path];
  if (entry === undefined) return img;

  if (typeof entry === "string") {
    const caption = entry.trim();
    return { ...img, caption, alt: caption || img.alt };
  }

  const caption = (entry.title ?? "").trim();
  const description = (entry.description ?? "").trim();
  return {
    ...img,
    // An entry that only sets a description keeps the filename title.
    caption: caption || img.caption,
    description,
    alt: caption || img.alt,
  };
}

export function labelFromSlug(slug: string): string {
  const words = slug.replace(/^\d+-/, "").split("-");
  return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

export function getCoverPhoto(): MediaImage | null {
  return loadManifest().coverPhoto;
}

export function getProfilePicture(): MediaImage | null {
  return loadManifest().profilePicture;
}

/**
 * The Highlights set. Two sources, in priority order (see
 * edit-me/6-highlights.ts, which explains both to Lenar):
 *
 *  1. An explicit list of paths in `highlights` -- lets him promote a photo
 *     he has ALREADY uploaded to a gallery folder without uploading it twice.
 *     List order is display order.
 *  2. Otherwise, whatever sits in public/photos/3-best-work.
 *
 * A listed path that matches no real photo is skipped, not fatal -- he will
 * delete photos and forget the line, and that must never break a deploy.
 */
export function getBestWork(): MediaImage[] {
  const m = loadManifest();
  const picks = Array.isArray(highlights) ? highlights.map((p) => p.trim()).filter(Boolean) : [];

  if (picks.length > 0) {
    const byPath = new Map<string, MediaImage>();
    for (const cat of m.categories) for (const img of cat.images) byPath.set(img.path, img);
    for (const img of m.bestWork) byPath.set(img.path, img);
    if (m.aboutPhoto) byPath.set(m.aboutPhoto.path, m.aboutPhoto);

    const resolved: MediaImage[] = [];
    for (const p of picks) {
      const hit = byPath.get(p);
      if (hit) resolved.push(hit);
    }
    if (resolved.length > 0) return resolved.map(withCaptionOverride);
    // Every path was wrong -- fall through to the folder rather than
    // rendering an empty Highlights section.
  }

  return m.bestWork.map(withCaptionOverride);
}

/** Paths listed in 6-highlights.ts that match no photo on disk. */
export function getHighlightWarnings(): string[] {
  const m = loadManifest();
  const picks = Array.isArray(highlights) ? highlights.map((p) => p.trim()).filter(Boolean) : [];
  if (picks.length === 0) return [];
  const known = new Set<string>();
  for (const cat of m.categories) for (const img of cat.images) known.add(img.path);
  for (const img of m.bestWork) known.add(img.path);
  if (m.aboutPhoto) known.add(m.aboutPhoto.path);
  return picks
    .filter((p) => !known.has(p))
    .map((p) => `edit-me/6-highlights.ts lists "${p}", but no photo with that path exists. Skipped.`);
}

export function getAboutPhoto(): MediaImage | null {
  const img = loadManifest().aboutPhoto;
  return img ? withCaptionOverride(img) : null;
}

export function getCategories(): Category[] {
  return loadManifest().categories.map((cat) => ({
    ...cat,
    images: cat.images.map(withCaptionOverride),
  }));
}

export function getTotalPhotos(): number {
  return loadManifest().totalPhotos;
}

export function getManifestWarnings(): string[] {
  return loadManifest().warnings;
}
