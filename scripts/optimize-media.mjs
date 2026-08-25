// Runs before every dev server start and every build (see package.json
// "predev" / "prebuild"). Walks public/photos/**, resizes and re-encodes
// every photo, strips ALL metadata (including GPS -- AD-08, non-negotiable),
// and writes src/lib/media-manifest.json for the app to read.
//
// This script is plain JS run directly by `node`, so it deliberately does NOT
// import edit-me/5-captions.ts (a TypeScript file) -- that would require a
// TS-aware runtime just for a build script. Instead this script only resolves
// the FILENAME half of caption resolution (AD-09 step 2); the captions.ts
// override (step 1) is applied at render time in src/lib/media.ts, which runs
// through Next's own TypeScript pipeline and can import edit-me/ directly.
//
// Both public/_gen/ and the manifest are gitignored. They are regenerated on
// every build, never committed. See BUILD-SPEC.md section 9.

import { readdir, mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const PHOTOS_DIR = path.join(ROOT, "public", "photos");
const GEN_DIR = path.join(ROOT, "public", "_gen");
const MANIFEST_PATH = path.join(ROOT, "src", "lib", "media-manifest.json");

// Four widths, not three. The top one exists specifically so the zoom viewer
// has real pixels to show: at 200% on a 1440px screen the photo is being
// drawn at roughly 2400px wide, so capping the largest export at 2000 made
// zooming pointless -- it just magnified a soft image. `withoutEnlargement`
// means a small original is never upscaled into a fake big file.
const WIDTHS = [640, 1280, 2000, 3000];

// Quality per width. The big ones are what someone actually inspects
// close-up, so they get the headroom; the small ones stay light because
// they're only ever shown as grid thumbnails.
const QUALITY_BY_WIDTH = { 640: 80, 1280: 86, 2000: 90, 3000: 90 };

const FILENAME_RE = /^(\d+)--(.+)\.(jpe?g|png|webp)$/i;
const IMAGE_EXT_RE = /\.(jpe?g|png|webp)$/i;

const warnings = [];

function toBlurDataUrl(buffer) {
  return `data:image/webp;base64,${buffer.toString("base64")}`;
}

function labelFromSlug(slug) {
  const words = slug.replace(/^\d+-/, "").split("-");
  return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

async function listImageFiles(dir) {
  if (!existsSync(dir)) return [];
  const entries = await readdir(dir, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && IMAGE_EXT_RE.test(e.name))
    .map((e) => e.name)
    .sort(); // "NN--..." filenames sort numerically-ish; unmatched names fall in after
}

// Caption resolution, AD-09 step 2 only (filename words). The captions.ts
// override (step 1) is layered on top of this at render time in
// src/lib/media.ts -- see the note at the top of this file.
function resolveFilenameCaption(filename, allowCaption) {
  if (!allowCaption) return { caption: "" };

  const match = filename.match(FILENAME_RE);
  if (match) {
    const words = match[2].replace(/-/g, " ");
    const caption = words.charAt(0).toUpperCase() + words.slice(1);
    return { caption };
  }

  return { caption: "", unmatchedFilename: true };
}

/**
 * Process one image file: emit a WebP srcset at three widths (metadata
 * stripped), a blur placeholder, and a manifest entry.
 *
 * @param folderRelPath  folder path relative to public/photos, e.g. "5-gallery/05-street"
 * @param filename       the file's own name
 * @param opts.order     explicit order override (defaults to NN-- prefix, else 9999)
 * @param opts.allowCaption  whether this photo participates in caption resolution
 * @param opts.altFallback   alt text to use when there is no caption
 */
async function processImage(folderRelPath, filename, opts = {}) {
  const { allowCaption = true, altFallback = "" } = opts;
  const srcPath = path.join(PHOTOS_DIR, folderRelPath, filename);
  const relPath = path.join(folderRelPath, filename);

  const match = filename.match(FILENAME_RE);
  const order = match ? parseInt(match[1], 10) : 9999;

  const { caption, unmatchedFilename } = resolveFilenameCaption(filename, allowCaption);
  if (unmatchedFilename) {
    warnings.push(
      `${relPath} -- doesn't match "NN--words.jpg". It will still appear (sorted ` +
        `last within its folder, since it has no NN-- number). It shows with no ` +
        `caption unless you add one for it in edit-me/5-captions.ts.`
    );
  }

  const destDir = path.join(GEN_DIR, folderRelPath);
  await mkdir(destDir, { recursive: true });

  const baseName = path.parse(filename).name;
  const metadata = await sharp(srcPath).rotate().metadata();

  const srcset = [];
  for (const w of WIDTHS) {
    // Don't emit a size bigger than the original -- withoutEnlargement would
    // just write a duplicate of the previous width under a misleading name,
    // and the viewer would then think it had a 3000px file to zoom into.
    if (metadata.width && w > metadata.width && srcset.length > 0) continue;

    const outName = `${baseName}-${w}.webp`;
    const outPath = path.join(destDir, outName);
    await sharp(srcPath)
      .rotate() // auto-orients then strips the orientation EXIF tag
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: QUALITY_BY_WIDTH[w] ?? 86 })
      // .webp() output carries no EXIF/ICC/GPS by default unless withMetadata() is
      // called -- and it never is, anywhere in this pipeline. That silence is AD-08.
      .toFile(outPath);

    // Record the width the file ACTUALLY is, not the width we asked for.
    const actual = Math.min(w, metadata.width || w);
    srcset.push({ width: actual, path: `/_gen/${folderRelPath.split(path.sep).join("/")}/${outName}` });
  }

  const blurBuf = await sharp(srcPath).rotate().resize({ width: 24 }).webp({ quality: 40 }).toBuffer();

  return {
    path: relPath.split(path.sep).join("/"),
    file: filename,
    order,
    caption,
    // Only ever set by an entry in edit-me/5-captions.ts, layered on at
    // render time in src/lib/media.ts. A filename can't express two lines.
    description: "",
    alt: caption || altFallback,
    width: metadata.width ?? 0,
    height: metadata.height ?? 0,
    blur: toBlurDataUrl(blurBuf),
    srcset,
  };
}

