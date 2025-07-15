import { Metadata } from "next";
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
      title: "Roast Not Found | Vibe Rehab",
    };
  }

  return {
    title: `${roast.title} | Vibe Rehab`,
    description: roast.summary,
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

  return (
    <main className="min-h-screen bg-slate-50">
      <RoastDetail roast={roast} />
    </main>
  );
}