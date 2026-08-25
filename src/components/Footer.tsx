import { getSiteContent } from "@/lib/content";

export default function Footer() {
  const { you } = getSiteContent();
  const year = new Date().getFullYear();
  return (
    <footer className="flex flex-col items-center justify-between gap-3 border-t border-ink-700 px-5 py-7 sm:flex-row sm:px-13">
      <span className="font-mono text-[10px] tracking-[0.16em] text-muted-400">
        © {year} {you.name || "Lenar Joshua M. Luna"}
      </span>
      <a href="#top" className="font-mono text-[10px] tracking-[0.16em] text-muted-400 transition-colors duration-fast hover:text-gold-500">
        BACK TO TOP
      </a>
    </footer>
  );
}
