import { ProjectIndex } from "@/components/collections";
import { pageMetadata } from "@/lib/metadata";

const summary = "Engineering, research, and design projects by Rime Chihab-Eddine.";

export const metadata = pageMetadata("Work", summary, "/work/");

export default function WorkPage() {
  return (
    <div className="shell work-index final-section">
      <header className="page-intro">
        <h1>Work</h1>
      </header>
      <ProjectIndex />
    </div>
  );
}

