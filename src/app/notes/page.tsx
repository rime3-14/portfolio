import { NotesList } from "@/components/collections";
import { PageIntro, SectionHead } from "@/components/editorial";
import { pageMetadata } from "@/lib/metadata";

const summary = "Short investigations into software, mathematics, and how things work.";

export const metadata = pageMetadata("Notes", summary, "/notes/");

export default function NotesPage() {
  return (
    <div className="shell">
      <PageIntro label="/04 · Writing index" title="Notes" description={summary} />
      <section className="editorial-section after-intro final-section">
        <SectionHead number="01" title="Contents" />
        <NotesList />
      </section>
    </div>
  );
}

