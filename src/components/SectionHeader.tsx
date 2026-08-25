// The chapter-number device for the five main sections (01 SELECTS through
// 05 CONTACT).
//
// Deliberately NOT the same treatment as the small numbers in the Index of
// Services or the frame numbers on tiles: those are quiet labels, while
// these are the page's structure. Here the numeral is bone-white and heavier,
// the rule is solid gold rather than faded, and the section name is bone at
// full contrast. Same vocabulary, one level louder -- no new colour is
// introduced to do it.
export default function SectionHeader({ number, label }: { number: string; label: string }) {
  return (
    <div className="mb-3 flex select-none items-center gap-3">
      <span className="font-mono text-[15px] font-bold leading-none tracking-[-0.02em] text-bone-100">
        {number}
      </span>
      <span className="h-px w-8 bg-gold-500" />
      <span className="font-mono text-[11px] font-bold tracking-[0.28em] text-bone-100/90">
        {label}
      </span>
    </div>
  );
}