// A folder that should hold exactly one photo (cover, profile picture, about
// photo). Takes the first file alphabetically; warns (doesn't fail) if more
// than one file is present; returns null if the folder is empty.
async function processSingle(folderRelPath, opts) {
  const dir = path.join(PHOTOS_DIR, folderRelPath);
  const files = await listImageFiles(dir);
  if (files.length === 0) return null;
  if (files.length > 1) {
    warnings.push(
      `public/photos/${folderRelPath} should hold exactly one photo, but has ` +
        `${files.length}. Using "${files[0]}" (first alphabetically) and ignoring ` +
        `the rest. Delete the extra files to clear this warning.`
    );
  }
  return processImage(folderRelPath, files[0], opts);
}

async function processMany(folderRelPath, opts) {
  const dir = path.join(PHOTOS_DIR, folderRelPath);
  const files = await listImageFiles(dir);
  const images = [];
  for (const file of files) {
    images.push(await processImage(folderRelPath, file, opts));
  }
  images.sort((a, b) => a.order - b.order || a.file.localeCompare(b.file));
  return images;
}

async function walkGalleryCategories() {
  const dir = path.join(PHOTOS_DIR, "5-gallery");
  if (!existsSync(dir)) return [];
  const entries = await readdir(dir, { withFileTypes: true });
  return entries
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();
}

async function main() {
  // 1-cover-photo: no caption resolution here -- the cover's caption is a
  // dedicated field in edit-me/1-your-details.ts, not the captions.ts map.
  const coverPhoto = await processSingle("1-cover-photo", {
    allowCaption: false,
    altFallback: "Lenar Joshua M. Luna",
  });

  // 2-profile-picture: never captioned, by design (it's a small circular
  // picture, not a photo you'd caption).
  const profilePicture = await processSingle("2-profile-picture", {
    allowCaption: false,
    altFallback: "Lenar Joshua M. Luna",
  });

  const bestWork = await processMany("3-best-work", {
    allowCaption: true,
    altFallback: "Selected work by Lenar Joshua M. Luna",
  });

  const aboutPhoto = await processSingle("4-about-photo", {
    allowCaption: true,
    altFallback: "Lenar Joshua M. Luna",
  });

  const categorySlugs = await walkGalleryCategories();
  const categories = [];
  let totalPhotos = 0;
  for (const slug of categorySlugs) {
    const label = labelFromSlug(slug);
    const images = await processMany(`5-gallery/${slug}`, {
      allowCaption: true,
      altFallback: label,
    });
    // A category folder with zero photos does not become a category at all --
    // no empty tab, no dead grid (BUILD-SPEC.md section 4, "Categories").
    if (images.length === 0) continue;
    categories.push({ slug, label, images });
    totalPhotos += images.length;
  }

  await mkdir(path.dirname(MANIFEST_PATH), { recursive: true });
  await writeFile(
    MANIFEST_PATH,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        coverPhoto,
        profilePicture,
        bestWork,
        aboutPhoto,
        categories,
        totalPhotos,
        warnings,
      },
      null,
      2
    )
  );

  console.log(
    `\nMedia pipeline: ${totalPhotos} archive photo(s) across ${categories.length} ` +
      `categor${categories.length === 1 ? "y" : "ies"}, ${bestWork.length} in Selects.`
  );
  if (!coverPhoto) console.log("⚠  No cover photo found in public/photos/1-cover-photo/");
  if (!profilePicture) console.log("ℹ  No profile picture -- the profile-picture block will not render.");
  if (!aboutPhoto) console.log("⚠  No about photo found in public/photos/4-about-photo/");

  if (warnings.length) {
    console.log(`\n⚠  ${warnings.length} warning(s):`);
    for (const w of warnings) console.log(`   - ${w}`);
    console.log("");
  } else {
    console.log("No warnings.\n");
  }
}

main().catch((err) => {
  console.error("Media pipeline failed:", err);
  process.exit(1);
});
