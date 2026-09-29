import type { ReactNode } from "react";
import "@/app/globals.css";
import type { Lang } from "@/lib/site";

const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
const UMAMI_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
const UMAMI_SRC = process.env.NEXT_PUBLIC_UMAMI_SRC ?? "https://cloud.umami.is/script.js";

/** <html>/<body> for one language, plus the optional privacy-friendly analytics script (set via env). */
export default function RootDocument({ lang, children }: { lang: Lang; children: ReactNode }) {
  return (
    <html lang={lang}>
      <head>
        {PLAUSIBLE_DOMAIN && <script defer data-domain={PLAUSIBLE_DOMAIN} src="https://plausible.io/js/script.js" />}
        {UMAMI_ID && <script defer data-website-id={UMAMI_ID} src={UMAMI_SRC} />}
      </head>
      <body className="flex min-h-screen flex-col [&>main]:flex-1">{children}</body>
    </html>
  );
}
