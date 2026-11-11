import { PageIntro, TextLink } from "@/components/editorial";

export default function NotFound() {
  return (
    <div className="shell error-page">
      <PageIntro label="404" title="Page not found" description="This page may have moved. The index is a good place to start." />
      <TextLink href="/">Return to index</TextLink>
    </div>
  );
}

