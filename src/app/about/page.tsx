import { ContactLinks, PageIntro, SectionHead } from "@/components/editorial";
import { contact, education, experience, leadership, type TimelineEntry } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

const summary = "I’m a software engineer with a background in computer science, mathematics, and design.";

export const metadata = pageMetadata("About", summary, "/about/");

function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <ol className="timeline">
      {entries.map(({ title, place, dates, description }) => (
        <li key={title}>
          <span className="mono timeline-group">{dates}</span>
          <h3>{title}</h3>
          <div><p>{place}</p><p>{description}</p></div>
        </li>
      ))}
    </ol>
  );
}

export default function AboutPage() {
  return (
    <div className="shell">
      <PageIntro label="/05 · Profile" title="I’m Rime" description={summary} />
      <section className="editorial-section after-intro">
        <SectionHead number="01" title="Background" />
        <div className="about-grid">
          <p className="about-lead">I like understanding how a system works and asking what it could do for someone.</p>
          <p>I’m completing a Computer Science engineering degree at INSA Lyon, with an exchange semester at LMU Munich. My work spans numerical computing research, generative AI for internal teams, and product design for a private audio app I co-founded.</p>
        </div>
      </section>
      <section className="editorial-section">
        <SectionHead number="02" title="Experience" />
        <Timeline entries={experience} />
      </section>
      <section className="editorial-section">
        <SectionHead number="03" title="Leadership" />
        <Timeline entries={leadership} />
      </section>
      <section className="editorial-section">
        <SectionHead number="04" title="Education" />
        <Timeline entries={education} />
      </section>
      <section className="editorial-section final-section">
        <SectionHead number="05" title="Interests" />
        <ul className="interests">
          {["AI systems", "Software development", "Mathematics", "Product design", "Human-centered technology"].map((interest) => <li key={interest}>{interest}</li>)}
        </ul>
      </section>
      {Object.values(contact).some(Boolean) && (
        <section className="editorial-section final-section">
          <SectionHead number="06" title="Contact" />
          <ContactLinks />
        </section>
      )}
    </div>
  );
}

