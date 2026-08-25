import { getCategories } from "@/lib/media";

// Replaces the old scrolling marquee (removed -- it was the reference
// site's most recognisable device, and its reduced-motion state broke into
// four frozen rows). A table of every category, filed and counted, does the
// same job -- showing the full range of what he shoots -- and it can
// actually be read. See BUILD-SPEC.md section 4, "4. Index of services".
//
// Each row is a real link. It targets `#cat-<slug>`, which ArchiveInteractive
// listens for: clicking a service scrolls to the Archive AND switches it to
// that category, so the index is a way in rather than a list to admire.
export default function ServiceIndex() {
  const categories = getCategories();
  if (categories.length === 0) return null;

  const columns: (typeof categories)[] = [[], [], []];
  categories.forEach((cat, i) => columns[i % 3].push(cat));

  return (
    <div className="select-none px-5 pb-9 pt-16 sm:px-13 sm:pt-24">
      <div className="mb-4 border-b border-ink-700 pb-3">
        <span className="font-mono text-[10px] tracking-[0.24em] text-muted-400">INDEX OF SERVICES</span>
      </div>
      <div className="grid grid-cols-1 gap-x-13 sm:grid-cols-3">
        {columns.map((col, ci) => (
          <div key={ci}>
            {col.map((cat) => {
              const num = parseInt(cat.slug.match(/^\d+/)?.[0] ?? "0", 10);
              return (
                <a
                  key={cat.slug}
                  href={`#cat-${cat.slug}`}
                  className="group flex items-baseline gap-3.5 border-b border-ink-700/60 py-2.5 transition-colors duration-fast hover:border-gold-500/60"
                >
                  <span className="font-mono text-[10px] text-gold-500">{String(num).padStart(2, "0")}</span>
                  <span className="flex-grow truncate text-sm font-bold uppercase transition-colors duration-fast group-hover:text-gold-500">
                    {cat.label}
                  </span>
                  <span className="font-mono text-[10px] text-muted-400">
                    {String(cat.images.length).padStart(2, "0")}
                  </span>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="-ml-1 shrink-0 self-center text-gold-500 opacity-0 transition-opacity duration-fast group-hover:opacity-100"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
