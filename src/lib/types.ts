// Shared types for the edit-me/ files and the generated media manifest.
// See BUILD-SPEC.md section 4 (page structure), AD-01/03 (architecture) and
// section 9 (media pipeline).

// --- edit-me/ shapes -------------------------------------------------------

export type YourDetails = {
  name: string;
  role: string;
  contactIntro: string;
  city: string;
  since: string;
  status: string;
  quote: string;
  coverCaption: string;
  email: string;
  facebookUrl: string;
  instagramHandle: string;
  phone: string;
  phonePublic: boolean;
};

export type StatItem = { label: string; value: string };

export type AboutYou = {
  heading: string;
  story: string;
  /** The longer bio that sits under the Software/Gear lists. */
  extendedBio: string;
  stats: StatItem[];
};

export type ToolItem = { name: string; use: string };

export type VideoItem = { link: string; title: string; description: string };

/**
 * A caption can be written two ways in edit-me/5-captions.ts:
 *   "path": "Just a title"
 *   "path": { title: "A title", description: "A longer line under it" }
 */
export type CaptionEntry = string | { title?: string; description?: string };

// --- generated media manifest (written by scripts/optimize-media.mjs) ------

export type MediaSrc = { width: number; path: string };

export type MediaImage = {
  /** Path relative to public/photos, e.g. "5-gallery/05-street/02--rain.jpg" */
  path: string;
  file: string;
  order: number;
  /** The caption's title line. Resolved per AD-09. */
  caption: string;
  /** The optional second line under the title. Only ever set from captions.ts. */
  description: string;
  alt: string;
  width: number;
  height: number;
  blur: string;
  srcset: MediaSrc[];
};

export type Category = {
  slug: string; // "01-kiddie-parties"
  label: string; // "Kiddie Parties"
  images: MediaImage[];
};

export type MediaManifest = {
  generatedAt: string;
  coverPhoto: MediaImage | null;
  profilePicture: MediaImage | null;
  bestWork: MediaImage[];
  aboutPhoto: MediaImage | null;
  categories: Category[];
  totalPhotos: number;
  warnings: string[];
};
