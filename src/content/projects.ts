import { githubProjects, schoolCaseStudy, studyBuddy } from "./github-projects";

export type ProjectVisualKind = "precision" | "llm" | "podcapp" | "study-buddy";

export type Project = {
  number?: string;
  slug: string;
  title: string;
  category: string;
  context: string;
  description: string;
  stack: string[];
  visual?: ProjectVisualKind;
  overview: string;
  problem: string;
  implementation: string;
  decisions: string;
  outcomes: string;
  year?: string;
  github?: string;
  githubOrganization?: string;
  demo?: string;
  resources?: { title: string; href: string; external?: boolean }[];
};

type FeaturedProject = Project & { visual: ProjectVisualKind };

const [numericalComputing, teamwork, podcapp]: FeaturedProject[] = [
  {
    number: "03",
    slug: "numerical-computing",
    title: "Numerical Computing & Formal Verification",
    category: "Numerical computing",
    context: "Research internship · ENS Lyon",
    description: "Formal proofs of rounding-error bounds for double-word arithmetic using Gappa.",
    stack: ["Double-word arithmetic", "Gappa"],
    visual: "precision",
    github: schoolCaseStudy("gappa"),
    overview: "During a research internship at ENS Lyon, I worked on error bounds for double-word floating-point arithmetic and on expressing those bounds as formal proofs in Gappa.",
    problem: "Every rounded operation introduces a small difference between the value a machine computes and the corresponding real-number result. In a sequence of operations, those differences can compound or become significant after cancellation. A useful bound has to state the assumptions under which it applies.",
    implementation: "Double-word arithmetic represents a value as the sum of a high and a low component. I translated the assumptions and intermediate steps for addition, division, and square root into Gappa proof scripts that relate the rounded computation to its exact result.",
    decisions: "The representation and the proof are linked. A bound depends on the rounding model, the range of intermediate quantities, and the relationship between the high and low components. Each assumption needs to be visible so a bound can be applied correctly.",
    outcomes: "I verified that representative scripts run with Gappa 1.8.0 and documented how the solver established the rounding-error bounds.",
    resources: [{ title: "Gappa documentation", href: "https://gappa.gitlabpages.inria.fr/gappa/", external: true }, { title: "Read the note on rounding", href: "/notes/where-rounding-enters/" }],
  },
  {
    number: "02",
    slug: "building-with-llms",
    title: "Building with LLMs",
    category: "AI systems",
    context: "Engineering internship · TeamWork",
    description: "An internal generative AI platform made available to more than 100 TeamWork employees.",
    stack: ["Azure OpenAI", "OutSystems", "n8n"],
    visual: "llm",
    overview: "At TeamWork I contributed to building and deploying a generative AI platform for internal use. The team delivered the platform to more than 100 employees.",
    problem: "Interviews with HR, sales, and Salesforce users showed that employees wanted reliable results for recurring tasks. Writing effective prompts was an extra step in work they already had to do.",
    implementation: "I built the OutSystems frontend and n8n workflows as part of a four-person team using Azure OpenAI. One workflow turned transcripts into reports that could be exported as PDF, Word, or PowerPoint.",
    decisions: "We organized the interface around tasks such as drafting an email or summarizing a meeting. Each workflow handled the reusable prompt behind the interface.",
    outcomes: "We deployed the platform for more than 100 employees. Sales used it for a client pitch, and HR used it to prepare a report from a hiring interview.",
  },
  {
    number: "01",
    slug: "podcapp",
    title: "PODCApp",
    category: "Product & mobile",
    context: "Co-founder · Product & UI Lead",
    description: "A private audio-letter app for friends, now preparing for its first mobile release.",
    stack: ["Flutter", "Dart", "Supabase"],
    visual: "podcapp",
    githubOrganization: "https://github.com/podcapp",
    overview: "I co-founded PODCApp, a private audio-letter app for keeping in touch with friends. I lead product decisions, screen design, and the visual identity.",
    problem: "Finding a time for a call can be difficult. A short voice message gives people room to speak in their own time and keeps qualities like tone and rhythm that are easy to lose in text.",
    implementation: "We built the app with Flutter and Supabase. The core flow covers accounts, friend requests, recording, sending an audio letter, and listening from the inbox.",
    decisions: "We designed around exchanges between accepted friends. A private inbox and asynchronous listening let each person record and listen when they have time.",
    outcomes: "The core audio-letter flow is working. We’re preparing for our first mobile release.",
  },
];

export const featuredProjects: FeaturedProject[] = [podcapp, studyBuddy, teamwork, numericalComputing];
export const projects: Project[] = [numericalComputing, teamwork, podcapp, ...githubProjects];


