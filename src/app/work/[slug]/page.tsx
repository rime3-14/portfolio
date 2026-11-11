import { notFound } from "next/navigation";
import { TextLink } from "@/components/editorial";
import { ProjectVisual } from "@/components/visuals";
import { projects } from "@/content/projects";
import { pageMetadata } from "@/lib/metadata";

type Params = { params: Promise<{ slug: string }> };
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

async function findProject(params: Params["params"]) {
  const { slug } = await params;
  const project = projects.find((entry) => entry.slug === slug);
  if (!project) notFound();
  return project;
}

export async function generateMetadata({ params }: Params) {
  const project = await findProject(params);
  return pageMetadata(project.title, project.description, "/work/" + project.slug + "/");
}

export default async function CaseStudy({ params }: Params) {
  const project = await findProject(params);
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  const sections = [
    { title: "Overview", text: project.overview },
    { title: "The problem", text: project.problem },
    { title: "Implementation", text: project.implementation },
    { title: "Engineering decisions", text: project.decisions },
    { title: "Results & learnings", text: project.outcomes },
  ];

  return (
    <article className="shell article">
      <div className="article-back"><TextLink href="/work/">Work index</TextLink></div>
      <header className="article-intro">
        <p className="mono eyebrow">Case study{project.number && " /" + project.number} · {project.category}{project.year && " · " + project.year}</p>
        <h1>{project.title}</h1>
        <p className="page-deck">{project.description}</p>
        <dl className="article-meta">
          <div><dt className="mono">Context</dt><dd>{project.context}</dd></div>
          <div><dt className="mono">Methods & tools</dt><dd>{project.stack.join(" / ")}</dd></div>
        </dl>
      </header>
      {project.visual && <ProjectVisual visual={project.visual} />}
      <div className="article-sections">
        {sections.map(({ title, text }, i) => (
          <section className="article-section" key={title}>
            <p className="mono section-number">/0{i + 1}</p>
            <h2>{title}</h2>
            <p>{text}</p>
          </section>
        ))}
        {(project.resources?.length || project.github || project.githubOrganization || project.demo) && (
          <section className="article-section">
            <p className="mono section-number">/06</p>
            <h2>Explore</h2>
            <ul className="resource-list">
              {project.resources?.map(({ title, href, external }) => (
                <li key={href}>{external ? <a href={href}>{title}</a> : <TextLink href={href}>{title}</TextLink>}</li>
              ))}
              {project.github && <li><a href={project.github}>See on GitHub</a></li>}
              {project.githubOrganization && <li><a href={project.githubOrganization}>{project.title} on GitHub</a></li>}
              {project.demo && <li><a href={project.demo}>Live demo</a></li>}
            </ul>
          </section>
        )}
      </div>
      <div className="article-next"><span className="mono">Next case study</span><TextLink href={"/work/" + next.slug + "/"} direction="right">{next.title}</TextLink></div>
    </article>
  );
}

