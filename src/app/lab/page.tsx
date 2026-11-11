import { LabFeature } from "@/components/collections";
import { PageIntro, SectionHead } from "@/components/editorial";
import { pageMetadata } from "@/lib/metadata";

const summary = "Little experiments, technical rabbit holes, and things I wanted to understand.";

export const metadata = pageMetadata("The Lab", summary, "/lab/");

export default function LabPage() {
  return (
    <div className="shell">
      <PageIntro label="/03 · Experiment index" title="The Lab" description={summary} />
      <section className="editorial-section after-intro final-section">
        <SectionHead number="01" title="Experiments" />
        <LabFeature />
      </section>
    </div>
  );
}

