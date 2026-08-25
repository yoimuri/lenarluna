// ============================================================================
// VIDEOS
// ============================================================================
// Add a YouTube video to the site.
//
// TO ADD A VIDEO:
//   1. Copy a whole block, from the { down to the },
//   2. Paste it under the last one,
//   3. Change the link, the title, and the description.
//   4. Keep every comma exactly where it is.
//
// `description` is optional -- a short line under the title saying what the
// video is. Leave it out, or set it to "", and only the title shows.
//
// Any YouTube link works -- the long one, the short "youtu.be" one, or a
// Shorts link. You do NOT need to upload a thumbnail -- it's pulled from
// YouTube automatically. Nothing plays until someone clicks it, so the
// page stays fast no matter how many videos you add.
//
// TO REMOVE A VIDEO: delete its whole block, from { down to },
// ============================================================================

// A short line that appears beside the "Work That Moves" heading, to say
// what this section is. Change it to whatever you like.
// Leave it as "" and no line appears at all.
export const intro = "My sample videos live here:";

export const videos: { link: string; title: string; description?: string }[] = [
  // ---- SAMPLE VIDEOS -- delete these three once your real ones are in ----
  {
    link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    title: "Sample — Never Gonna Give You Up",
    description: "A placeholder so you can see how a video looks here.",
  },
  {
    link: "https://www.youtube.com/watch?v=JobpOg3Cceg",
    title: "Sample — You Don't Know Me",
    description: "Replace this with one of your own edits.",
  },
  {
    link: "https://www.youtube.com/watch?v=60ItHLz5WEA",
    title: "Sample — Faded",
    description: "",
  },
];
