import Link from "next/link";
import { projects } from "@/content/projects";
import { notes } from "@/content/notes";
import { experiments } from "@/content/lab";
import { Arrow } from "./editorial";
import { CompilerPreview } from "./visuals";

export function ProjectIndex() {
  return (
    <ul className="project-index">
      {projects.map(({ slug, title, description, github }) => (
        <li key={slug}>
          <div className="project-index-heading">
            <h2><Link className="project-index-title" href={"/work/" + slug + "/"}>{title}</Link></h2>
            {github && <a className="project-index-github" href={github} aria-label={"See " + title + " on GitHub"}>See on GitHub</a>}
          </div>
          <p className="project-index-description">{description}</p>
        </li>
      ))}
    </ul>
  );
}

export function LabFeature() {
  const experiment = experiments[0];

  return (
    <Link className="lab-feature" href={experiment.href}>
      <div className="lab-feature-copy">
        <p className="mono eyebrow">Experiment {experiment.number} / {experiment.category}</p>
        <h3>{experiment.title}</h3>
        <p>{experiment.description}</p>
        <span className="text-link">Open experiment <Arrow /></span>
      </div>
      <div className="lab-feature-figure">
        <div className="mono figure-expression">3 * (x + 2)</div>
        <CompilerPreview />
      </div>
    </Link>
  );
}

export function NotesList() {
  return (
    <ol className="notes-list">
      {notes.map((note, i) => (
        <li key={note.slug}>
          <Link href={"/notes/" + note.slug + "/"}>
            <span className="mono notes-index">{String(i + 1).padStart(2, "0")}</span>
            <div><h3>{note.title}</h3><p>{note.summary}</p></div>
            <span className="mono notes-category">{note.category}</span>
            <Arrow />
          </Link>
        </li>
      ))}
    </ol>
  );
}

