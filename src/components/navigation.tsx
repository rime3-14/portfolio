"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation } from "@/content/site";

export function Navigation() {
  const pathname = usePathname().replace(/\/$/, "") || "/";

  return (
    <header className="masthead" id="top">
      <div className="shell masthead-inner">
        <Link className="brand" href="/" aria-label="Rime, home" aria-current={pathname === "/" ? "page" : undefined}>
          RIME <span className="brand-slash">/</span> <span className="brand-index">INDEX</span>
        </Link>
        <span className="masthead-edition mono">Software engineering portfolio</span>
        <nav aria-label="Main navigation">
          {navigation.slice(1).map(({ number, label, href }) => {
            const current = href.slice(0, -1);
            const active = pathname === current || pathname.startsWith(href);

            return (
              <Link className={active ? "nav-link active" : "nav-link"} key={href} href={href}
                aria-current={active ? (pathname === current ? "page" : "location") : undefined}>
                <span className="nav-number" aria-hidden="true">{number}</span>{label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

