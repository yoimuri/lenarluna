// Accepts whatever link the YouTube app hands Lenar -- a watch URL, a youtu.be
// short link, a Shorts link, or a bare 11-character ID -- and returns just the ID.
// See BUILD-SPEC.md section 7.
export function extractYouTubeId(input: string): string | null {
  const trimmed = input.trim();

  // Already a bare ID (YouTube IDs are 11 chars: letters, digits, - and _)
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;

  try {
    const url = new URL(trimmed);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = url.pathname.slice(1).split("/")[0];
      return id.length === 11 ? id : null;
    }

    if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
      if (url.pathname === "/watch") {
        const id = url.searchParams.get("v");
        return id && id.length === 11 ? id : null;
      }
      const shortsMatch = url.pathname.match(/^\/shorts\/([a-zA-Z0-9_-]{11})/);
      if (shortsMatch) return shortsMatch[1];
      const embedMatch = url.pathname.match(/^\/embed\/([a-zA-Z0-9_-]{11})/);
      if (embedMatch) return embedMatch[1];
    }
  } catch {
    return null;
  }

  return null;
}

export function youtubeThumbnail(id: string): string {
  return `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
}

export function youtubeEmbedUrl(id: string): string {
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
}
