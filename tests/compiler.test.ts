import assert from "node:assert/strict";
import { test } from "node:test";
import { analyze, evaluate, ExpressionError, expressionLimit, parse, tokenize, variables } from "../src/lib/compiler.ts";

const tree = (source: string) => parse(tokenize(source));
const value = (source: string) => evaluate(tree(source));

test("tokenizes numbers, identifiers, operators, parentheses and whitespace with exact positions", () => {
  assert.deepEqual(tokenize(" 3 * (x_2 + .5e1)"), [
    { kind: "number", text: "3", start: 1, end: 2 },
    { kind: "operator", text: "*", start: 3, end: 4 },
    { kind: "parenthesis", text: "(", start: 5, end: 6 },
    { kind: "identifier", text: "x_2", start: 6, end: 9 },
    { kind: "operator", text: "+", start: 10, end: 11 },
    { kind: "number", text: ".5e1", start: 12, end: 16 },
    { kind: "parenthesis", text: ")", start: 16, end: 17 },
    { kind: "end", text: "", start: 17, end: 17 },
  ]);
});

test("builds a tree with binary operators, operands and spans for parenthesized subexpressions", () => {
  assert.deepEqual(tree("3 * (x + 2)"), {
    kind: "binary", operator: "*", start: 0, end: 11,
    left: { kind: "number", text: "3", value: 3, start: 0, end: 1 },
    right: {
      kind: "binary", operator: "+", start: 4, end: 11,
      left: { kind: "identifier", name: "x", start: 5, end: 6 },
      right: { kind: "number", text: "2", value: 2, start: 9, end: 10 },
    },
  });
});

test("enforces precedence, left associativity, parentheses and recursive unary operators", () => {
  assert.equal(value("2 + 3 * 4"), 14);
  assert.equal(value("(2 + 3) * 4"), 20);
  assert.equal(value("24 / 4 / 2"), 3);
  assert.equal(value("8 - 3 - 2"), 3);
  assert.equal(value("2 * -+-3"), 6);
  assert.equal(value("-(4 + 2) / 3"), -2);
});

test("evaluates decimal and scientific literals and explicit variable bindings", () => {
  assert.equal(value("2e-3 + 0.125"), 0.127);
  assert.equal(value("1. + .5"), 1.5);
  assert.equal(evaluate(tree("3 * (x + 2)"), new Map([["x", " 4 "]])), 18);
  assert.equal(evaluate(tree("a + b + a"), new Map([["a", "-.5"], ["b", "+4e0"]])), 3);
  assert.deepEqual(variables(tokenize("x + y + x + _z")), ["x", "y", "_z"]);
});

test("reports invalid characters and unsupported number range at the offending span", () => {
  const invalid = analyze("3 @ 2").error;
  assert.equal(invalid?.stage, "Lexing");
  assert.deepEqual(invalid?.span, { start: 2, end: 3 });
  assert.match(invalid?.message ?? "", /Unexpected character/);
  assert.throws(() => tokenize("1e309"), /finite range/);
  assert.throws(() => tokenize("1".repeat(expressionLimit + 1)), /at most/);
});

test("retains tokens on parser errors and reports their positions", () => {
  const missingClose = analyze("(2 + 3");
  assert.equal(missingClose.tokens.length, 4);
  assert.equal(missingClose.tree, null);
  assert.equal(missingClose.error?.stage, "Parsing");
  assert.equal(missingClose.error?.span.start, 6);
  assert.match(missingClose.error?.message ?? "", /closing parenthesis/);
  assert.throws(() => tree(""), /Expected a number/);
  assert.throws(() => tree("2 + * 3"), /Expected a number/);
  assert.throws(() => tree("2(x)"), /Unexpected token/);
  assert.throws(() => tree("1e"), /Unexpected token/);
});

test("reports missing and invalid bindings, division by zero, and numeric overflow", () => {
  assert.throws(() => value("x + 2"), /Enter a value for x/);
  assert.throws(() => value("constructor"), /Enter a value for constructor/);
  assert.throws(() => evaluate(tree("x"), new Map([["x", "0x10"]])), /finite decimal/);
  assert.throws(() => evaluate(tree("x"), new Map([["x", "Infinity"]])), /finite decimal/);
  assert.throws(() => value("1e308 * 2"), /finite range/);
  assert.throws(() => value("1 / (2 - 2)"), (error) => {
    assert.ok(error instanceof ExpressionError);
    assert.equal(error.stage, "Evaluation");
    assert.equal(error.span.start, 4);
    assert.equal(error.span.end, 11);
    assert.match(error.message, /divide by zero/);
    return true;
  });
});

