"use client";

import { useMemo } from "react";
import { getMDXComponent } from "mdx-bundler/client";

interface MDXContentProps {
  content: string;
}

// Simple MDX renderer for now - in production you'd use mdx-bundler or similar
export function MDXContent({ content }: MDXContentProps) {
  // For now, we'll just render the markdown as HTML
  // In a full implementation, you'd process the MDX properly
  const processedContent = useMemo(() => {
    // Remove frontmatter
    const contentWithoutFrontmatter = content.replace(/^---[\s\S]*?---\n/, '');
    
    // Basic markdown to HTML conversion
    let html = contentWithoutFrontmatter
      // Headers
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      // Bold
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
      // Line breaks
      .replace(/\n\n/g, '</p><p>')
      // Code blocks
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      // Lists
      .replace(/^\- (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)\n(?!<li>)/g, '<ul>$1</ul>');
    
    // Wrap in paragraphs
    html = '<p>' + html + '</p>';
    
    // Clean up empty paragraphs
    html = html.replace(/<p><\/p>/g, '');
    
    return html;
  }, [content]);

  return <div dangerouslySetInnerHTML={{ __html: processedContent }} />;
}