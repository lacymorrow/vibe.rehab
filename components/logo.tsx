"use client"

interface LogoProps {
  className?: string
}

export function Logo({ className = "" }: LogoProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transform-gpu transition-transform duration-500 hover:rotate-y-180"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Background circle with gradient */}
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="50%" stopColor="#1e40af" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Main circle background */}
        <circle
          cx="20"
          cy="20"
          r="18"
          fill="url(#logoGradient)"
          stroke="#1e40af"
          strokeWidth="0.5"
          filter="url(#glow)"
        />

        {/* Inner geometric pattern */}
        <g transform="translate(20, 20)">
          {/* Central diamond */}
          <path
            d="M-6,-6 L6,-6 L6,6 L-6,6 Z"
            fill="none"
            stroke="url(#textGradient)"
            strokeWidth="1.5"
            opacity="0.8"
            transform="rotate(45)"
          />

          {/* Intersecting lines creating a "V" pattern */}
          <path
            d="M-8,-4 L0,4 L8,-4"
            fill="none"
            stroke="url(#textGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Small accent dots */}
          <circle cx="-10" cy="-2" r="1" fill="url(#textGradient)" opacity="0.6" />
          <circle cx="10" cy="-2" r="1" fill="url(#textGradient)" opacity="0.6" />
          <circle cx="0" cy="8" r="1.5" fill="url(#textGradient)" />

          {/* Subtle grid pattern */}
          <g opacity="0.3">
            <line x1="-12" y1="0" x2="12" y2="0" stroke="url(#textGradient)" strokeWidth="0.5" />
            <line x1="0" y1="-12" x2="0" y2="12" stroke="url(#textGradient)" strokeWidth="0.5" />
          </g>
        </g>

        {/* Outer ring accent */}
        <circle cx="20" cy="20" r="19" fill="none" stroke="url(#logoGradient)" strokeWidth="0.5" opacity="0.5" />
      </svg>

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
        <div className="text-[10px] font-medium text-slate-400 tracking-wider uppercase -mt-1">Code Rehabilitation</div>
      </div>
    </div>
  )
}
