import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const roastsDirectory = path.join(process.cwd(), 'content/roasts');

export interface RoastMetadata {
  title: string;
  url: string;
  roastDate: string;
  summary: string;
  issues: string[];
  tags: string[];
}

export interface RoastWithContent extends RoastMetadata {
  id: string;
  content: string;
}

export function getAllRoasts(): RoastWithContent[] {
  try {
    const fileNames = fs.readdirSync(roastsDirectory);
    const roasts = fileNames
      .filter(name => name.endsWith('.mdx'))
      .map(name => {
        const id = name.replace(/\.mdx$/, '');
        const fullPath = path.join(roastsDirectory, name);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);
        
        return {
          id,
          content,
          ...data
        } as RoastWithContent;
      })
      .sort((a, b) => new Date(b.roastDate).getTime() - new Date(a.roastDate).getTime());
    
    return roasts;
  } catch (error) {
    console.error('Error reading roasts:', error);
    return [];
  }
}

export function getRoastById(id: string): RoastWithContent | null {
  try {
    const fullPath = path.join(roastsDirectory, `${id}.mdx`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    return {
      id,
      content,
      ...data
    } as RoastWithContent;
  } catch (error) {
    console.error(`Error reading roast ${id}:`, error);
    return null;
  }
}

export function getRoastSummaries(): Array<RoastMetadata & { id: string }> {
  try {
    const fileNames = fs.readdirSync(roastsDirectory);
    const summaries = fileNames
      .filter(name => name.endsWith('.mdx'))
      .map(name => {
        const id = name.replace(/\.mdx$/, '');
        const fullPath = path.join(roastsDirectory, name);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data } = matter(fileContents);
        
        return {
          id,
          ...data
        } as RoastMetadata & { id: string };
      })
      .sort((a, b) => new Date(b.roastDate).getTime() - new Date(a.roastDate).getTime());
    
    return summaries;
  } catch (error) {
    console.error('Error reading roast summaries:', error);
    return [];
  }
}