import { notFound } from "next/navigation";
import { TextLink } from "@/components/editorial";
import { notes } from "@/content/notes";
import { pageMetadata } from "@/lib/metadata";

type Params = { params: Promise<{ slug: string }> };
export const dynamicParams = false;

export function generateStaticParams() {
  return notes.map(({ slug }) => ({ slug }));
}

async function findNote(params: Params["params"]) {
  const { slug } = await params;
  const note = notes.find((entry) => entry.slug === slug);
  if (!note) notFound();
  return note;
}

export async function generateMetadata({ params }: Params) {
  const note = await findNote(params);
  return pageMetadata(note.title, note.summary, "/notes/" + note.slug + "/");
}

export default async function NotePage({ params }: Params) {
  const note = await findNote(params);
  const experiment = note.slug === "expression-to-tree";

  return (
    <article className="shell article">
      <div className="article-back"><TextLink href="/notes/">Notes index</TextLink></div>
      <header className="article-intro">
        <p className="mono eyebrow">Note / {note.category}</p>
        <h1>{note.title}</h1>
        <p className="page-deck">{note.summary}</p>
      </header>
      <div className="article-sections">
        {note.sections.map((section, index) => (
          <section className="article-section" key={section.title}>
            <p className="mono section-number">/0{index + 1}</p>
            <h2>{section.title}</h2>
            <p>{section.body}</p>
          </section>
        ))}
      </div>
      <div className="article-next"><span className="mono">Related</span>
        <TextLink href={experiment ? "/lab/compiler/" : "/work/numerical-computing/"} direction="right">
          {experiment ? "Interactive Compiler" : "Numerical Computing & Formal Verification"}
        </TextLink>
      </div>
    </article>
  );
}

