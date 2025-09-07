"use client";
import { ThreeDMarquee } from "@/components/ui/3d-marquee";

export function ThreeDMarqueeDemo() {
  const images = [
    "/marquee/swell-program.jpeg",
    "/marquee/hitchhikers-galaxy.png",
    "/marquee/unsplash-tech-1.jpeg",
    "/marquee/uibrary-logo.png",
    "/marquee/space-monkey.png",
    "/marquee/unsplash-tech-2.jpeg",
    "/marquee/hitchhikers-galaxy.png",
    "/marquee/screenshot.png",
    "/marquee/unsplash-tech-3.jpeg",
    "/marquee/shipkit-logo.png",
    "/marquee/swell-program.jpeg",
    "/marquee/uibrary-logo.png",
    "/marquee/charlies-vision.jpg",
    "/marquee/unsplash-tech-1.jpeg",
    "/marquee/hitchhikers-galaxy.png",
    "/marquee/susan-morrow.png",
    "/marquee/unsplash-tech-4.jpeg",
    "/marquee/unsplash-tech-5.jpeg",
    "/marquee/screenshot.png",
    "/marquee/shipkit-logo.png",
    "/marquee/hitchhikers-galaxy.png",
    "/marquee/uibrary-logo.png",
    "/marquee/hitchhikers-galaxy.png",
    "/marquee/hackpack.png",
    "/marquee/hitchhikers-galaxy.png",
    "/marquee/unsplash-tech-2.jpeg",
    "/marquee/unsplash-tech-4.jpeg",
  ];
  return (
    <div className="mx-auto my-10 w-full rounded-3xl bg-gray-950/5 p-2 ring-1 ring-neutral-700/10 dark:bg-neutral-800">
      <ThreeDMarquee images={images} />
    </div>
  );
}
