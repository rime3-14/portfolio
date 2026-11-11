export const identity = {
  name: "Rime",
  headline: "Curious about how things work, even more curious about building them!",
  subheading: "I’m a software engineer at the intersection of tech, design, and human experience.",
  disciplines: "Software engineering / Design / AI",
  website: "https://rime3-14.github.io/",
};

export const navigation = [
  { number: "01", label: "Index", href: "/" },
  { number: "02", label: "Work", href: "/work/" },
  { number: "03", label: "Lab", href: "/lab/" },
  { number: "04", label: "Notes", href: "/notes/" },
  { number: "05", label: "About", href: "/about/" },
] as const;

type Contact = { github?: string; linkedin?: string; email?: string; cv?: string };

// Add verified contact details here. For a local CV, add the PDF to public/.
export const contact: Contact = {};

export type TimelineEntry = { title: string; place: string; dates: string; description: string };

export const experience: TimelineEntry[] = [
  {
    title: "Research Intern, Formal Verification",
    place: "ENS de Lyon · LIP, Pascaline team",
    dates: "May–Aug 2026",
    description: "Verified rounding-error bounds for about ten double-word algorithms in Gappa and derived tighter bounds for operations including division.",
  },
  {
    title: "Software Engineering Intern, AI & Cloud",
    place: "TeamWork",
    dates: "Jun–Sep 2025",
    description: "Built and deployed an internal generative AI platform for 100+ employees in a four-person team. User interviews helped shape the task-based interface.",
  },
  {
    title: "Data Engineering Intern",
    place: "Direction Départementale des Territoires de la Loire",
    dates: "Jul 2023",
    description: "Optimized relational and geospatial databases for France’s national drought management framework using SQL and QGIS.",
  },
];

export const leadership: TimelineEntry[] = [
  {
    title: "Head of Corporate Relations",
    place: "AEDI · INSA Lyon Computer Science Student Association",
    dates: "May 2025–Jun 2026",
    description: "Led a seven-person team that signed 40 partner companies and generated more than €50,000 for a recruitment forum attended by over 300 students.",
  },
  {
    title: "International Business & Sales Officer",
    place: "Forum Organisation · Forum Rhône-Alpes",
    dates: "Oct–Nov 2025",
    description: "Developed relationships with French and international partners for a student recruitment fair.",
  },
];

export const education: TimelineEntry[] = [
  {
    title: "Computer Science Engineering Degree",
    place: "INSA Lyon",
    dates: "Expected Sep 2027",
    description: "Engineering degree at MSc level.",
  },
  {
    title: "Exchange Semester",
    place: "Ludwig-Maximilians-Universität München",
    dates: "Sep 2026–Feb 2027",
    description: "Coursework in system design, machine learning, stochastic processes, management, and UI/UX design.",
  },
];

