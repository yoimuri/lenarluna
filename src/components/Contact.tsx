import { getSiteContent } from "@/lib/content";
import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";
import CopyField from "./CopyField";

// Brand marks, drawn as inline SVG so nothing is fetched from a CDN and no
// image file has to be maintained. These are in the platforms' OWN colours,
// not the site palette -- a recognisable logo is doing wayfinding work, and
// a monochrome Facebook mark makes someone look twice to be sure.
function FacebookMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="#1877F2" />
      <path
        fill="#FFFFFF"
        d="M15.9 15.47l.49-3.2h-3.07v-2.08c0-.87.43-1.73 1.8-1.73h1.4V5.74s-1.27-.22-2.48-.22c-2.54 0-4.19 1.53-4.19 4.31v2.44H7.04v3.2h2.81V23a11.13 11.13 0 0 0 3.47 0v-7.53z"
      />
    </svg>
  );
}

function InstagramMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <radialGradient id="ig-grad" cx="0.3" cy="1.05" r="1.25">
          <stop offset="0" stopColor="#FDD35D" />
          <stop offset="0.25" stopColor="#FA7E1E" />
          <stop offset="0.5" stopColor="#D62976" />
          <stop offset="0.75" stopColor="#962FBF" />
          <stop offset="1" stopColor="#4F5BD5" />
        </radialGradient>
      </defs>
      <rect x="1.6" y="1.6" width="20.8" height="20.8" rx="6" fill="url(#ig-grad)" />
      <circle cx="12" cy="12" r="4.4" fill="none" stroke="#FFFFFF" strokeWidth="1.9" />
      <circle cx="17.6" cy="6.5" r="1.25" fill="#FFFFFF" />
    </svg>
  );
}

function GmailMark() {
  // The official Gmail envelope: white body, coloured corners, red "M".
  return (
    <svg width="18" height="18" viewBox="0 0 52 40" aria-hidden="true">
      <path fill="#4285F4" d="M3.6 40h8.5V19.5L0 10.2v26.2C0 38.4 1.6 40 3.6 40z" />
      <path fill="#34A853" d="M39.9 40h8.5c2 0 3.6-1.6 3.6-3.6V10.2L39.9 19.5z" />
      <path fill="#FBBC04" d="M39.9 3.6v15.9L52 10.2V5.5c0-4.5-5.1-7-8.7-4.4z" />
      <path fill="#EA4335" d="M12.1 19.5V3.6L26 14 39.9 3.6v15.9L26 29.9z" />
      <path fill="#C5221F" d="M0 5.5v4.7l12.1 9.3V3.6L8.7 1.1C5.1-1.5 0 1 0 5.5z" />
    </svg>
  );
}

function PhoneMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B08850" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.4 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2z" />
    </svg>
  );
}

// "05 CONTACT" -- static links only, no form (AD-05). Every route is a
// plain <a> (or plain copyable text): it cannot silently fail, costs
// nothing, and will still work in five years.
export default function Contact() {
  const { you, contactIntro } = getSiteContent();
  const igUrl = you.instagramHandle ? `https://instagram.com/${you.instagramHandle}` : "";

  const links = [
    igUrl && { label: "INSTAGRAM", value: `@${you.instagramHandle}`, href: igUrl, mark: <InstagramMark /> },
    you.phonePublic &&
      you.phone && { label: "PHONE", value: you.phone, href: `tel:${you.phone}`, mark: <PhoneMark /> },
  ].filter(Boolean) as { label: string; value: string; href: string; mark: React.ReactNode }[];

  return (
    <section id="contact" className="border-t border-ink-700 px-5 py-14 sm:px-13 sm:py-16">
      <Reveal>
        <div className="grid grid-cols-1 items-start gap-9 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionHeader number="05" label="CONTACT" />
            <h2 className="font-display text-[2.2rem] font-black uppercase leading-[0.96] tracking-[-0.035em] sm:text-[2.9rem]">
              {you.contactHeading}
            </h2>
            {contactIntro && (
              <p className="mt-4 max-w-[44ch] text-sm leading-relaxed text-muted-400">
                {contactIntro}
              </p>
            )}
          </div>

          {/* Capped width, not a full-column stretch: these are short pieces of
              information, and a contact row running the whole width of a
              1440px screen reads as an empty bar with a word in it. */}
          <div className="w-full max-w-md space-y-2 lg:col-span-6 lg:justify-self-end">
            {you.facebookUrl && (
              <a
                href={you.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-gold-500 px-4 py-3.5 text-ink-900 transition-colors duration-fast hover:bg-bone-100"
              >
                <FacebookMark />
                <span className="flex-grow select-none font-mono text-[11px] font-bold tracking-[0.16em]">
                  MESSAGE ON FACEBOOK
                </span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            )}

            {/* Email is text + a copy button, never a mailto -- see CopyField.
                The Gmail mark lives INSIDE the same box (one row, not two)
                and is itself a link to Gmail, for anyone who would rather
                compose there than copy the address. */}
            {you.email && (
              <CopyField
                label="EMAIL"
                value={you.email}
                mark={<GmailMark />}
                markHref="https://mail.google.com/"
                markLabel="Open Gmail"
              />
            )}

            {links.map((row) => (
              <a
                key={row.label}
                href={row.href}
                target={row.href.startsWith("http") ? "_blank" : undefined}
                rel={row.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="flex items-center gap-3 border border-ink-700 px-4 py-3 transition-colors duration-fast hover:border-gold-500"
              >
                <span className="shrink-0">{row.mark}</span>
                <span className="min-w-0 flex-grow">
                  <span className="block select-none font-mono text-[9px] tracking-[0.2em] text-muted-400">
                    {row.label}
                  </span>
                  <span className="mt-1 block truncate text-sm">{row.value}</span>
                </span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-muted-400">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
