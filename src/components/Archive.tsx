import { getCategories, getTotalPhotos } from "@/lib/media";
import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";
import ArchiveInteractive from "./ArchiveInteractive";

// "03 ARCHIVE" -- "Everything else on file". See BUILD-SPEC.md section 4.
export default function Archive() {
  const categories = getCategories();
  const total = getTotalPhotos();
  if (categories.length === 0) return null;

  return (
    <section id="archive" className="px-5 pb-16 pt-4 sm:px-13 sm:pb-22">
      <Reveal>
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <SectionHeader number="03" label="GALLERY" />
            <h2 className="font-display text-[2.2rem] font-black uppercase leading-[0.96] tracking-[-0.035em] sm:text-[2.9rem]">
              Explore Highlights by Category
            </h2>
          </div>
        </div>
      </Reveal>

      <ArchiveInteractive categories={categories} total={total} />
    </section>
  );
}
