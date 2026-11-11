import Image from "next/image";
import type { ProjectVisualKind } from "@/content/projects";
import { asset } from "@/lib/metadata";
import { llmPortrait } from "./llm-portrait";

export function WaveStudy() {
  const lines = Array.from({ length: 25 }, (_, row) => {
    return Array.from({ length: 81 }, (_, sample) => {
      const u = sample / 80 * 2 - 1;
      const v = row / 24 * 2 - 1;
      const r = Math.hypot(u, v);
      const z = 30 * Math.cos(8.7 * r - 1.2) * Math.exp(-1.9 * r * r);
      const x = 168 + u * 117 + v * 31;
      const y = 111 + v * 61 - u * 12 - z;
      return (sample === 0 ? "M" : "L") + x.toFixed(1) + " " + y.toFixed(1);
    }).join(" ");
  });

  return (
    <div className="wave-study" aria-hidden="true">
      <div className="wave-plate">
        <svg viewBox="0 0 336 216">
          <path d="M16 30V16h14m276 0h14v14M16 186v14h14m276 0h14v-14" fill="none" stroke="#809181" strokeWidth=".8" />
          <path d="M168 20v176M20 108h296" stroke="#9fac9e" strokeWidth=".65" strokeDasharray="2 5" />
          {lines.map((d, i) => <path key={i} d={d} fill="none" stroke="currentColor" strokeWidth={i % 6 === 0 ? 1.15 : 0.8} opacity={i % 6 === 0 ? 0.95 : 0.68} />)}
          <circle cx="168" cy="108" r="2" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
}

function Precision() {
  const curve = (offset: number) => Array.from({ length: 129 }, (_, i) => {
    const t = i / 128;
    const x = 68 + t * 672;
    const signal = 216 - 159 * t + 13 * Math.sin(t * 21) + 6 * Math.sin(t * 40);
    return (i === 0 ? "M" : "L") + x.toFixed(2) + " " + (signal + offset * (0.8 + 0.2 * Math.cos(t * 11))).toFixed(2);
  }).join(" ");

  return (
    <svg viewBox="0 0 800 298" role="img" aria-label="Illustrative numerical trace with upper and lower error bounds">
      <g stroke="#758980" strokeWidth=".65" opacity=".62">
        {Array.from({ length: 11 }, (_, i) => <path key={i} d={"M" + (68 + i * 67.2) + " 32v220"} />)}
        {[32, 76, 120, 164, 208, 252].map(y => <path key={y} d={"M68 " + y + "h672"} />)}
      </g>
      <g fill="none">
        <path d={curve(-16)} stroke="#adccba" strokeDasharray="4 5" strokeWidth="1.25" />
        <path d={curve(16)} stroke="#adccba" strokeDasharray="4 5" strokeWidth="1.25" />
        <path d={curve(0)} stroke="#d8f4df" strokeWidth="2.6" />
      </g>
      <g fill="#cee0d2" className="diagram-type">
        <text x="68" y="20">ILLUSTRATIVE ERROR BOUND</text>
        <text x="67" y="274">0</text>
        <text x="397" y="274">0.5</text>
        <text x="734" y="274">1</text>
      </g>
    </svg>
  );
}

function AsciiCover() {
  return (
    <svg className="ascii-cover" viewBox="0 0 400 502" role="img"
      aria-label="ASCII adaptation of the cover of Build a Large Language Model (From Scratch) by Sebastian Raschka">
      <rect width="400" height="502" fill="#fffaf3" />
      <rect width="154" height="502" fill="#2e1018" />
      <g fontFamily="var(--font-mono)" fill="#56382d" fontSize="9.1" aria-hidden="true">
        {llmPortrait.map((line, index) => (
          <text key={index} x="156" y={48 + index * 9.4}>{line.replaceAll(" ", "\u00a0")}</text>
        ))}
      </g>
      <g fontFamily="var(--font-mono)" aria-hidden="true">
        <text x="18" y="109" fill="#f4e5dd" fontSize="15">BUILD A</text>
        <text x="16" y="151" fill="#f1d367" fontSize="25" fontWeight="500">
          <tspan x="16">LARGE</tspan><tspan x="16" dy="29">LANGUAGE</tspan><tspan x="16" dy="29">MODEL</tspan>
        </text>
        <text x="18" y="292" fill="#f4e5dd" fontSize="13">
          <tspan x="18">SEBASTIAN</tspan><tspan x="18" dy="18">RASCHKA</tspan>
        </text>
        <path d="M302 0h98v98Z" fill="#ac2b32" />
        <text x="347" y="23" transform="rotate(45 347 23)" textAnchor="middle" fill="#fff5ed" fontSize="12">
          <tspan x="366">FROM</tspan><tspan x="366" dy="15">SCRATCH</tspan>
        </text>
      </g>
    </svg>
  );
}

function StudyBuddyTrace() {
  const workflows = [
    { name: "Summarize", calls: ["Generate summary"] },
    { name: "Flashcards", calls: ["Generate cards"] },
    { name: "Quiz", calls: ["Generate question", "Check answer"] },
  ];

  return (
    <svg viewBox="0 0 640 300" role="img" aria-label="Study Buddy traces one Gemini call each for summaries and flashcards, and two for quizzes">
      <g fontFamily="var(--font-mono)">
        <text x="42" y="53" fill="#f5efff" fontSize="27" fontWeight="500">Study Buddy</text>
        <text x="42" y="82" fill="#cfbfe9" fontSize="15">Datadog LLM Observability</text>
        {workflows.map(({ name, calls }, row) => {
          const y = 112 + row * 49;
          return (
            <g key={name}>
              <path d={`M42 ${y + 41}H598`} stroke="#564765" />
              <text x="42" y={y + 21} fill="#f5efff" fontSize="15">{name}</text>
              {calls.map((call, index) => (
                <g key={call}>
                  <rect x={182 + index * 196} y={y} width="186" height="32" rx="4" fill={index === 0 ? "#4c3866" : "#5a4480"} />
                  <text x={194 + index * 196} y={y + 21} fill="#f5efff" fontSize="14">{call}</text>
                </g>
              ))}
            </g>
          );
        })}
      </g>
    </svg>
  );
}

export function ProjectVisual({ visual }: { visual: ProjectVisualKind }) {
  return (
    <div className={"project-visual " + visual}>
      <div className="project-visual-body">
        {visual === "precision" && <Precision />}
        {visual === "llm" && <AsciiCover />}
        {visual === "study-buddy" && <StudyBuddyTrace />}
        {visual === "podcapp" && (
          <Image src={asset("/projects/podcapp.png")} alt="PODCApp logo with two blue stars wearing headphones"
            width={200} height={200} unoptimized />
        )}
      </div>
    </div>
  );
}

export function CompilerPreview() {
  return (
    <svg className="compiler-preview" viewBox="0 0 500 238" role="img" aria-label="Syntax tree for 3 times the quantity x plus 2">
      <g stroke="#778c80" fill="none"><path d="M250 46v24H125v28m125-28h125v28m0 22v24h-53v29m53-29h53v29" /></g>
      <g fill="#233b31" stroke="#a4bbae">
        <rect x="224" y="17" width="52" height="34" /><rect x="99" y="97" width="52" height="34" /><rect x="349" y="97" width="52" height="34" />
        <rect x="296" y="172" width="52" height="34" /><rect x="402" y="172" width="52" height="34" />
      </g>
      <g className="diagram-type" fontSize="17" textAnchor="middle" fill="#e2f1e6">
        <text x="250" y="39">*</text><text x="125" y="119">3</text><text x="375" y="119">+</text>
        <text x="322" y="194">x</text><text x="428" y="194">2</text>
      </g>
    </svg>
  );
}

