import ToolLayout from "./ToolLayout";
import { toolComponents } from "./tools";
import { readyTools, type Tool } from "@/lib/tools";
import type { Lang } from "@/lib/site";

export const toolStaticParams = () => readyTools.map((t) => ({ tool: t.slug }));

export default function ToolPage({ tool, lang }: { tool: Tool; lang: Lang }) {
  const ToolComponent = toolComponents[tool.slug];
  return (
    <ToolLayout tool={tool} lang={lang}>
      <ToolComponent lang={lang} />
    </ToolLayout>
  );
}
