export type Span = { start: number; end: number };
type Operator = "+" | "-" | "*" | "/";
type TokenKind = "number" | "identifier" | "operator" | "parenthesis" | "end";
export type Token = Span & { kind: TokenKind; text: string };

export type Node =
  | (Span & { kind: "number"; text: string; value: number })
  | (Span & { kind: "identifier"; name: string })
  | (Span & { kind: "unary"; operator: "+" | "-"; operand: Node })
  | (Span & { kind: "binary"; operator: Operator; left: Node; right: Node });

type Stage = "Lexing" | "Parsing" | "Evaluation";

export class ExpressionError extends Error {
  readonly span: Span;
  readonly stage: Stage;

  constructor(message: string, span: Span, stage: Stage) {
    super(message);
    this.name = "ExpressionError";
    this.span = span;
    this.stage = stage;
  }
}

export const expressionLimit = 240;
const numberPattern = /(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?/y;
const identifierPattern = /[a-zA-Z_][a-zA-Z_0-9]*/y;
const whitespace = /\s+/y;
const bindingPattern = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/;

export function tokenize(source: string): Token[] {
  if (source.length > expressionLimit) {
    throw new ExpressionError("Use at most " + expressionLimit + " characters.", { start: expressionLimit, end: source.length }, "Lexing");
  }

  const tokens: Token[] = [];
  let start = 0;
  while (start < source.length) {
    whitespace.lastIndex = start;
    if (whitespace.test(source)) {
      start = whitespace.lastIndex;
      continue;
    }

    numberPattern.lastIndex = start;
    identifierPattern.lastIndex = start;
    const number = numberPattern.exec(source);
    const identifier = identifierPattern.exec(source);
    const character = source[start];
    const text = number?.[0] ?? identifier?.[0] ?? character;
    const end = start + text.length;
    let kind: TokenKind;

    if (number) {
      if (!Number.isFinite(Number(text))) {
        throw new ExpressionError("Number is outside the supported finite range.", { start, end }, "Lexing");
      }
      kind = "number";
    } else if (identifier) {
      kind = "identifier";
    } else if ("+-*/".includes(character)) {
      kind = "operator";
    } else if ("()".includes(character)) {
      kind = "parenthesis";
    } else {
      throw new ExpressionError("Unexpected character “" + character + "”.", { start, end }, "Lexing");
    }

    tokens.push({ kind, text, start, end });
    start = end;
  }
  tokens.push({ kind: "end", text: "", start, end: start });
  return tokens;
}

// expression → term (("+" | "-") term)*
// term       → unary (("*" | "/") unary)*
// unary      → ("+" | "-") unary | primary
// primary    → number | identifier | "(" expression ")"
export function parse(tokens: readonly Token[]): Node {
  let index = 0;
  const end = tokens.at(-1)?.end ?? 0;
  const peek = () => tokens[index] ?? { kind: "end", text: "", start: end, end } as const;
  const take = () => { const token = peek(); index += 1; return token; };

  function expression(): Node {
    let left = term();
    while (peek().text === "+" || peek().text === "-") {
      const operator = take().text as "+" | "-";
      const right = term();
      left = { kind: "binary", operator, left, right, start: left.start, end: right.end };
    }
    return left;
  }

  function term(): Node {
    let left = unary();
    while (peek().text === "*" || peek().text === "/") {
      const operator = take().text as "*" | "/";
      const right = unary();
      left = { kind: "binary", operator, left, right, start: left.start, end: right.end };
    }
    return left;
  }

  function unary(): Node {
    const token = peek();
    if (token.text === "+" || token.text === "-") {
      take();
      const operand = unary();
      return { kind: "unary", operator: token.text, operand, start: token.start, end: operand.end };
    }
    return primary();
  }

  function primary(): Node {
    const token = take();
    if (token.kind === "number") {
      return { kind: "number", text: token.text, value: Number(token.text), start: token.start, end: token.end };
    }
    if (token.kind === "identifier") {
      return { kind: "identifier", name: token.text, start: token.start, end: token.end };
    }
    if (token.text === "(") {
      const inner = expression();
      const close = take();
      if (close.text !== ")") throw new ExpressionError("Expected a closing parenthesis “)”.", close, "Parsing");
      return { ...inner, start: token.start, end: close.end };
    }
    throw new ExpressionError("Expected a number, an identifier, or “(”.", token, "Parsing");
  }

  const tree = expression();
  const trailing = peek();
  if (trailing.kind !== "end") {
    throw new ExpressionError("Unexpected token “" + trailing.text + "”. An operator may be missing.", trailing, "Parsing");
  }
  return tree;
}

export function evaluate(node: Node, values: ReadonlyMap<string, string> = new Map()): number {
  let result: number;

  switch (node.kind) {
    case "number":
      return node.value;
    case "identifier": {
      const value = values.get(node.name)?.trim();
      if (!value) throw new ExpressionError("Enter a value for " + node.name + ".", node, "Evaluation");
      if (!bindingPattern.test(value) || !Number.isFinite(Number(value))) {
        throw new ExpressionError("Enter a finite decimal number for " + node.name + ".", node, "Evaluation");
      }
      return Number(value);
    }
    case "unary": {
      const operand = evaluate(node.operand, values);
      return node.operator === "-" ? -operand : operand;
    }
    case "binary": {
      const left = evaluate(node.left, values);
      const right = evaluate(node.right, values);
      switch (node.operator) {
        case "+": result = left + right; break;
        case "-": result = left - right; break;
        case "*": result = left * right; break;
        case "/":
          if (right === 0) throw new ExpressionError("Cannot divide by zero.", node.right, "Evaluation");
          result = left / right;
          break;
      }
    }
  }

  if (!Number.isFinite(result)) throw new ExpressionError("Result is outside the supported finite range.", node, "Evaluation");
  return result;
}

type Analysis = { tokens: Token[]; tree: Node | null; error: ExpressionError | null };

export function analyze(source: string): Analysis {
  let tokens: Token[] = [];
  try {
    tokens = tokenize(source);
    return { tokens: tokens.slice(0, -1), tree: parse(tokens), error: null };
  } catch (error) {
    if (!(error instanceof ExpressionError)) throw error;
    return { tokens: tokens.slice(0, -1), tree: null, error };
  }
}

export function variables(tokens: readonly Token[]) {
  return Array.from(new Set(tokens.filter((token) => token.kind === "identifier").map((token) => token.text)));
}

