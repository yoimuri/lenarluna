// ============================================================================
// VIDEOS
// ============================================================================
// Your videos live on Google Drive. The site just plays them -- no upload
// limit, no size limit, and nothing gets muted for music.
//
// TO ADD A VIDEO:
//   1. Upload it to your Google Drive.
//   2. Right-click it -> Share -> under "General access" choose
//      "Anyone with the link". THIS STEP IS REQUIRED. Without it, visitors
//      get a "request access" screen instead of your video.
//   3. Click Copy link.
//   4. Paste it below in a block like the ones there, and change the title.
//   5. Commit changes. Wait about a minute. Refresh.
//
// TO REMOVE A VIDEO: delete its block, from the {  down to the  },
//
// The description line is optional -- delete it and only the title shows.
// YouTube links still work too, if you ever prefer one.
// ============================================================================

// The line beside the "Work That Moves" heading. "" means no line.
export const intro = "A few of my recent edits:";

export const videos: { link: string; title: string; description?: string }[] = [
  // ---- Replace these with your own. Delete any you don't need. ----
  {
    link: "PASTE-YOUR-GOOGLE-DRIVE-LINK-HERE",
    title: "Juliet's 60th Birthday",
    description: "July 24, 2026",
  },
];
