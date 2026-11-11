"use client";

import type { Node } from "@/lib/compiler";

type Positioned = { node: Node; x: number; y: number; id: string; parent: string | null };

function describe(node: Node) {
  switch (node.kind) {
    case "number": return { label: node.text, kind: "Number" };
    case "identifier": return { label: node.name, kind: "Identifier" };
    case "unary": return { label: node.operator, kind: "Unary operator" };
    case "binary": return { label: node.operator, kind: "Binary operator" };
  }
}

function position(root: Node) {
  let leaf = 0;
  let lastDepth = 0;
  const nodes: Positioned[] = [];
  const column = 82;
  const row = 82;

  function visit(node: Node, depth: number, id: string, parent: string | null) {
    lastDepth = Math.max(lastDepth, depth);
    const current = { node, x: 0, y: 37 + depth * row, id, parent };
    nodes.push(current);

    if (node.kind === "binary") {
      const left = visit(node.left, depth + 1, id + "L", id);
      const right = visit(node.right, depth + 1, id + "R", id);
      current.x = (left.x + right.x) / 2;
    } else if (node.kind === "unary") {
      current.x = visit(node.operand, depth + 1, id + "U", id).x;
    } else {
      current.x = 48 + leaf * column;
      leaf += 1;
    }
    return current;
  }

  visit(root, 0, "root", null);
  const naturalWidth = 96 + (leaf - 1) * column;
  const width = Math.max(244, naturalWidth);
  const margin = (width - naturalWidth) / 2;
  nodes.forEach((node) => { node.x += margin; });
  return { nodes, width, height: 82 + lastDepth * row };
}

export function SyntaxTree({ root, source, selectedId, onSelect }: {
  root: Node;
  source: string;
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const { nodes, width, height } = position(root);
  const index = new Map(nodes.map((node) => [node.id, node]));
  const selected = index.get(selectedId) ?? nodes[0];
  const selectedInfo = describe(selected.node);

  return (
    <>
      <div className="tree-scroll" tabIndex={0} role="region" aria-label="Scrollable syntax tree">
        <div className="tree-canvas" style={{ width, height }}>
          <svg viewBox={"0 0 " + width + " " + height} aria-hidden="true">
            {nodes.map((point) => {
              const parent = point.parent ? index.get(point.parent) : undefined;
              if (!parent) return null;
              const middle = (point.y + parent.y) / 2;
              return <path key={point.id} d={`M${parent.x} ${parent.y}V${middle}H${point.x}V${point.y}`}
                className={selected.id === point.id || selected.id === parent.id ? "selected-edge" : undefined} />;
            })}
          </svg>
          {nodes.map(({ node, id, x, y }) => {
            const info = describe(node);
            return (
              <button key={id} type="button" className="tree-node" style={{ left: x, top: y }}
                aria-label={info.kind + " " + info.label + ", character " + (node.start + 1)}
                aria-pressed={id === selected.id} onClick={() => onSelect(id)}>
                <span>{info.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="node-details" aria-live="polite">
        <span className="mono">{selectedInfo.kind} · {selected.node.end - selected.node.start === 1
          ? "character " + (selected.node.start + 1)
          : "characters " + (selected.node.start + 1) + "–" + selected.node.end}</span>
        <code>{source.slice(selected.node.start, selected.node.end)}</code>
      </div>
    </>
  );
}

