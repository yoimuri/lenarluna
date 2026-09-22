// Runs after `next build`, on the deployed output only.
//
// WHY THIS EXISTS
// ---------------
// Next copies everything in public/ into the built site, and the original
// camera files live in public/photos/. Those originals are never SERVED:
// scripts/optimize-media.mjs converts each one into WebP copies under
// public/_gen/, and every <img> on the site points at /_gen/. A built page
// contains zero references to /photos/.
//
// So without this step every deployment shipped ~217 MB of photos that no
// visitor ever downloads -- about 64% of the whole site -- and Vercel counts
// that against Deployment Storage on EVERY push. With a client editing
// through GitHub, that is one deployment per upload, and the free 10 GB went
// in about a month.
//
// The originals are NOT deleted from the repo. They stay in git, they stay in
// public/photos/, the pipeline still reads them on the next build. They just
// stop being uploaded to the CDN, where nothing ever asked for them.
import { rm, stat, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const OUT_DIR = path.join(process.cwd(), "out");
const PRUNE = ["photos"]; // folders inside out/ that are built-from, never served

async function dirSize(dir) {
  let total = 0;
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) total += await dirSize(p);
    else total += (await stat(p)).size;
  }
  return total;
}

const mb = (bytes) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;

if (!existsSync(OUT_DIR)) {
  console.log("Prune: no out/ directory, nothing to do.");
} else {
  let freed = 0;
  for (const name of PRUNE) {
    const target = path.join(OUT_DIR, name);
    if (!existsSync(target)) continue;
    const size = await dirSize(target);
    await rm(target, { recursive: true, force: true });
    freed += size;
    console.log(`Prune: removed out/${name} (${mb(size)}) -- source files are untouched in public/${name}`);
  }
  const remaining = await dirSize(OUT_DIR);
  console.log(`Prune: deployment is now ${mb(remaining)} (saved ${mb(freed)} per deploy).`);
}
