// Turns whatever video link Lenar pastes into something the site can embed.
//
// Two hosts are understood:
//
//   Google Drive -- the main one now. The file must be shared "Anyone with
//     the link", or the embed shows a sign-in wall to visitors. Drive caps
//     playback at 1080p, and a sudden burst of viewers can get an embed
//     temporarily throttled; both are Drive's rules, not ours.
//   YouTube -- still accepted, so an older link keeps working and so there's
//     somewhere to move a video if Drive ever throttles it.
//
// Nothing here fetches anything. Link in, IDs and URLs out, so a bad link is
// caught at build time rather than as a dead player on the page.

export type VideoSource = { kind: "drive" | "youtube"; id: string };

// YouTube IDs are 11 chars; Drive IDs are longer and have no fixed length.
const YT_ID = /^[a-zA-Z0-9_-]{11}$/;
const DRIVE_ID = /^[a-zA-Z0-9_-]{10,}$/;

function youtubeId(url: URL): string | null {
  const host = url.hostname.replace(/^www\./, "");

  if (host === "youtu.be") {
    const id = url.pathname.slice(1).split("/")[0];
    return YT_ID.test(id) ? id : null;
  }

  if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
    if (url.pathname === "/watch") {
      const id = url.searchParams.get("v") ?? "";
      return YT_ID.test(id) ? id : null;
    }
    const m = url.pathname.match(/^\/(?:shorts|embed|live)\/([a-zA-Z0-9_-]{11})/);
    if (m) return m[1];
  }

  return null;
}

function driveId(url: URL): string | null {
  const host = url.hostname.replace(/^www\./, "");
  if (host !== "drive.google.com" && host !== "docs.google.com") return null;

  // The share link people actually copy: /file/d/<id>/view?usp=sharing
  const inPath = url.pathname.match(/\/(?:file|d)\/(?:d\/)?([a-zA-Z0-9_-]{10,})/);
  if (inPath) return inPath[1];

  // Older shapes: /open?id=<id>, /uc?id=<id>
  const q = url.searchParams.get("id");
  if (q && DRIVE_ID.test(q)) return q;

  return null;
}

/** null means "this isn't a link we can embed" -- the caller warns and skips it. */
export function parseVideoLink(input: unknown): VideoSource | null {
  const trimmed = typeof input === "string" ? input.trim() : "";
  if (!trimmed) return null;

  // A bare YouTube ID pasted on its own still works, as it always did.
  if (YT_ID.test(trimmed)) return { kind: "youtube", id: trimmed };

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }

  const drive = driveId(url);
  if (drive) return { kind: "drive", id: drive };

  const yt = youtubeId(url);
  if (yt) return { kind: "youtube", id: yt };

  return null;
}

export function videoEmbedUrl({ kind, id }: VideoSource): string {
  return kind === "drive"
    ? `https://drive.google.com/file/d/${id}/preview`
    : `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
}

/**
 * The still image shown before anyone clicks play.
 *
 * YouTube publishes a reliable one. Drive's thumbnail endpoint works for a
 * publicly shared file but isn't a documented guarantee, so the player treats
 * a failure here as normal and falls back to a drawn placeholder rather than
 * showing a broken image.
 */
export function videoThumbnail({ kind, id }: VideoSource): string {
  return kind === "drive"
    ? `https://drive.google.com/thumbnail?id=${id}&sz=w1280`
    : `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
}

/** Only YouTube has a smaller guaranteed fallback still. */
export function videoThumbnailFallback({ kind, id }: VideoSource): string | null {
  return kind === "youtube" ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
}
