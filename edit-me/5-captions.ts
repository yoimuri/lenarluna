// ============================================================================
// CAPTIONS -- optional. You can ignore this whole file.
// ============================================================================
// A photo's caption normally comes from its filename: name it
// "03--first-dance.jpg" and it shows "First dance".
//
// Use this file only when you want to:
//   - change a caption WITHOUT re-uploading the photo, or
//   - add a second line underneath it.
//
// THE PATH is everything after "photos/" in the photo's address on GitHub:
//     public/photos/5-gallery/02-debut/03--DSCF7150.jpg
//                   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ this part
//
// TWO SHAPES -- pick either:
//     "5-gallery/02-debut/03--DSCF7150.jpg": "Her first dance",
//
//     "5-gallery/02-debut/03--DSCF7150.jpg": {
//       title: "Her first dance",
//       description: "Right before the lights went down.",
//     },
//
// Keep the comma at the end. A path pointing at a deleted photo is ignored,
// so nothing here can break your site.
//
// Photos straight off your camera (DSCF6322, IMG_20240723) get NO caption
// automatically -- you don't need to list them here to keep them blank.
// ============================================================================

import type { CaptionEntry } from "../src/lib/types";

export const captions: Record<string, CaptionEntry> = {
  "3-best-work/00--LNR00344.jpg": "4k Zoom Test",

  "3-best-work/01--DSCF3175.jpg": "Stepping into the event scene for the first time.",

  // Example of the two-line shape -- delete or change it whenever:
  // "3-best-work/02--studio-portrait.jpg": {
  //   title: "Ball pit, 4pm",
  //   description: "Twenty minutes of chaos, one frame where everyone looked up.",
  // },
};
