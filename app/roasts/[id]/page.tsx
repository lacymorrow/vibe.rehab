import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site-config";
import { getRoastById, getAllRoasts } from "@/lib/mdx";
import { RoastDetail } from "@/components/roast-detail";

export async function generateStaticParams() {
  const roasts = getAllRoasts();
  return roasts.map((roast) => ({
    id: roast.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const roast = getRoastById(id);
  
  if (!roast) {
    return {
      title: "Roast Not Found",
    };
  }

  // Root layout template appends " | Vibe Rehab" (13 chars); cap at 46 so the
  // rendered <title> stays within ~60 chars for SERPs.
  const truncatedTitle = roast.title.length > 46 ? roast.title.slice(0, 43) + "..." : roast.title;
  return {
    title: truncatedTitle,
    description: roast.summary.length > 155 ? roast.summary.slice(0, 152) + "..." : roast.summary,
    openGraph: {
      title: roast.title,
      description: roast.summary,
      url: `${siteConfig.url}/roasts/${roast.id}`,
      siteName: siteConfig.name,
      images: [
        {
          url: `${siteConfig.url}/og?title=${encodeURIComponent(roast.title)}`,
          width: 1200,
          height: 628,
          alt: roast.title,
        },
      ],
      locale: "en_US",
      type: "article",
      publishedTime: roast.roastDate,
      authors: ["Vibe Rehab"],
      tags: roast.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: roast.title,
      description: roast.summary,
      images: [`${siteConfig.url}/og?title=${encodeURIComponent(roast.title)}`],
    },
    alternates: {
      canonical: `${siteConfig.url}/roasts/${roast.id}`,
    },
  };
}

export default async function RoastPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const roast = getRoastById(id);

  if (!roast) {
    notFound();
  }

  const moreRoasts = getAllRoasts().filter((r) => r.id !== id);

  return (
    <main className="min-h-screen bg-slate-50">
      <RoastDetail roast={roast} />
      {moreRoasts.length > 0 && (
        <aside className="border-t border-slate-200 bg-white">
          <div className="max-w-4xl mx-auto px-4 py-12">
            <h2 className="text-xl font-light text-slate-800 mb-6">more roasts</h2>
            <ul className="space-y-3">
              {moreRoasts.map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/roasts/${r.id}`}
                    className="text-amber-600 hover:text-amber-700 transition-colors underline decoration-dotted underline-offset-4"
                  >
                    {r.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      )}
    </main>
  );
}