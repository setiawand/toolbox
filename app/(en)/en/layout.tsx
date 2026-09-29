import type { ReactNode } from "react";
import RootDocument from "@/components/RootDocument";

export default function Layout({ children }: { children: ReactNode }) {
  return <RootDocument lang="en">{children}</RootDocument>;
}
