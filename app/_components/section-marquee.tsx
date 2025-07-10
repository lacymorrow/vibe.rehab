"use client";
import { ThreeDMarquee } from "@/components/ui/3d-marquee";

export function ThreeDMarqueeDemo() {
  const images = [
    "https://www.lacymorrow.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fswell-program.6ff82c79.jpeg&w=3840&q=75",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=1000&auto=format&fit=crop",
    "https://www.lacymorrow.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fimg-space-monkey.c927fe82.png&w=3840&q=75",
    "https://images.unsplash.com/photo-1619410283995-43d9134e7656?q=80&w=1000&auto=format&fit=crop",

    "https://www.lacymorrow.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fswell-datatable.6b9c74ea.jpeg&w=3840&q=75",
    "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?q=80&w=1000&auto=format&fit=crop",
    "https://www.lacymorrow.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fscreenshot.e1b8fed4.png&w=3840&q=75",
    "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=1000&auto=format&fit=crop",
    "https://www.lacymorrow.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fswell-user.b994f9a1.jpeg&w=3840&q=75",
    "https://www.lacymorrow.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fswell-program.6ff82c79.jpeg&w=3840&q=75",
    "https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=1000&auto=format&fit=crop",
    "https://www.lacymorrow.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fimg-charliesvision.e41282e4.jpg&w=3840&q=75",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1611224923853-80b023f02d71?q=80&w=1000&auto=format&fit=crop",
    "https://www.lacymorrow.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fimg-susan-morrow.82eae2d0.png&w=3840&q=75",
    "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1618477371303-b2a56f422d9e?q=80&w=1000&auto=format&fit=crop",
    "https://www.lacymorrow.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fscreenshot.e1b8fed4.png&w=3840&q=75",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1555774698-0b77e5d5fac6?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=1000&auto=format&fit=crop",
    "https://www.lacymorrow.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fhackpack.205e38dd.png&w=3840&q=75",
    "https://images.unsplash.com/photo-1611224923853-80b023f02d71?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1619410283995-43d9134e7656?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1000&auto=format&fit=crop",
  ];
  return (
    <div className="mx-auto my-10 w-full rounded-3xl bg-gray-950/5 p-2 ring-1 ring-neutral-700/10 dark:bg-neutral-800">
      <ThreeDMarquee images={images} />
    </div>
  );
}
