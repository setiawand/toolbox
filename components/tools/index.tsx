import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { Lang } from "@/lib/site";

/**
 * Slug -> tool component. Loaded lazily so a tool's code (and any WASM/model it
 * pulls in) only ships on its own page, keeping the home page light.
 */
export const toolComponents: Record<string, ComponentType<{ lang: Lang }>> = {
  "compress-image": dynamic(() => import("./CompressImage")),
};
