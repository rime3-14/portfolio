import Link from "next/link";
import type { ReactNode } from "react";
import { contact } from "@/content/site";
import { asset } from "@/lib/metadata";

export function Arrow({ direction = "up" }: { direction?: "up" | "down" | "right" }) {
  const path = {
    up: "M4 12 12 4M4 4h8v8",
    down: "M8 2v12m-5-5 5 5 5-5",
    right: "M2 8h12M9 3l5 5-5 5",
  }[direction];

  return <svg className="arrow" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d={path} stroke="currentColor" strokeWidth="1.35" /></svg>;
}

export function TextLink({ href, children, direction }: { href: string; children: ReactNode; direction?: "right" | "down" }) {
  return <Link href={href} className="text-link">{children}<Arrow direction={direction} /></Link>;
}

export function SectionHead({ number, title, href, linkLabel }: { number: string; title: string; href?: string; linkLabel?: string }) {
  return (
    <div className="section-head">
      <p className="mono section-number">/{number}</p>
      <h2>{title}</h2>
      {href && linkLabel && <TextLink href={href}>{linkLabel}</TextLink>}
    </div>
  );
}

export function PageIntro({ label, title, description }: { label: string; title: string; description: string }) {
  return (
    <header className="page-intro">
      <p className="mono eyebrow">{label}</p>
      <h1>{title}</h1>
      <p className="page-deck">{description}</p>
    </header>
  );
}

export function ContactLinks() {
  const links = [
    { title: "GitHub", href: contact.github },
    { title: "LinkedIn", href: contact.linkedin },
    { title: "Email", href: contact.email ? "mailto:" + contact.email : undefined },
    { title: "Download CV", href: contact.cv?.startsWith("/") ? asset(contact.cv) : contact.cv, download: contact.cv?.startsWith("/") },
  ].filter((link) => link.href);

  return links.length > 0 && (
    <ul className="contact-links">
      {links.map((link) => (
        <li key={link.title}><a className="text-link" href={link.href} download={link.download}>{link.title}<Arrow /></a></li>
      ))}
    </ul>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="shell">
        <div className="footer-main">
          <p className="footer-statement">See you in the lab</p>
          <div className="footer-links">
            <ContactLinks />
            <TextLink href="/about/">About Rime</TextLink>
          </div>
        </div>
        <div className="footer-end mono">
          <span>Rime / Software engineering portfolio</span>
          <a href="#top" className="text-link">Back to top <span className="flip-arrow"><Arrow direction="down" /></span></a>
        </div>
      </div>
    </footer>
  );
}

