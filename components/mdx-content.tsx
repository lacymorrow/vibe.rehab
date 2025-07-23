"use client";

import { useMemo, useState, useEffect } from "react";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import Image from "next/image";
// Client-side asset path helper
function getRoastAssetPath(roastId: string, assetName: string): string {
  return `/api/content/roasts/${roastId}/${assetName}`;
}

interface MDXContentProps {
  content: string;
  roastId?: string;
}

// Custom components for MDX
function createMDXComponents(roastId?: string) {
  return {
    h1: ({ children, ...props }: any) => (
      <h1 className="text-3xl font-bold mb-6 text-gray-900" {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }: any) => (
      <h2 className="text-2xl font-semibold mb-4 text-gray-900" {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }: any) => (
      <h3 className="text-xl font-semibold mb-3 text-gray-900" {...props}>
        {children}
      </h3>
    ),
    p: ({ children, ...props }: any) => (
      <p className="mb-4 text-gray-700 leading-relaxed" {...props}>
        {children}
      </p>
    ),
    ul: ({ children, ...props }: any) => (
      <ul
        className="list-disc list-inside mb-4 text-gray-700 space-y-2"
        {...props}
      >
        {children}
      </ul>
    ),
    ol: ({ children, ...props }: any) => (
      <ol
        className="list-decimal list-inside mb-4 text-gray-700 space-y-2"
        {...props}
      >
        {children}
      </ol>
    ),
    li: ({ children, ...props }: any) => (
      <li className="mb-1" {...props}>
        {children}
      </li>
    ),
    a: ({ children, href, ...props }: any) => (
      <a
        href={href}
        className="text-blue-600 hover:text-blue-800 underline"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    ),
    blockquote: ({ children, ...props }: any) => (
      <blockquote
        className="border-l-4 border-gray-300 pl-4 italic text-gray-600 mb-4"
        {...props}
      >
        {children}
      </blockquote>
    ),
    code: ({ children, ...props }: any) => (
      <code
        className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800"
        {...props}
      >
        {children}
      </code>
    ),
    pre: ({ children, ...props }: any) => (
      <pre
        className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4 text-sm font-mono"
        {...props}
      >
        {children}
      </pre>
    ),
    img: ({ src, alt, ...props }: any) => {
      // Handle relative image paths
      let imageSrc = src;
      if (roastId && !src.startsWith("http") && !src.startsWith("/")) {
        imageSrc = getRoastAssetPath(roastId, src);
      }

      return (
        <div className="my-6">
          <Image
            src={imageSrc}
            alt={alt || ""}
            width={800}
            height={600}
            className="rounded-lg shadow-lg max-w-full h-auto"
            {...props}
          />
        </div>
      );
    },
    // Custom component for highlighting issues
    Issue: ({ children, type = "error", ...props }: any) => {
      const bgColor =
        type === "error"
          ? "bg-red-50"
          : type === "warning"
            ? "bg-yellow-50"
            : "bg-blue-50";
      const borderColor =
        type === "error"
          ? "border-red-200"
          : type === "warning"
            ? "border-yellow-200"
            : "border-blue-200";
      const textColor =
        type === "error"
          ? "text-red-800"
          : type === "warning"
            ? "text-yellow-800"
            : "text-blue-800";

      return (
        <div
          className={`p-4 rounded-lg border ${bgColor} ${borderColor} ${textColor} mb-4`}
          {...props}
        >
          {children}
        </div>
      );
    },
    // Custom component for solutions
    Solution: ({ children, ...props }: any) => (
      <div
        className="p-4 rounded-lg border bg-green-50 border-green-200 text-green-800 mb-4"
        {...props}
      >
        <strong>💡 Solution:</strong> {children}
      </div>
    ),
    // Custom component for rating
    Rating: ({ score, children, ...props }: any) => {
      const color =
        score >= 8
          ? "text-green-600"
          : score >= 6
            ? "text-yellow-600"
            : "text-red-600";
      return (
        <div className={`font-semibold text-lg ${color} mb-2`} {...props}>
          Score: {score}/10 - {children}
        </div>
      );
    },
  };
}

export function MDXContent({ content, roastId }: MDXContentProps) {
  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const serializeContent = async () => {
      try {
        const serialized = await serialize(content, {
          mdxOptions: {
            remarkPlugins: [],
            rehypePlugins: [],
          },
        });
        setMdxSource(serialized);
        setError(null);
      } catch (err) {
        console.error("Error serializing MDX:", err);
        setError("Failed to render content");
      }
    };

    serializeContent();
  }, [content]);

  const components = useMemo(() => createMDXComponents(roastId), [roastId]);

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
        <p>Error loading content: {error}</p>
      </div>
    );
  }

  if (!mdxSource) {
    return (
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-gray-600">
        <p>Loading content...</p>
      </div>
    );
  }

  return (
    <div className="prose prose-gray max-w-none">
      <MDXRemote {...mdxSource} components={components} />
    </div>
  );
}
