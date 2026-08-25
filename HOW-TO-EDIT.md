# How to edit this site

This file is your instruction manual. Everything you need to add or change is
below. You never need to install anything or use a code editor — it all
happens on this website in your browser, through GitHub.

New here? The **[main README](README.md)** is the front page of this repo.
This file is just the how-to.

Watch the video first: **[link — to be added]**

---

## The two things you'll ever touch

Everything on the site comes from one of two places:

1. **`public/photos`** — your photos, sorted into folders by where they show up
   on the page.
2. **`edit-me`** — five small text files with your name, your words, your video
   links, and your photo captions.

You never need to open anything else.

---

## Add or change a photo

1. Click into the `public` folder, then `photos`, then the folder for the part
   of the site you want to change:

   | This folder... | ...controls this |
   |---|---|
   | `1-cover-photo` | the big photo behind your name at the very top |
   | `2-profile-picture` | the round picture over that photo, like a Facebook profile picture |
   | `3-best-work` | your top picks — the showcase right under the top |
   | `4-about-photo` | the tall photo of you in the About section |
   | `5-gallery/...` | your full galleries — one folder per category |

2. Click the **Add file** button, then **Upload files**.
3. Drag your photo in, or click to choose it from your computer.
4. Scroll down, type anything in the little message box (it doesn't matter what),
   and click **Commit changes**.
5. Wait about a minute. Refresh your website. The photo is there.

### `1-cover-photo`, `2-profile-picture`, `4-about-photo` only ever hold ONE photo

These three folders are single-photo spots. Whatever one file is sitting in the
folder is what shows on the site — the filename doesn't matter at all. So to
change your cover photo:

1. Open `1-cover-photo`, click the old photo, delete it.
2. Upload the new one.

That's the whole job. Nothing else needs to change.

### `3-best-work` and `5-gallery/...` can hold as many photos as you like

Name each file like this:

```
01--birthday-cake-smash.jpg
02--first-dance.jpg
```

- The number at the front decides the order photos appear in.
- The words after the two dashes become the caption, and dashes turn into
  spaces. So `02--first-dance.jpg` shows up captioned "First dance".
- If you skip the naming and upload straight off your phone, the photo still
  shows up fine — it just has no caption and goes to the back of the line.
  Nothing breaks.

**Does the name really change the order?** Yes — but ONLY in these two kinds of
folder (`3-best-work` and the gallery folders), where there are several photos
that need an order. Photos sort by that leading number, low to high. Anything
without a number goes last, in alphabetical order.

You do **not** need to number anything in `1-cover-photo`,
`2-profile-picture`, or `4-about-photo`. Those hold one photo each, so there's
no order to decide — call the file whatever you like.

**The numbers don't have to be perfect.** They just have to sort the way you
want. `01, 02, 03` and `10, 20, 30` both work. Leaving gaps (`01, 05, 09`) is
fine too — and it's actually the easier way to work, because you can slip a new
photo in between two others later without renaming everything.

**A gallery folder with no photos in it doesn't show up on the site at all.** If
you haven't uploaded anything to a category yet, that tab simply isn't there.
Add one photo and the tab appears.

**Want a brand-new gallery category?** Make a new folder inside `5-gallery`,
name it like the others (a number, a dash, then the category name — for example
`12-maternity`), and upload photos into it. The tab appears on its own.

**Photo size:** around 1 to 2 MB each is ideal. If your photos come off the
camera at 8 MB, that's bigger than the website needs — the site shrinks them
automatically either way, but smaller originals upload faster.

### Deleting or reordering a photo

- **Delete:** open the photo, click the trash can icon, commit changes.
- **Reorder:** rename it — change the number at the front. Renaming is the small
  pencil icon next to the file.

### Captions: a title, and an optional description under it

The filename gives a photo its **title**. If you want a longer line
underneath it too, open `edit-me/5-captions.ts` — it explains both shapes
with examples:

```
"5-gallery/05-street/02--rain.jpg": "Caught this one running",
```

or, with a description:

```
"5-gallery/05-street/02--rain.jpg": {
  title: "Caught this one running",
  description: "Session Road, five minutes before the rain got serious.",
},
```

That file is also how you change a caption **without re-uploading the photo**.
Every photo can have a caption this way. None of them have to.

---

## Add a video

Videos don't go in this website at all — they go on YouTube, and the site links
to them. That means no size limit and no length limit.

1. Upload your video to YouTube. Any length, any file size. If you don't want
   it findable on YouTube itself, choose **Unlisted** when uploading — it still
   works perfectly on your site.
2. Copy the video's link.
3. Open `edit-me/4-videos.ts` and click the pencil icon to edit it.
4. Follow the instructions written at the top of that file — copy one block,
   paste it, change the link, the title, and the description.
5. Commit changes. Wait about a minute. Refresh.

Each video takes a **title** and an optional short **description** under it.
There's also an `intro` line at the top of that file — the sentence beside
the "Work That Moves" heading. Change it to whatever you want that section
to say.

The still image is pulled from YouTube automatically, so you never upload a
thumbnail. Once a video is playing there's an **X** in its corner to stop it
and put the still picture back.

**No videos yet?** That's fine — the whole Videos section just doesn't appear
on the site until you add your first one.

---

## Change your words

Open the `edit-me` folder. There are five files, numbered in the order they
appear on the site:

| File | What it controls |
|---|---|
| `1-your-details.ts` | your name, city, status, contact links, the quote beside your picture, the paragraph in Contact, and the address your name links to at the top of the site |
| `2-about-you.ts` | your short story, your longer bio, and the four boxes at the bottom of About |
| `3-software-and-gear.ts` | the software and camera gear lists |
| `4-videos.ts` | your YouTube videos, and the line that introduces that section |
| `5-captions.ts` | optional captions for individual photos |
| `6-highlights.ts` | which photos appear in Highlights (optional — see below) |

**The four boxes in About are fully yours.** Both halves can be changed: the
big text AND the small grey wording under it. They are not fixed categories —
if "Events covered" doesn't suit you, make it "Weddings shot" or anything
else. You can have fewer than four, or more.

Click into whichever one you need, click the pencil icon to edit, and follow
the instructions written at the top of the file — every file explains itself in
plain language, with an example to copy.

**Leaving something blank is always safe.** An empty name, an empty quote, an
empty list — the site just doesn't show that piece. Nothing looks broken, and
nothing needs to be deleted to hide it. Fill things in whenever you're ready.

---

## Choosing your Highlights

Highlights is the big showcase near the top. Two ways to fill it, and you
only need one:

1. **The easy way** — put photos in `public/photos/3-best-work`. Done.
2. **Pick from photos you already uploaded** — if a photo is already in one
   of your gallery folders, you don't have to upload it twice. List its path
   in `edit-me/6-highlights.ts` and it appears in Highlights too. That file
   explains exactly how, with an example.

If you list anything in `6-highlights.ts` it takes over from the folder.
Empty the list and it goes back to using `3-best-work`.

---

## The picture over your cover photo (the "meme")

There's a round picture sitting over your top photo, like a Facebook profile
picture — right now it's a joke photo of your friend Arnel. You can:

- **Swap it for your own photo** — just replace the file in
  `public/photos/2-profile-picture`, same as any other single-photo folder.
- **Remove it completely** — tell Clint, and it's a three-line deletion in the
  code with nothing left behind (it's fenced off in the code specifically so
  this is a clean, safe removal).

---

## If something looks wrong after a change

**Your site cannot break.** If a change causes a problem, the website keeps
showing the last version that worked. Visitors never see an error page — the
change just doesn't go out until it's fixed.

To undo a change:

1. Click **Commits** near the top of this page.
2. Find the change you want to undo.
3. Click it, then click **Revert**.
4. Wait about a minute. It's undone.

Almost every problem in an `edit-me` file is a missing comma or a missing
quotation mark. If you get stuck, message Clint — and remember the live site is
still fine while you sort it out.

---

## Things to know

- Changes take **about a minute** to appear after you commit. That's normal.
- If nobody has visited in a while, the first page load can take 30–60 seconds.
  After that it's fast again. Also normal.
- Don't upload video files here — see "Add a video" above.
- **`public/_gen` is not yours to touch.** You'll see it appear next to
  `public/photos` with what looks like the same pictures in it. It is: those
  are shrunk, web-ready copies the site builds automatically from your
  originals, every single time. It's a machine's scratch folder — it isn't
  saved to GitHub, it's rebuilt from scratch on every update, and anything
  you put in it would be wiped. Your real photos only ever live in
  `public/photos`.
- Every photo you upload automatically has its hidden location data removed
  before it goes live — so a photo from someone's home doesn't quietly reveal
  their address. You don't need to do anything for this; it just always happens.

---

## Technical notes

*Everything below is for a developer. You can stop reading here.*

Next.js (App Router, TypeScript), static export, Tailwind. No database, no
auth, no API routes, no CMS. Runtime dependencies are React and Next only.

- `scripts/optimize-media.mjs` runs before `dev` and `build`. It walks every
  folder in `public/photos/`, resizes each photo to 640/1280/2000/3000px WebP,
  **strips all metadata including GPS**, generates blur placeholders, and
  writes `src/lib/media-manifest.json`. Both `public/_gen/` and the manifest
  are gitignored and regenerated each build.
- The five `edit-me/*.ts` files are loaded and lightly normalized by
  `src/lib/content.ts` (trimming, dropping unparseable video links). A
  genuinely broken file — a missing comma, a wrong type — fails `next build`
  on its own, since these are typed TypeScript files and Next type-checks the
  build. Vercel keeps the last working deploy live.
- Caption resolution (`src/lib/media.ts`): an entry in `edit-me/5-captions.ts`
  wins (string = title only, or `{title, description}`); otherwise the
  filename's `NN--words` suffix, which can only express a title; otherwise no
  caption at all. The cover photo is the one exception — its caption is a
  dedicated field in `1-your-details.ts`, since there's only ever one of it.
- Four WebP widths (640/1280/2000/3000). `largestSrc()` feeds the zoom viewer
  ONLY; display slots use `displaySrc()`/`thumbSrc()` so the hero and the
  150px avatar don't pull the 3000px file on first paint.
- The zoom viewer steps 100 → 125 → 150 → 200% and wraps. A pointer that moves
  >5px between down and up is a pan, not a click, and must not step the zoom.
  The image wrapper hugs the image so "click outside the photo to close" means
  what it looks like.
- Gallery categories are derived entirely from the folders in
  `public/photos/5-gallery/`. There is no hardcoded category list; an empty
  folder renders nothing.
- The archive's category switch, the cover/profile/archive zoom viewer, and
  the top/bottom scroll edge fade are the three interactive systems — see
  `ArchiveInteractive.tsx`, `PhotoViewer.tsx`, and `ScrollEdgeFade.tsx`. No
  animation library. All motion is CSS plus one shared `IntersectionObserver`
  (`Reveal.tsx`), and every animated system has a defined instant/still state
  under `prefers-reduced-motion` — nothing is ever left invisible or stuck.
- Video is YouTube-only, rendered as a click-to-load facade against
  `youtube-nocookie.com` so no player JavaScript loads until play is pressed.
  Closing a playing video unmounts the iframe rather than pausing it — there's
  no way to pause a cross-origin embed without loading YouTube's player API.
- Contact is static links only — no form, no third-party relay, nothing to
  expire.
- `npm run dev` to run locally; `npm run build` for a production export into
  `out/`. Adding photos while the dev server is running needs a restart (or
  `npm run media`).
