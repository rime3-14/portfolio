"use client";

import { useMemo, useState } from "react";
import { analyze, evaluate, ExpressionError, expressionLimit, variables } from "@/lib/compiler";
import { SyntaxTree } from "./syntax-tree";

const examples = ["3 * (x + 2)", "-(4 + 2) / 3", "x / (y - 2)", "2 + 3 * 4"];

function ErrorMessage({ error, source, id }: { error: ExpressionError; source: string; id?: string }) {
  const { start, end } = error.span;
  return (
    <div className="compiler-error" id={id} role="status">
      <p><strong>{error.stage} · character {start + 1}</strong> {error.message}</p>
      <code aria-label="Error location">{source.slice(0, start)}<mark>{source.slice(start, end) || "⌃"}</mark>{source.slice(end)}</code>
    </div>
  );
}

export function Compiler() {
  const [source, setSource] = useState(examples[0]);
  const [bindings, setBindings] = useState(() => new Map([["x", "4"], ["y", "2"]]));
  const [selected, setSelected] = useState("root");
  const analysis = useMemo(() => analyze(source), [source]);
  const names = variables(analysis.tokens);
  const empty = source.trim() === "";
  let value: number | undefined;
  let evaluationError: ExpressionError | undefined;

  if (analysis.tree) {
    try {
      value = evaluate(analysis.tree, bindings);
    } catch (error) {
      if (!(error instanceof ExpressionError)) throw error;
      evaluationError = error;
    }
  }

  function updateSource(text: string) {
    setSource(text);
    setSelected("root");
  }

  return (
    <div className="compiler">
      <section className="compiler-input" aria-labelledby="source-label">
        <label className="mono" id="source-label" htmlFor="expression">Source expression</label>
        <input id="expression" value={source} onChange={(event) => updateSource(event.target.value)}
          maxLength={expressionLimit} spellCheck={false} autoComplete="off" autoCapitalize="off"
          aria-invalid={!empty && !!analysis.error}
          aria-describedby={!empty && analysis.error ? "source-error" : "expression-hint"} />
        <p className="mono input-hint" id="expression-hint">Numbers, identifiers, + - * / and parentheses</p>
        <div className="example-controls">
          <span className="mono">Examples</span>
          {examples.map((example) => (
            <button key={example} type="button" aria-pressed={source === example} onClick={() => updateSource(example)}>
              {example}
            </button>
          ))}
        </div>
        {!empty && analysis.error && <ErrorMessage id="source-error" error={analysis.error} source={source} />}
      </section>

      <section className="compiler-stage" aria-labelledby="lex-title">
        <header>
          <p className="mono">01 / Lexing</p>
          <h2 id="lex-title">Tokens</h2>
          <p>The lexer groups characters into numbers, names, operators, and parentheses.</p>
        </header>
        <div className="stage-content">
          {analysis.tokens.length > 0 ? (
            <ol className="tokens" aria-label="Tokens in source order">
              {analysis.tokens.map((token) => (
                <li key={token.start} title={"Character " + (token.start + 1)}>
                  <code>{token.text}</code><span className="mono">{token.kind}</span>
                </li>
              ))}
            </ol>
          ) : <p className="stage-empty">{empty ? "Enter an expression to see its tokens." : "Fix the character error to see tokens."}</p>}
        </div>
      </section>

      <section className="compiler-stage" aria-labelledby="parse-title">
        <header>
          <p className="mono">02 / Parsing</p>
          <h2 id="parse-title">Syntax tree</h2>
          <p>The parser uses precedence and parentheses to connect operators with their operands. Select a node to inspect its source.</p>
        </header>
        <div className="stage-content tree-content">
          {analysis.tree ? <SyntaxTree root={analysis.tree} source={source} selectedId={selected} onSelect={setSelected} />
            : <p className="stage-empty">A valid expression produces a tree here.</p>}
        </div>
      </section>

      <section className="compiler-stage" aria-labelledby="evaluate-title">
        <header>
          <p className="mono">03 / Evaluation</p>
          <h2 id="evaluate-title">Result</h2>
          <p>The evaluator computes operands before their operator and looks up identifiers in the values below.</p>
        </header>
        <div className="stage-content evaluation">
          {analysis.tree && names.length > 0 && (
            <div className="variable-inputs">
              {names.map((name) => (
                <label key={name}>
                  <span className="mono">{name}</span>
                  <input type="text" aria-label={"Value for " + name} value={bindings.get(name) ?? ""} maxLength={80}
                    onChange={(event) => {
                      const value = event.target.value;
                      setBindings((previous) => new Map(previous).set(name, value));
                    }} />
                </label>
              ))}
            </div>
          )}
          {evaluationError ? <ErrorMessage error={evaluationError} source={source} /> : (
            <output aria-live="polite">
              {value === undefined ? <span className="stage-empty">A valid expression produces a result here.</span>
                : <><span className="mono">Value</span><strong>{Object.is(value, -0) ? "−0" : value.toString()}</strong></>}
            </output>
          )}
        </div>
      </section>
    </div>
  );
}

