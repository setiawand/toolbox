import type { ReactNode } from "react";
import PageShell from "./PageShell";
import ToolCard from "./ToolCard";
import { t } from "@/lib/i18n";
import { SITE_NAME, SITE_URL, pathFor, type Lang } from "@/lib/site";
import { readyTools, type Tool } from "@/lib/tools";

/** Shared shell for every tool page: H1, description, tool slot, how-to, FAQ, related tools. */
export default function ToolLayout({ tool, lang, children }: { tool: Tool; lang: Lang; children: ReactNode }) {
  const d = t(lang);
  const howTo = tool.howTo?.[lang] ?? [];
  const faq = tool.faq?.[lang] ?? [];
  const others = readyTools.filter((x) => x.slug !== tool.slug);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: tool.name[lang],
      description: tool.description[lang],
      url: SITE_URL + pathFor(lang, tool.slug),
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Any",
      inLanguage: lang,
      offers: { "@type": "Offer", price: "0", priceCurrency: "IDR" },
      isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
    },
    ...(faq.length
      ? [
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
          },
        ]
      : []),
  ];

  return (
    <PageShell lang={lang} slug={tool.slug}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{tool.title[lang]}</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">{tool.description[lang]}</p>
      <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
        {tool.clientSide && (
          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            🔒 {d.privacyBadge}
          </span>
        )}
        <span>{d.limits(tool.maxMb)}</span>
      </p>

      <div className="mt-6">{children}</div>

      {howTo.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold">{d.howTo}</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-slate-700 dark:text-slate-300">
            {howTo.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </section>
      )}

      {faq.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold">{d.faq}</h2>
          <div className="mt-3 space-y-2">
            {faq.map((f) => (
              <details key={f.q} className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <summary className="cursor-pointer font-semibold">{f.q}</summary>
                <p className="mt-2 text-slate-700 dark:text-slate-300">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {others.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold">{d.otherTools}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {others.map((o) => (
              <ToolCard key={o.slug} tool={o} lang={lang} />
            ))}
          </div>
        </section>
      )}
    </PageShell>
  );
}
