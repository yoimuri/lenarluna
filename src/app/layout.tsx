import type { Metadata } from "next";
import { Archivo, Figtree, Instrument_Serif, Space_Mono } from "next/font/google";
import "./globals.css";

// Display: Archivo at heavy weight, all caps in CSS. Body: Figtree.
// Mono: Space Mono -- the sheet-header labels, frame numbers, and nav
// buttons. See BUILD-SPEC.md section 3.
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["800", "900"],
  variable: "--font-archivo",
  display: "swap",
});

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-figtree",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

// The single accent face -- his quote beside the profile picture, nowhere
// else. Italic only, which is the whole reason to reach for it.
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-instrument-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lenar Joshua M. Luna — Photography & Videography",
  description:
    "Freelance photographer, videographer and video editor. Kiddie parties, debuts, weddings, corporate events, portraits, and more.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${figtree.variable} ${spaceMono.variable} ${instrumentSerif.variable}`}
    >
      <body className="bg-ink-900 text-bone-100 font-body antialiased">{children}</body>
    </html>
  );
}
