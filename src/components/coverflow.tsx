"use client";

import Link from "next/link";
import { useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { Arrow } from "./editorial";

type Item = {
  slug: string;
  title: string;
  category: string;
  description: string;
  githubOrganization?: string;
  artwork: ReactNode;
};

export function Coverflow({ items }: { items: Item[] }) {
  const [active, setActive] = useState(0);
  const dragStart = useRef<{ id: number; x: number; y: number } | null>(null);
  const suppressClick = useRef(false);
  const titleLink = useRef<HTMLAnchorElement>(null);
  const item = items[active];
  const count = items.length;

  function step(direction: -1 | 1) {
    setActive((index) => (index + direction + count) % count);
  }

  function handleKeys(event: KeyboardEvent<HTMLDivElement>) {
    if (count < 2 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

    event.preventDefault();
    if (event.target instanceof HTMLElement && event.target.closest(".coverflow-hit")) {
      titleLink.current?.focus({ preventScroll: true });
    }
    step(event.key === "ArrowLeft" ? -1 : 1);
  }

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    if (!event.isPrimary || event.button !== 0 || count < 2) return;
    suppressClick.current = false;
    dragStart.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
  }

  function endDrag(event: PointerEvent<HTMLDivElement>) {
    const start = dragStart.current;
    if (start?.id !== event.pointerId) return;

    dragStart.current = null;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) < 40 || Math.abs(dx) <= Math.abs(dy)) return;

    suppressClick.current = true;
    step(dx < 0 ? 1 : -1);
  }

  if (!item) return null;

  return (
    <div className="coverflow" role="region" aria-label="Selected projects" aria-roledescription="carousel" onKeyDown={handleKeys}>
      <div className="coverflow-stage"
        onPointerDown={startDrag} onPointerUp={endDrag} onPointerCancel={() => { dragStart.current = null; }}
        onDragStart={(event) => event.preventDefault()}
        onClickCapture={(event) => {
          if (suppressClick.current && event.detail !== 0) {
            suppressClick.current = false;
            event.preventDefault();
            event.stopPropagation();
          }
        }}>
        {items.map((slide, index) => {
          const offset = (index - active + count) % count;
          const side = offset === 0 ? "center" : offset === 1 ? "next" : offset === count - 1 ? "previous" : "hidden";

          return (
            <div className="coverflow-card" key={slide.slug} data-side={side} aria-hidden={side === "hidden" ? true : undefined}>
              <div className="coverflow-art" aria-hidden={side !== "center" ? true : undefined}>{slide.artwork}</div>
              {side === "center" ? (
                <Link className="coverflow-hit" href={"/work/" + slide.slug + "/"} aria-label={"Read case study: " + slide.title} />
              ) : side !== "hidden" && (
                <button type="button" className="coverflow-hit" aria-label={"Show " + slide.title} onClick={(event) => {
                  if (event.detail === 0) titleLink.current?.focus({ preventScroll: true });
                  setActive(index);
                }} />
              )}
            </div>
          );
        })}
      </div>
      <div className="coverflow-caption">
        <div>
          <p className="mono eyebrow">{item.category}</p>
          <h3>
            <Link className="coverflow-title" href={"/work/" + item.slug + "/"} ref={titleLink}>{item.title}</Link>
          </h3>
          <p className="coverflow-description">{item.description}</p>
          {item.githubOrganization && (
            <a className="project-index-github coverflow-github" href={item.githubOrganization}>PODCApp on GitHub</a>
          )}
        </div>
        {count > 1 && (
          <div className="coverflow-controls">
            <button type="button" aria-label="Previous project" onClick={() => step(-1)}><Arrow direction="right" /></button>
            <span className="mono" aria-hidden="true">{active + 1} / {count}</span>
            <button type="button" aria-label="Next project" onClick={() => step(1)}><Arrow direction="right" /></button>
          </div>
        )}
      </div>
      <p className="sr-only" aria-live="polite" aria-atomic="true">Project {active + 1} of {count}: {item.title}</p>
    </div>
  );
}

