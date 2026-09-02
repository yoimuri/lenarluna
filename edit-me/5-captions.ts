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

  "3-best-work/02--studio-portrait.jpg": {
    title: "Ball pit, 4pm",
    description: "Twenty minutes of chaos, one frame where everyone looked up.",
  },

  // ── YOUR CAPTIONS GO BELOW THIS LINE ───────────────────────────────────

  // Blanks out the caption this photo would otherwise get from its filename
  // ("00--LNR00344.jpg" -> "LNR00344", a raw camera file code, not a real
  // caption). The "00--" stays -- that's what puts it first in Highlights --
  // this line just stops the filename's leftover text from becoming the
  // caption underneath it. Give it a real caption any time by changing "" to
  // words, the same as any other line in this file.
  "3-best-work/00--LNR00344.jpg": "4k Zoom Test",

  // ── AUTO-GENERATED, 2026-09-02 ──────────────────────────────────────────
  // Every one of these is a real photo that came straight off your camera
  // with its camera-given filename (like "DSCF6322"). They needed a "NN--"
  // number in front to show up in the right order, but a camera filename
  // makes a bad caption -- so each line below just blanks that out, the
  // same trick as the one right above this block.
  //
  // The ORDER didn't change from what you had -- 01, 02, 03... within each
  // folder is exactly the order you already numbered them in. Only the dash
  // count changed, on the actual files themselves (check the folder on
  // GitHub if you want to see the new names).
  //
  // Any of these is safe to give a real caption: just replace the "" with
  // words in quotes, same as any other line in this file. Delete a line
  // entirely and that photo goes back to showing no caption -- nothing
  // breaks either way.

  "5-gallery/01-kiddie-parties/01--dscf4958.jpg": "",
  "5-gallery/01-kiddie-parties/02--dscf6322.jpg": "",
  "5-gallery/01-kiddie-parties/03--dscf6356.jpg": "",
  "5-gallery/01-kiddie-parties/04--dscf6430.jpg": "",
  "5-gallery/01-kiddie-parties/05--dscf6805.jpg": "",
  "5-gallery/01-kiddie-parties/06--dscf6326.jpg": "",
  "5-gallery/01-kiddie-parties/07--dscf9491.jpg": "",
  "5-gallery/01-kiddie-parties/08--dscf1312.jpg": "",
  "5-gallery/02-debut/01--lnr00344.jpg": "",
  "5-gallery/02-debut/02--dscf0491.jpg": "",
  "5-gallery/02-debut/03--dscf7150.jpg": "",
  "5-gallery/02-debut/04--dscf5534.jpg": "",
  "5-gallery/02-debut/05--lnr00318.jpg": "",
  "5-gallery/02-debut/06--dscf5881.jpg": "",
  "5-gallery/02-debut/07--lnr00306.jpg": "",
  "5-gallery/02-debut/08--dscf3216.jpg": "",
  "5-gallery/02-debut/09--dscf0259.jpg": "",
  "5-gallery/02-debut/10--dscf7201.jpg": "",
  "5-gallery/02-debut/11--dscf5546.jpg": "",
  "5-gallery/02-debut/12--dscf7213.jpg": "",
  "5-gallery/03-prenup-wedding/01--dscf6297.jpg": "",
  "5-gallery/03-prenup-wedding/02--dscf9643.jpg": "",
  "5-gallery/03-prenup-wedding/03--dscf6380.jpg": "",
  "5-gallery/03-prenup-wedding/04--dscf0204.jpg": "",
  "5-gallery/03-prenup-wedding/05--dscf6408.jpg": "",
  "5-gallery/03-prenup-wedding/06--dscf9398.jpg": "",
  "5-gallery/03-prenup-wedding/07--dscf6339.jpg": "",
  "5-gallery/03-prenup-wedding/08--dscf0185.jpg": "",
  "5-gallery/04-sport-events/01--dscf0552.jpg": "",
  "5-gallery/04-sport-events/02--dscf0804.jpg": "",
  "5-gallery/04-sport-events/03--dscf9352.jpg": "",
  "5-gallery/04-sport-events/04--dscf0410.jpg": "",
  "5-gallery/04-sport-events/05--dscf0432.jpg": "",
  "5-gallery/04-sport-events/06--dscf9798.jpg": "",
  "5-gallery/04-sport-events/07--dscf0815.jpg": "",
  "5-gallery/04-sport-events/08--dscf0187.jpg": "",
  "5-gallery/05-street/01--img-20230313-200429.jpg": "",
  "5-gallery/05-street/02--dscf3490.jpg": "",
  "5-gallery/05-street/03--dscf1960.jpg": "",
  "5-gallery/05-street/04--dscf3580.jpg": "",
  "5-gallery/05-street/05--dscf7696.jpg": "",
  "5-gallery/05-street/06--dscf3569.jpg": "",
  "5-gallery/06-landscape/01--dscf4447.jpg": "",
  "5-gallery/06-landscape/02--dscf0739.jpg": "",
  "5-gallery/06-landscape/03--img-20221001-174101.jpg": "",
  "5-gallery/06-landscape/04--dscf0819-enhanced-nr.jpg": "",
  "5-gallery/06-landscape/05--dscf2471-2.jpg": "",
  "5-gallery/06-landscape/06--dscf2594-2.jpg": "",
  "5-gallery/06-landscape/07--dscf4063.jpg": "",
  "5-gallery/09-portraits/01--dscf4660.jpg": "",
  "5-gallery/09-portraits/02--dscf3020.jpg": "",
  "5-gallery/09-portraits/03--dscf1560.jpg": "",
  "5-gallery/09-portraits/04--dscf7201.jpg": "",
  "5-gallery/09-portraits/05--lnr00289.jpg": "",
  "5-gallery/09-portraits/06--img-20240723-234228.jpg": "",
  "5-gallery/09-portraits/07--dscf2674.jpg": "",
  "5-gallery/09-portraits/08--dscf8847.jpg": "",
};
