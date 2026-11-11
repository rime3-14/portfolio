import { Compiler } from "@/components/compiler";
import { PageIntro, TextLink } from "@/components/editorial";
import { experiments } from "@/content/lab";
import { pageMetadata } from "@/lib/metadata";

const experiment = experiments[0];

export const metadata = pageMetadata(experiment.title, experiment.description, experiment.href);

export default function CompilerPage() {
  return (
    <div className="shell compiler-page">
      <div className="article-back"><TextLink href="/lab/">Lab index</TextLink></div>
      <PageIntro label={"Experiment " + experiment.number + " / " + experiment.category} title={experiment.title}
        description={experiment.description} />
      <Compiler />
      <details className="grammar">
        <summary>Expression grammar</summary>
        <pre>{`expression → term (("+" | "-") term)*
term       → unary (("*" | "/") unary)*
unary      → ("+" | "-") unary | primary
primary    → number | identifier | "(" expression ")"`}</pre>
        <p>Numbers support decimals and scientific notation. Identifiers start with a letter or underscore and may include digits. Results use binary64 floating-point arithmetic.</p>
      </details>
      <div className="article-next"><span className="mono">Further reading</span><TextLink href="/notes/expression-to-tree/">What a parser does with precedence</TextLink></div>
    </div>
  );
}

