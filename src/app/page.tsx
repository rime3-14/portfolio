import { LabFeature, NotesList } from "@/components/collections";
import Link from "next/link";
import { Arrow, SectionHead, TextLink } from "@/components/editorial";
import { ProjectVisual, WaveStudy } from "@/components/visuals";
import { Coverflow } from "@/components/coverflow";
import { featuredProjects } from "@/content/projects";
import { identity } from "@/content/site";
import { description, pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Index", description, "/");

const headlineLines = ["Curious about how", "things work, even", "more curious about", "building them!"];

export default function Home() {
  return (
    <div className="shell">
      <section className="hero" aria-labelledby="hero-title">
        <p className="hero-index mono">{identity.disciplines}</p>
        <div className="hero-composition">
          <div className="hero-title">
            <h1 id="hero-title" aria-label={identity.headline}>
              {headlineLines.map((line, i) => <span key={line}>{line}{i < headlineLines.length - 1 && " "}</span>)}
            </h1>
            <p><strong>Hi, I’m {identity.name}.</strong> {identity.subheading}</p>
            <div className="hero-bottom">
              <Link className="primary-link" href="/work/">View all projects <Arrow direction="right" /></Link>
              <TextLink href={identity.website}>Personal website</TextLink>
            </div>
          </div>
          <WaveStudy />
        </div>
      </section>

      <section className="editorial-section" id="selected-work">
        <SectionHead number="02" title="Selected Work" />
        <Coverflow items={featuredProjects.map(({ slug, title, description, category, visual, githubOrganization }) => ({
          slug, title, description, category, githubOrganization, artwork: <ProjectVisual visual={visual} />,
        }))} />
      </section>

      <section className="editorial-section">
        <SectionHead number="03" title="The Lab" href="/lab/" linkLabel="Lab index" />
        <LabFeature />
      </section>

      <section className="editorial-section final-section">
        <SectionHead number="04" title="Notes" href="/notes/" linkLabel="All notes" />
        <NotesList />
      </section>
    </div>
  );
}

