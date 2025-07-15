"use client";

import { ExternalLink, Calendar } from "lucide-react";
import Link from "next/link";

export interface Roast {
  id: string;
  title: string;
  url: string;
  roastDate: string;
  summary: string;
  issues: string[];
  tags: string[];
  content?: string;
}

export function RoastCard({ roast }: { roast: Roast }) {
  return (
    <article className="group">
      <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 h-full">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-slate-800 leading-snug">
              {roast.title}
            </h3>
            <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
              <Calendar className="h-3 w-3" />
              <span>{new Date(roast.roastDate).toLocaleDateString()}</span>
              <span>•</span>
              <Link 
                href={roast.url} 
                target="_blank"
                className="hover:text-amber-600 transition-colors flex items-center gap-1"
              >
                <ExternalLink className="h-3 w-3" />
                visit
              </Link>
            </div>
          </div>
          
          <p className="text-slate-600 text-sm leading-relaxed italic">
            "{roast.summary}"
          </p>
          
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-700 uppercase tracking-wide">
              main issues
            </p>
            <ul className="text-sm space-y-1">
              {roast.issues.slice(0, 3).map((issue, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-600">
                  <span className="text-amber-500 mt-1 text-xs">•</span>
                  <span className="leading-relaxed">{issue}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div className="flex gap-2 flex-wrap">
              {roast.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
            <Link 
              href={`/roasts/${roast.id}`}
              className="text-sm text-amber-600 hover:text-amber-700 transition-colors underline decoration-dotted underline-offset-2"
            >
              read more
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}