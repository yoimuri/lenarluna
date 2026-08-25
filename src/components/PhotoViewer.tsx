"use client";

// One viewer for every photo on the site: the cover photo, the profile
// picture, and every tile in the archive grid all open here. See
// BUILD-SPEC.md section 6, "7b. Zoom viewer".
//
//   - Opens at whole-photo (contain).
//   - Clicking steps UP through 100% -> 125% -> 150% -> 200%, then wraps
//     back to 100%. The first step anchors on the click point, so clicking
//     a face zooms that face rather than the middle of the frame.
//   - Dragging pans while zoomed and is NOT treated as a click, so letting
//     go of a drag no longer snaps the zoom back a level.
//   - Escape, the close button, and clicking anywhere outside the photo
//     itself all close it. Native pinch-zoom is never disabled.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type ViewerImage = { src: string; alt: string; caption?: string; description?: string };

/**
 * `zoomable` is per-open, not global. Only the photographs someone would
 * actually inspect -- Highlights and the Archive -- get the zoom stepping.
 * The cover photo and the profile picture open as a plain full view: there
 * is nothing to examine in a cover crop or a 150px avatar, and offering a
 * zoom control there just invites someone to magnify a soft image.
 */
type ViewerState = { images: ViewerImage[]; index: number; zoomable: boolean } | null;

// Four steps, not two. One click from rest lands on a gentle 125% rather
// than jumping straight to a hard 200%, which is what makes the control
// feel like inspecting a photo instead of toggling a switch.
const ZOOM_LEVELS = [1, 1.25, 1.5, 2] as const;

// How far the pointer may move between press and release and still count as
// a click. Below this a shaky hand still zooms; above it, it was a pan.
const DRAG_SLOP_PX = 5;

const PhotoViewerContext = createContext<
  ((images: ViewerImage[], startIndex: number, zoomable?: boolean) => void) | null
>(null);

export function usePhotoViewer() {
  const open = useContext(PhotoViewerContext);
  if (!open) throw new Error("usePhotoViewer must be used inside <PhotoViewerProvider>");
  return open;
}

export function PhotoViewerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ViewerState>(null);

  const open = useCallback((images: ViewerImage[], startIndex: number, zoomable = true) => {
    setState({ images, index: startIndex, zoomable });
  }, []);

  const close = useCallback(() => setState(null), []);

  return (
    <PhotoViewerContext.Provider value={open}>
      {children}
      {state && (
        <PhotoViewerModal
          images={state.images}
          index={state.index}
          zoomable={state.zoomable}
          onIndexChange={(index) => setState({ images: state.images, index, zoomable: state.zoomable })}
          onClose={close}
        />
      )}
    </PhotoViewerContext.Provider>
  );
}

// A clickable wrapper around any photo. Renders its children (usually a
// plain <img>) plus a small zoom-cue badge, and opens the shared viewer on
// click, positioned at `index` within `images`.
export function ZoomTrigger({
  images,
  index,
  className = "",
  zoomable = true,
  cue = "corner",
  children,
  ...rest
}: {
  images: ViewerImage[];
  index: number;
  className?: string;
  /** false = opens as a plain full view with no zoom stepping. */
  zoomable?: boolean;
  /** "corner" pins the cue top-right; "cursor" lets it follow the pointer. */
  cue?: "corner" | "cursor" | "none";
  children: ReactNode;
  /** Passthrough for data-* attributes (the Archive tags tiles with
   *  data-frame so an observer can report which one is in view). */
  [key: `data-${string}`]: unknown;
}) {
  const open = usePhotoViewer();
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  const icon = zoomable ? (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B08850" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.6-3.6M11 8.5v5M8.5 11h5" />
    </svg>
  ) : (
    // Expand arrows, not a magnifier -- this one opens a full view, it does
    // not zoom, and the icon should not promise otherwise.
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B08850" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3H3v6M15 3h6v6M9 21H3v-6M15 21h6v-6" />
    </svg>
  );

  return (
    <button
      type="button"
      onClick={() => open(images, index, zoomable)}
      onMouseMove={
        cue === "cursor"
          ? (e) => {
              const r = e.currentTarget.getBoundingClientRect();
              setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
            }
          : undefined
      }
      onMouseLeave={cue === "cursor" ? () => setPos(null) : undefined}
      className={`group relative block w-full text-left ${className}`}
      aria-label={`Open ${images[index]?.alt || "photo"} full size`}
      {...rest}
    >
      {children}

      {cue === "corner" && (
        <span className="pointer-events-none absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-gold-500/75 bg-ink-900/55 opacity-0 transition-opacity duration-fast group-hover:opacity-100 group-focus-visible:opacity-100">
          {icon}
        </span>
      )}

      {/* A fixed corner badge is easy to miss on a full-bleed cover photo, so
          here the cue rides with the cursor and appears wherever the eye
          already is. It falls back to a bottom-right badge for keyboard
          focus and on touch, where there is no pointer to follow. */}
      {cue === "cursor" && (
        <>
          <span
            className="pointer-events-none absolute z-30 hidden h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gold-500/80 bg-ink-900/70 backdrop-blur-sm transition-opacity duration-fast sm:flex"
            style={{
              left: pos?.x ?? 0,
              top: pos?.y ?? 0,
              opacity: pos ? 1 : 0,
            }}
          >
            {icon}
          </span>
          <span className="pointer-events-none absolute bottom-4 right-4 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-gold-500/70 bg-ink-900/60 opacity-100 transition-opacity duration-fast group-focus-visible:opacity-100 sm:opacity-0">
            {icon}
          </span>
        </>
      )}
    </button>
  );
}

