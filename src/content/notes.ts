export const notes = [
  {
    slug: "where-rounding-enters",
    title: "Where rounding enters the proof",
    category: "Numerical computing",
    summary: "What a small cancellation example reveals about the assumptions in a numerical error bound.",
    sections: [
      { title: "Follow each rounded step", body: "In binary64 arithmetic, 1 + 2⁻⁵³ lies halfway between 1 and the next larger representable number. With round-to-nearest, ties-to-even, the sum rounds to 1. Subtracting 1 from that stored result yields zero, while the real-number expression gives 2⁻⁵³. The final subtraction is exact here. The earlier rounding changed the input to it." },
      { title: "State the quantity being bounded", body: "An absolute error compares the two answers directly. A relative error compares that difference with the size of the exact answer, so it needs particular care when that answer is small or zero. A tiny absolute error can still be the entire exact answer, as it is in this example." },
      { title: "Make the assumptions explicit", body: "A useful proof identifies where rounding occurs, states the rounding mode, and specifies the ranges the argument covers. This is where a tool such as Gappa enters the workflow. A proof about real-number operations alone would miss the change that happened at the addition." },
    ],
  },
  {
    slug: "expression-to-tree",
    title: "What a parser does with precedence",
    category: "Programming languages",
    summary: "How a recursive-descent grammar gives a flat sequence of tokens a shape.",
    sections: [
      { title: "Start with the tokens", body: "In 3 * (x + 2), the lexer identifies the number, operators, delimiters, and identifier. At this stage the result is an ordered sequence. The token offsets are useful later because the parser can point to a specific character when a rule fails." },
      { title: "Let the grammar express precedence", body: "An additive rule consumes multiplicative expressions. A multiplicative rule consumes unary expressions. Because the tighter rules finish before the looser ones attach their operators, 3 * x + 2 becomes an addition with a multiplication on the left. Parentheses start a fresh expression and make the enclosed sum a single operand." },
      { title: "Give the tree to the evaluator", body: "The evaluator follows the tree bottom-up. It can look up x and compute its sum with 2 before performing the multiplication. The same tree can drive a visualization or a source highlight because the parser preserves each node’s source span." },
    ],
  },
] as const;

