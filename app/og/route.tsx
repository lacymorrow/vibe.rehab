import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site-config";
import { BASE_URL } from "@/lib/base-url";

async function loadAssets(): Promise<
  { name: string; data: Buffer; weight: 400 | 600; style: "normal" }[]
> {
  const [
    { base64Font: normal },
    { base64Font: mono },
    { base64Font: semibold },
  ] = await Promise.all([
    import("./geist-regular-otf.json").then((mod) => mod.default || mod),
    import("./geistmono-regular-otf.json").then((mod) => mod.default || mod),
    import("./geist-semibold-otf.json").then((mod) => mod.default || mod),
  ]);

  return [
    {
      name: "Geist",
      data: Buffer.from(normal, "base64"),
      weight: 400 as const,
      style: "normal" as const,
    },
    {
      name: "Geist Mono",
      data: Buffer.from(mono, "base64"),
      weight: 400 as const,
      style: "normal" as const,
    },
    {
      name: "Geist",
      data: Buffer.from(semibold, "base64"),
      weight: 600 as const,
      style: "normal" as const,
    },
  ];
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title") ?? siteConfig.title;
    const description =
      searchParams.get("description") ?? siteConfig.description;
    const url =
      searchParams.get("url") ?? siteConfig.url.replace(/https?:\/\//, "");

    const [fonts] = await Promise.all([loadAssets()]);

    return new ImageResponse(
      (
        <div
          tw="flex h-full w-full bg-black text-white"
          style={{ fontFamily: "Geist Sans" }}
        >
          {/* Grid lines */}
          <div tw="flex border absolute border-stone-700 border-dashed inset-y-0 left-16 w-[1px]" />
          <div tw="flex border absolute border-stone-700 border-dashed inset-y-0 right-16 w-[1px]" />
          <div tw="flex border absolute border-stone-700 inset-x-0 h-[1px] top-16" />
          <div tw="flex border absolute border-stone-700 inset-x-0 h-[1px] bottom-16" />

          {/* Logo placeholder - using inline styles instead of Tailwind */}
          <div tw="flex absolute bottom-18 right-18">
            <div
              tw="flex items-center justify-center w-[100px] h-[100px] rounded-2xl shadow-lg"
              style={{
                background: "linear-gradient(135deg, #2563eb 0%, #1e293b 100%)",
              }}
            >
              <div tw="flex items-center justify-center text-white text-2xl font-bold">
                VR
              </div>
            </div>
          </div>

          {/* URL */}
          <div
            tw="flex absolute bottom-24 left-24 text-stone-500 text-[32px]"
            style={{ fontWeight: 400 }}
          >
            {url}
          </div>

          {/* Main content area */}
          <div tw="flex flex-col absolute w-[896px] justify-center inset-32">
            {/* Title */}
            <div
              tw="flex-grow-1 flex flex-col justify-center"
              style={{
                textWrap: "balance",
                fontWeight: 600,
                fontSize:
                  title && title.length > 30
                    ? 56
                    : title && title.length > 20
                    ? 64
                    : 80,
                letterSpacing: "-0.04em",
                lineHeight: 1.1,
              }}
            >
              {title}
            </div>

            {/* Description */}
            <div
              tw="flex-grow-1 text-stone-400 mt-6"
              style={{
                fontWeight: 500,
                textWrap: "balance",
                fontSize: 40,
                lineHeight: 1.5,
              }}
            >
              {description}
            </div>

            {/* Accent elements */}
            <div tw="flex items-center mt-8">
              <div
                tw="rounded-full mr-4"
                style={{
                  width: 48,
                  height: 4,
                  backgroundColor: "#2563eb",
                }}
              />
              <div
                tw="text-blue-400 font-medium"
                style={{
                  fontSize: 24,
                }}
              >
                Professional Code Fixing
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 628,
        fonts,
      }
    );
  } catch (error) {
    console.error("Error generating OG image:", error);

    // Fallback simple image
    return new ImageResponse(
      (
        <div tw="flex h-full w-full bg-black text-white items-center justify-center">
          <div tw="flex flex-col items-center text-center">
            <div tw="text-6xl font-bold mb-4">{siteConfig.name}</div>
            <div tw="text-2xl text-stone-400">{siteConfig.description}</div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 628,
      }
    );
  }
}