function PhotoViewerModal({
  images,
  index,
  zoomable,
  onIndexChange,
  onClose,
}: {
  images: ViewerImage[];
  index: number;
  zoomable: boolean;
  onIndexChange: (i: number) => void;
  onClose: () => void;
}) {
  const [zoomStep, setZoomStep] = useState(0);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const [dragging, setDragging] = useState(false);
  // The pixel-accurate cap the image is allowed to render at, measured
  // straight off the actual available area -- see the effect below for why
  // `max-height: 100%` in CSS alone can't be trusted here.
  const viewerAreaRef = useRef<HTMLDivElement>(null);
  const [maxSize, setMaxSize] = useState<{ w: number; h: number } | null>(null);

  // Everything about an in-progress press lives in a ref, not state: it is
  // updated on every pointermove and must not re-render the image.
  const press = useRef<{
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    moved: boolean;
  } | null>(null);

  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const current = images[index];
  const canNav = images.length > 1;
  const scale = zoomable ? ZOOM_LEVELS[zoomStep] : 1;
  const isZoomed = scale > 1;

  // Reset zoom whenever the photo changes.
  useEffect(() => {
    setZoomStep(0);
    setOrigin({ x: 50, y: 50 });
  }, [index]);

  useEffect(() => {
    closeBtnRef.current?.focus();
  }, []);

  // Measures the actual available space and caps the image to it in real
  // pixels, rather than leaning on CSS `max-height: 100%`. That percentage
  // only resolves against a parent whose OWN `height` is explicitly set --
  // and this parent's height only ever comes FROM that same max-height
  // percentage, so per spec it never counts as "explicit." The practical
  // effect: a landscape photo (width is always the limiting side here) never
  // showed it, but a portrait photo rendered at its full native pixel size
  // with the height cap silently ignored -- overflowing off the top and
  // bottom of the screen, which read as the photo opening pre-zoomed even
  // though nothing was ever actually zoomed. useLayoutEffect (not useEffect)
  // so this measures and applies before the browser paints -- no flash of
  // the oversized image on the way in.
  useLayoutEffect(() => {
    const el = viewerAreaRef.current;
    if (!el) return;
    const update = () => {
      const cs = getComputedStyle(el);
      const padX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
      const padY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
      setMaxSize({ w: el.clientWidth - padX, h: el.clientHeight - padY });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  // Lock background scrolling while the viewer is open.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (canNav && e.key === "ArrowRight") onIndexChange((index + 1) % images.length);
      if (canNav && e.key === "ArrowLeft") onIndexChange((index - 1 + images.length) % images.length);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [canNav, index, images.length, onIndexChange, onClose]);

  function stepZoom(e: React.PointerEvent<HTMLDivElement>) {
    if (!zoomable) return;
    const next = (zoomStep + 1) % ZOOM_LEVELS.length;
    // Anchor on the click point only when starting from rest; once zoomed in,
    // stepping further should keep whatever the viewer has panned to.
    if (zoomStep === 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      setOrigin({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    }
    if (next === 0) setOrigin({ x: 50, y: 50 });
    setZoomStep(next);
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    // Ignore secondary buttons and multi-touch (let pinch-zoom through).
    if (e.button !== 0 || !e.isPrimary) return;
    press.current = {
      startX: e.clientX,
      startY: e.clientY,
      originX: origin.x,
      originY: origin.y,
      moved: false,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const p = press.current;
    if (!p) return;

    const dx = e.clientX - p.startX;
    const dy = e.clientY - p.startY;

    if (!p.moved && Math.hypot(dx, dy) > DRAG_SLOP_PX) {
      p.moved = true;
      if (isZoomed) setDragging(true);
    }
    if (!p.moved || !isZoomed) return;

    const rect = e.currentTarget.getBoundingClientRect();
    // Divide by scale so a pan feels 1:1 with the cursor at every zoom level.
    setOrigin({
      x: Math.min(100, Math.max(0, p.originX - (dx / rect.width) * 100 / (scale - 1 || 1))),
      y: Math.min(100, Math.max(0, p.originY - (dy / rect.height) * 100 / (scale - 1 || 1))),
    });
  }

  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    const p = press.current;
    press.current = null;
    setDragging(false);
    if (!p) return;
    // THE FIX: a release that followed a real drag is not a click, so it
    // must not step the zoom. Only a press that never moved counts.
    if (!p.moved) stepZoom(e);
  }

  const cursor = !zoomable ? "default" : dragging ? "grabbing" : isZoomed ? "grab" : "zoom-in";

  return (
    <div
      className="fixed inset-0 z-[80] flex flex-col bg-ink-900/95 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={current?.alt || "Photo viewer"}
    >
      <div className="flex flex-shrink-0 items-center justify-between px-5 py-4">
        <span className="select-none font-mono text-[10px] tracking-[0.18em] text-muted-400">
          {canNav ? `${String(index + 1).padStart(2, "0")} / ${String(images.length).padStart(2, "0")}` : ""}
        </span>
        <div className="flex items-center gap-3">
          {zoomable && (
            <span className="select-none font-mono text-[10px] tracking-[0.18em] text-gold-500">
              {Math.round(scale * 100)}%
            </span>
          )}
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-bone-100/25 text-bone-100 transition-colors duration-fast hover:border-gold-500 hover:text-gold-500"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Clicking this container -- i.e. anywhere that isn't the photo
          itself -- closes the viewer. The photo wrapper below hugs the
          image exactly, so "outside the photo" means what it looks like. */}
      <div
        ref={viewerAreaRef}
        className="relative flex flex-1 items-center justify-center overflow-hidden px-4 pb-2"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        {canNav && (
          <button
            type="button"
            aria-label="Previous photo"
            onClick={() => onIndexChange((index - 1 + images.length) % images.length)}
            className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-bone-100/25 bg-ink-900/60 text-bone-100 transition-colors duration-fast hover:border-gold-500 hover:text-gold-500 sm:left-5"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
        )}

        <div
          className="relative max-h-full max-w-full touch-none overflow-hidden"
          style={{ cursor }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={() => {
            press.current = null;
            setDragging(false);
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- static export, no image loader */}
          <img
            key={current?.src}
            src={current?.src}
            alt={current?.alt || ""}
            className={`block max-h-full max-w-full select-none object-contain ${
              dragging ? "" : "transition-transform duration-base ease-shutter"
            }`}
            style={{
              // Real pixel values, not CSS max-height/max-width percentages
              // -- see the useLayoutEffect above for why those don't reach
              // this element. Falls back to the (broken-for-tall-photos, but
              // harmless) Tailwind classes for the one frame before the
              // layout effect has measured anything.
              maxWidth: maxSize ? `${maxSize.w}px` : undefined,
              maxHeight: maxSize ? `${maxSize.h}px` : undefined,
              transformOrigin: `${origin.x}% ${origin.y}%`,
              transform: `scale(${scale})`,
              // Deliberately left at the browser default. Forcing
              // `crisp-edges`/`pixelated` here only trades blur for
              // aliasing -- it cannot invent detail that isn't in the file.
              // Sharpness at 200% comes from RESOLUTION, which is why the
              // pipeline now exports up to 3000px (AD-02) and why this
              // viewer is handed largestSrc(). A photo that still looks
              // soft when magnified is a photo that was uploaded small.
            }}
            draggable={false}
          />
        </div>

        {canNav && (
          <button
            type="button"
            aria-label="Next photo"
            onClick={() => onIndexChange((index + 1) % images.length)}
            className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-bone-100/25 bg-ink-900/60 text-bone-100 transition-colors duration-fast hover:border-gold-500 hover:text-gold-500 sm:right-5"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      <div className="flex-shrink-0 px-5 pb-5 pt-2 text-center">
        {current?.caption && (
          <p className="text-[15px] font-bold tracking-[-0.01em] text-bone-100">{current.caption}</p>
        )}
        {current?.description && (
          <p className="mx-auto mt-1.5 max-w-[62ch] text-sm leading-relaxed text-muted-400">
            {current.description}
          </p>
        )}
        {zoomable && (
          <p className="mt-2 select-none font-mono text-[9px] tracking-[0.16em] text-muted-400">
            {isZoomed ? "DRAG TO PAN · CLICK TO ZOOM FURTHER" : "CLICK THE PHOTO TO ZOOM"}
          </p>
        )}
      </div>
    </div>
  );
}
