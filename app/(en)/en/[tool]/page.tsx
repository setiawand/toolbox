import { notFound } from "next/navigation";
import ToolPage, { toolStaticParams } from "@/components/ToolPage";
import { toolMetadata } from "@/lib/metadata";
import { getTool } from "@/lib/tools";

export const dynamicParams = false;
export const generateStaticParams = toolStaticParams;

export async function generateMetadata({ params }: { params: Promise<{ tool: string }> }) {
  const tool = getTool((await params).tool);
  return tool?.ready ? toolMetadata(tool, "en") : {};
}

export default async function Page({ params }: { params: Promise<{ tool: string }> }) {
  const tool = getTool((await params).tool);
  if (!tool?.ready) notFound();
  return <ToolPage tool={tool} lang="en" />;
}
