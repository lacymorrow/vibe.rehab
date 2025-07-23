# Roasts Content Structure

This directory contains website roast content that can be organized in two ways:

## File Structure Options

### Option 1: Single MDX File
For simple roasts without images or additional assets:

```
content/roasts/
├── simple-roast.mdx
└── another-roast.mdx
```

### Option 2: Folder Structure (Recommended)
For roasts with images and other assets:

```
content/roasts/
├── complex-roast/
│   ├── index.mdx          # Main roast content
│   ├── screenshot1.png    # Images
│   ├── screenshot2.jpg    # More images
│   └── diagram.svg        # Any other assets
└── another-complex-roast/
    ├── index.mdx
    ├── hero-image.png
    └── mobile-view.png
```

## MDX Frontmatter

Each roast must include frontmatter with the following fields:

```yaml
---
title: "Your Roast Title"
url: "https://website-being-roasted.com"
roastDate: "2024-01-15"
summary: "A brief description of the roast for SEO and previews"
issues:
  - "First major issue found"
  - "Second issue"
  - "Third issue"
tags:
  - "design"
  - "ux"
  - "performance"
  - "accessibility"
---
```

## Using Images in Roasts

### In Folder Structure
When using the folder structure, reference images with relative paths:

```markdown
![Screenshot of homepage](homepage-screenshot.png)
![Mobile view](mobile-view.jpg)
```

The system automatically:
- Serves images via `/api/content/roasts/{folder-name}/{image-name}`
- Optimizes images using Next.js Image component
- Adds proper styling and responsive behavior

### Supported Image Formats
- PNG (`.png`)
- JPEG (`.jpg`, `.jpeg`)
- WebP (`.webp`)
- SVG (`.svg`)
- GIF (`.gif`)

## Custom MDX Components

The roasts support custom components for better formatting:

### Issue Highlighting
```markdown
<Issue type="error">
This is a critical issue that needs immediate attention.
</Issue>

<Issue type="warning">
This is a moderate issue.
</Issue>

<Issue type="info">
This is just something to note.
</Issue>
```

### Solutions
```markdown
<Solution>
Here's how to fix this issue...
</Solution>
```

### Rating System
```markdown
<Rating score={3}>
Poor - Needs significant improvement
</Rating>
```

## File Naming

### For Single Files
- Use kebab-case: `website-name-roast.mdx`
- Be descriptive: `creative-agency-parallax-disaster.mdx`

### For Folders
- Use kebab-case: `website-name-roast/`
- Keep folder names short but descriptive
- The folder name becomes the URL slug

## URL Structure

- Single files: `/roasts/filename-without-extension`
- Folders: `/roasts/folder-name`

Examples:
- `simple-roast.mdx` → `/roasts/simple-roast`
- `complex-roast/index.mdx` → `/roasts/complex-roast`

## Best Practices

1. **Use folders for roasts with images** - This keeps everything organized
2. **Optimize images** - Keep file sizes reasonable (< 1MB per image)
3. **Use descriptive alt text** - Important for accessibility
4. **Include variety in tags** - Helps with categorization
5. **Keep frontmatter consistent** - Ensures proper site functionality

## Image Guidelines

- **Screenshots**: 1200px wide max for desktop, 375px for mobile
- **File sizes**: Aim for under 200KB per image
- **Formats**: Use PNG for screenshots, JPEG for photos
- **Names**: Use descriptive names like `homepage-mobile-view.png`

## Development

When adding new roasts:

1. Create the folder structure
2. Add your `index.mdx` file with proper frontmatter
3. Add any images to the same folder
4. Reference images using relative paths in the MDX
5. Test locally with `npm run dev`

The system automatically detects new roasts and generates static pages for them.
