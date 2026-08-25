// ============================================================================
// CAPTIONS  (optional -- you can ignore this whole file if you want)
// ============================================================================
//
// WHAT A CAPTION IS
// -----------------
// The words under a photo. Every photo can have one. None of them have to.
//
// You already get a caption for free from the FILENAME. A photo named:
//       03--first-dance.jpg
// shows the caption "First dance". That's usually enough.
//
// USE THIS FILE WHEN YOU WANT TO:
//   - change the words WITHOUT re-uploading the photo, or
//   - add a second line (a description) under the caption.
//
//
// ============================================================================
// HOW TO WRITE ONE -- follow along
// ============================================================================
//
// STEP 1. Find your photo on GitHub and look at the address bar / breadcrumb.
//         Say your photo is here:
//
//             public / photos / 5-gallery / 01-kiddie-parties / 02--sample-two.jpg
//
// STEP 2. Take everything AFTER "photos/". That's the photo's path:
//
//             5-gallery/01-kiddie-parties/02--sample-two.jpg
//
// STEP 3. Write a line inside the { } below, in one of these two shapes.
//
//         SHAPE A -- just change the caption:
//
//             "5-gallery/01-kiddie-parties/02--sample-two.jpg": "Cake smash",
//
//         SHAPE B -- a caption AND a description under it:
//
//             "5-gallery/01-kiddie-parties/02--sample-two.jpg": {
//               title: "Cake smash",
//               description: "She went in with both hands. Nobody stopped her.",
//             },
//
// STEP 4. Keep the comma at the end. Save. Done.
//
//
// ============================================================================
// THINGS THAT ARE FINE
// ============================================================================
//   - Leaving this file completely empty. Filenames handle it.
//   - Listing only some photos. The rest just use their filenames.
//   - A path that points at a photo you later deleted -- it's ignored, and
//     it will NOT break your site.
//   - Photos in ANY folder: Highlights (3-best-work), the galleries, or the
//     About photo. Same rule, same path style.
//
// ============================================================================

import type { CaptionEntry } from "../src/lib/types";

export const captions: Record<string, CaptionEntry> = {
  // ── A REAL, WORKING EXAMPLE ────────────────────────────────────────────
  // These two point at photos that exist in your site RIGHT NOW, so you can
  // see the effect straight away. Delete both lines whenever you like.

  "3-best-work/01--debut-celebration.jpg": "The first dance",

  "5-gallery/01-kiddie-parties/01--sample-one.jpg": {
    title: "Ball pit, 4pm",
    description: "Twenty minutes of chaos, one frame where everyone looked up.",
  },

  // ── YOUR CAPTIONS GO BELOW THIS LINE ───────────────────────────────────
};
