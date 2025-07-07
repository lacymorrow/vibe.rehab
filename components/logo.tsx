"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo.png";

interface LogoProps {
  className?: string;
}

export function Logo({ className = "" }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center ${className}`}>
      <Image src={logo} alt="Vibe Rehab" width={32} height={32} />

      <div className="ml-3">
        <div className="flex items-baseline">
          <span className="text-xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent">
            vibe
          </span>
          <span className="text-lg font-light text-slate-600 mx-1">.</span>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-900 via-slate-900 to-blue-900 bg-clip-text text-transparent">
            rehab
          </span>
        </div>
        <div className="text-[10px] font-medium text-slate-400 tracking-wider uppercase -mt-1">
          Code Rehabilitation
        </div>
      </div>
    </Link>
  );
}
