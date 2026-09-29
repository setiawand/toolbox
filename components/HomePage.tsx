import PageShell from "./PageShell";
import ToolCard from "./ToolCard";
import { t } from "@/lib/i18n";
import { SITE_NAME, SITE_URL, type Lang } from "@/lib/site";
import { tools } from "@/lib/tools";

export default function HomePage({ lang }: { lang: Lang }) {
  const d = t(lang);
  const jsonLd = { "@context": "https://schema.org", "@type": "WebSite", name: SITE_NAME, url: SITE_URL, inLanguage: lang };
  return (
    <PageShell lang={lang}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{d.heroTitle}</h1>
      <p className="mt-3 max-w-2xl text-lg text-slate-600 dark:text-slate-400">{d.heroText}</p>
      <p className="mt-4">
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
          🔒 {d.privacyBadge}
        </span>
      </p>
      <h2 className="mt-10 text-xl font-bold">{d.toolsHeading}</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} lang={lang} />
        ))}
      </div>
    </PageShell>
  );
}
