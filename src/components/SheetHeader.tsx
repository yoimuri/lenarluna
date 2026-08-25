import { getSiteContent } from "@/lib/content";
import { getBestWork, getTotalPhotos } from "@/lib/media";

// A contact sheet is labelled along its edge -- who shot it, where, when,
// how many frames. This strip is the site's signature device; it exists in
// none of the reference sites. See BUILD-SPEC.md section 4, "3. Sheet header".
export default function SheetHeader() {
  const { you } = getSiteContent();
  const frames = getTotalPhotos() + getBestWork().length;

  const cells = [
    { label: "BASED", value: you.city || "—" },
    { label: "SHOOTING SINCE", value: you.since || "—" },
    { label: "FRAMES ON FILE", value: String(frames) },
    { label: "STATUS", value: you.status || "—", gold: true },
  ];

  return (
    <div className="grid select-none grid-cols-2 border-y border-ink-700 sm:grid-cols-4">
      {cells.map((cell, i) => (
        <div
          key={cell.label}
          className={`border-b border-ink-700 px-4 py-4 sm:border-b-0 sm:px-5 ${
            i < cells.length - 1 ? "sm:border-r sm:border-ink-700" : ""
          } ${i === cells.length - 1 ? "col-span-2 sm:col-span-1" : ""}`}
        >
          <div className="font-mono text-[9px] tracking-[0.2em] text-muted-400">{cell.label}</div>
          <div className={`mt-1.5 font-mono text-sm ${cell.gold ? "text-gold-500" : "text-bone-100"}`}>
            {/* The status is the one live-feeling thing in an otherwise
                static strip -- a slow breath, not a blink. It settles at
                full opacity under prefers-reduced-motion. */}
            {cell.gold ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold-500 animate-statusPulse" />
                <span className="animate-statusPulse">{cell.value}</span>
              </span>
            ) : (
              cell.value
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
