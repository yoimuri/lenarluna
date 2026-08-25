import type { ToolItem } from "@/lib/types";

// A handful of common editing tools get a recognisable monogram tile drawn
// entirely in markup -- no vendor logo files, no external requests, no
// trademark exposure. Anything else falls back to a plain initial.
function Monogram({ name }: { name: string }) {
  const n = name.toLowerCase();
  if (n.includes("premiere")) {
    return (
      <div className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-[6px] bg-[#2A0A38]">
        <span className="text-xs font-black tracking-[-0.02em] text-[#A98BFF]">Pr</span>
      </div>
    );
  }
  if (n.includes("lightroom")) {
    return (
      <div className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-[6px] bg-[#001E33]">
        <span className="text-xs font-black tracking-[-0.02em] text-[#4DA8E8]">Lr</span>
      </div>
    );
  }
  if (n.includes("davinci") || n.includes("resolve")) {
    return (
      <div className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-[6px] bg-[#151A1D]">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="8" stroke="#D9814A" strokeWidth="2.4" />
          <circle cx="12" cy="12" r="2.6" fill="#D9814A" />
        </svg>
      </div>
    );
  }
  if (n.includes("canva")) {
    return (
      <div className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#12B6C8] to-[#7A5CE0]">
        <span className="text-[13px] font-black tracking-[-0.02em] text-white">C</span>
      </div>
    );
  }
  return (
    <div className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-[6px] border border-gold-500/50 bg-ink-800">
      <span className="text-xs font-black tracking-[-0.02em] text-gold-500">{name.charAt(0).toUpperCase()}</span>
    </div>
  );
}

// The old single "toolkit" list, split into two so hardware and software
// read apart at a glance. See BUILD-SPEC.md AD-12.
export default function SoftwareGear({ software, gear }: { software: ToolItem[]; gear: ToolItem[] }) {
  if (software.length === 0 && gear.length === 0) return null;

  return (
    <div className="mt-9 select-none space-y-7">
      {software.length > 0 && (
        <div>
          <div className="mb-2.5 flex items-baseline justify-between border-b border-ink-700 pb-2.5">
            <span className="font-mono text-[10px] tracking-[0.22em] text-muted-400">SOFTWARE USED</span>
          </div>
          <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
            {software.map((tool) => (
              <div key={tool.name} className="flex items-center gap-3 border-b border-ink-700/60 py-3">
                <Monogram name={tool.name} />
                <span className="flex-grow text-sm">{tool.name}</span>
                {tool.use && (
                  <span className="font-mono text-[9px] tracking-[0.12em] text-muted-400">{tool.use.toUpperCase()}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {gear.length > 0 && (
        <div>
          <div className="mb-2.5 flex items-baseline justify-between border-b border-ink-700 pb-2.5">
            <span className="font-mono text-[10px] tracking-[0.22em] text-muted-400">GEAR USED</span>
          </div>
          <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
            {gear.map((item, i) => (
              <div key={item.name} className="flex items-baseline gap-3 border-b border-ink-700/60 py-3">
                <span className="font-mono text-[10px] text-gold-500">{String(i + 1).padStart(2, "0")}</span>
                <span className="flex-grow text-sm">{item.name}</span>
                {item.use && (
                  <span className="font-mono text-[9px] tracking-[0.12em] text-muted-400">{item.use.toUpperCase()}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
