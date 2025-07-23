import fs from "fs";
import path from "path";
import matter from "gray-matter";

const roastsDirectory = path.join(process.cwd(), "content/roasts");

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

function findMdxFile(dirPath: string): string | null {
  try {
    const files = fs.readdirSync(dirPath);

    // Prioritize index.mdx files
    const indexFile = files.find((file) => file === "index.mdx");
    if (indexFile) {
      return indexFile;
    }

    // Fall back to any .mdx file
    const mdxFile = files.find((file) => file.endsWith(".mdx"));
    return mdxFile || null;
  } catch (error) {
    return null;
  }
}

function getRoastFromPath(
  roastPath: string,
  id: string,
): RoastWithContent | null {
  try {
    let fullPath: string;
    let isDirectory = false;

    // Check if it's a directory
    if (fs.statSync(roastPath).isDirectory()) {
      isDirectory = true;
      const mdxFile = findMdxFile(roastPath);
      if (!mdxFile) {
        return null;
      }
      fullPath = path.join(roastPath, mdxFile);
    } else {
      fullPath = roastPath;
    }

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      id,
      content,
      ...data,
    } as RoastWithContent;
  } catch (error) {
    console.error(`Error reading roast ${id}:`, error);
    return null;
  }
}

export function getAllRoasts(): RoastWithContent[] {
  try {
    const entries = fs.readdirSync(roastsDirectory, { withFileTypes: true });
    const roasts: RoastWithContent[] = [];

    for (const entry of entries) {
      const fullPath = path.join(roastsDirectory, entry.name);
      let id: string;

      if (entry.isDirectory()) {
        // For directories, use the directory name as the ID
        id = entry.name;
      } else if (entry.name.endsWith(".mdx")) {
        // For files, use the filename without extension as the ID
        id = entry.name.replace(/\.mdx$/, "");
      } else {
        // Skip non-MDX files
        continue;
      }

      const roast = getRoastFromPath(fullPath, id);
      if (roast) {
        roasts.push(roast);
      }
    }

    return roasts.sort(
      (a, b) =>
        new Date(b.roastDate).getTime() - new Date(a.roastDate).getTime(),
    );
  } catch (error) {
    console.error("Error reading roasts:", error);
    return [];
  }
}

export function getRoastById(id: string): RoastWithContent | null {
  try {
    const roastPath = path.join(roastsDirectory, id);

    // First, try to find a directory with this ID
    if (fs.existsSync(roastPath) && fs.statSync(roastPath).isDirectory()) {
      return getRoastFromPath(roastPath, id);
    }

    // If no directory found, try to find a file with this ID
    const mdxFilePath = path.join(roastsDirectory, `${id}.mdx`);
    if (fs.existsSync(mdxFilePath)) {
      return getRoastFromPath(mdxFilePath, id);
    }

    return null;
  } catch (error) {
    console.error(`Error reading roast ${id}:`, error);
    return null;
  }
}

export function getRoastSummaries(): Array<RoastMetadata & { id: string }> {
  try {
    const entries = fs.readdirSync(roastsDirectory, { withFileTypes: true });
    const summaries: Array<RoastMetadata & { id: string }> = [];

    for (const entry of entries) {
      const fullPath = path.join(roastsDirectory, entry.name);
      let id: string;

      if (entry.isDirectory()) {
        // For directories, use the directory name as the ID
        id = entry.name;
        const mdxFile = findMdxFile(fullPath);
        if (!mdxFile) {
          continue;
        }

        try {
          const mdxPath = path.join(fullPath, mdxFile);
          const fileContents = fs.readFileSync(mdxPath, "utf8");
          const { data } = matter(fileContents);

          summaries.push({
            id,
            ...data,
          } as RoastMetadata & { id: string });
        } catch (error) {
          console.error(`Error reading roast summary ${id}:`, error);
        }
      } else if (entry.name.endsWith(".mdx")) {
        // For files, use the filename without extension as the ID
        id = entry.name.replace(/\.mdx$/, "");

        try {
          const fileContents = fs.readFileSync(fullPath, "utf8");
          const { data } = matter(fileContents);

          summaries.push({
            id,
            ...data,
          } as RoastMetadata & { id: string });
        } catch (error) {
          console.error(`Error reading roast summary ${id}:`, error);
        }
      }
    }

    return summaries.sort(
      (a, b) =>
        new Date(b.roastDate).getTime() - new Date(a.roastDate).getTime(),
    );
  } catch (error) {
    console.error("Error reading roast summaries:", error);
    return [];
  }
}

export function getRoastAssetPath(roastId: string, assetName: string): string {
  // Return the API path for assets
  return `/api/content/roasts/${roastId}/${assetName}`;
}

export function getRoastAssets(roastId: string): string[] {
  try {
    const roastPath = path.join(roastsDirectory, roastId);

    if (!fs.existsSync(roastPath) || !fs.statSync(roastPath).isDirectory()) {
      return [];
    }

    const files = fs.readdirSync(roastPath);
    return files.filter((file) => !file.endsWith(".mdx"));
  } catch (error) {
    console.error(`Error reading assets for roast ${roastId}:`, error);
    return [];
  }
}
