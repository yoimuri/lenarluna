// ============================================================================
// SOFTWARE AND GEAR
// ============================================================================
// Two separate lists: the software you edit with, and the gear you shoot
// with. They show as two separate boxes in the About section.
//
// To add one: copy a whole { ... } line, paste it above or below, then
// change the words inside the quote marks. Keep the comma at the end.
// To remove one: delete its whole { ... } line.
// If you empty out a whole list, that box just disappears -- no empty
// heading left behind.
// ============================================================================

export const software = [
  { name: "Adobe Premiere Pro", use: "Editing" },
  { name: "Adobe Lightroom", use: "Colour" },
  { name: "DaVinci Resolve", use: "Grading" },
  { name: "Canva", use: "Layout" },
];

export const gear: { name: string; use: string }[] = [
  { name: "DSLR 101231231", use: "Camera" },
  { name: "This is LEEEEEEEEEENS", use: "Lens" },
  { name: "Lighting mcqueen", use: "Lighting" },
  { name: "Xiaomi Poco x6 pro sakalam", use: "Other" },
  // Nothing real here yet -- add your camera body, lenses, and lighting as you
  // like. Examples:
  // { name: "Fujifilm X-S10", use: "Camera body" },
  // { name: "18-55mm kit lens", use: "Lens" },
  // { name: "Godox lighting", use: "Lighting" },
];
