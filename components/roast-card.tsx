"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Flame, Calendar } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";

export interface Roast {
  id: string;
  title: string;
  url: string;
  roastDate: string;
  severity: "mild" | "medium" | "spicy" | "nuclear";
  summary: string;
  issues: string[];
  screenshot?: string;
  tags: string[];
}

const severityConfig = {
  mild: { 
    label: "Mild", 
    color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    flames: 1 
  },
  medium: { 
    label: "Medium", 
    color: "bg-orange-100 text-orange-800 hover:bg-orange-200",
    flames: 2 
  },
  spicy: { 
    label: "Spicy", 
    color: "bg-red-100 text-red-800 hover:bg-red-200",
    flames: 3 
  },
  nuclear: { 
    label: "Nuclear", 
    color: "bg-red-600 text-white hover:bg-red-700",
    flames: 4 
  },
};

export function RoastCard({ roast }: { roast: Roast }) {
  const severity = severityConfig[roast.severity];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
        {roast.screenshot && (
          <div className="relative h-48 overflow-hidden bg-muted">
            <img 
              src={roast.screenshot} 
              alt={`Screenshot of ${roast.title}`}
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <Badge 
              className={`absolute top-4 right-4 ${severity.color}`}
            >
              <span className="flex items-center gap-1">
                {Array.from({ length: severity.flames }).map((_, i) => (
                  <Flame key={i} className="h-3 w-3" />
                ))}
                {severity.label}
              </span>
            </Badge>
          </div>
        )}
        
        <CardHeader>
          <div className="space-y-2">
            <h3 className="text-xl font-bold line-clamp-2">{roast.title}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {new Date(roast.roastDate).toLocaleDateString()}
              <span>•</span>
              <Link 
                href={roast.url} 
                target="_blank"
                className="hover:text-primary flex items-center gap-1"
              >
                <ExternalLink className="h-3 w-3" />
                Visit Site
              </Link>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1">
          <p className="text-muted-foreground mb-4">{roast.summary}</p>
          
          <div className="space-y-2">
            <p className="text-sm font-semibold">Main Issues:</p>
            <ul className="text-sm space-y-1">
              {roast.issues.slice(0, 3).map((issue, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-destructive mt-0.5">•</span>
                  <span className="line-clamp-2">{issue}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
        
        <CardFooter className="pt-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex gap-2 flex-wrap">
              {roast.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            <Button size="sm" variant="outline" asChild>
              <Link href={`/roasts/${roast.id}`}>
                Read Full Roast
              </Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}