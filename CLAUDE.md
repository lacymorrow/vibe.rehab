# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Vibe Rehab is a Next.js 15 application that provides code fixing and MVP completion services. The site helps entrepreneurs and developers finish their projects in 2-4 weeks.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run production server
npm run start

# Run linting
npm run lint
```

**Note**: TypeScript and ESLint errors are currently disabled in `next.config.mjs`. When making changes, ensure code quality even though errors won't block the build.

## Architecture

### Tech Stack
- **Framework**: Next.js 15.2.4 with App Router
- **Language**: TypeScript 5
- **UI**: React 19, Radix UI, Shadcn/ui components
- **Styling**: Tailwind CSS with custom animations
- **Forms**: React Hook Form + Zod validation
- **Payments**: Stripe integration
- **Email**: Resend API
- **Animations**: Motion (v12)

### Directory Structure
- `/app` - Next.js App Router pages and API routes
  - `/api` - Server endpoints for checkout, email
- `/components` - React components
  - `/ui` - Shadcn/ui component library (40+ components)
  - `/magicui` - Custom UI components
- `/config` - Site configuration and metadata
- `/hooks` - Custom React hooks
- `/lib` - Utility functions

### Key API Routes
- `/api/checkout-session` - Stripe checkout handling
- `/api/create-checkout-session` - Initialize Stripe sessions
- `/api/send-email` - Email sending via Resend

### Component Patterns
- Server Components by default (App Router)
- Client Components marked with 'use client'
- Form dialogs use React Hook Form with Zod schemas
- Animations use Motion library and custom hooks

## Environment Variables

Required environment variables:
- `RESEND_API_KEY` - For email functionality
- Stripe API keys (check payment-dialog.tsx for usage)

## Deployment

- Hosted on Vercel
- Automatically syncs with v0.dev
- Domain: vibe.rehab

## Testing

Currently no testing framework is configured. Consider adding:
- Jest + React Testing Library for component tests
- Playwright for E2E tests

## Common Tasks

### Adding New Components
1. Use existing UI components from `/components/ui`
2. Follow the established pattern of Server Components with Client Component islands
3. Place new components in `/components` directory

### Working with Forms
1. Use React Hook Form with Zod validation
2. See `contact-dialog.tsx` or `payment-dialog.tsx` for patterns

### API Route Development
1. Create new routes in `/app/api/[route-name]/route.ts`
2. Use NextRequest/NextResponse from 'next/server'
3. Handle errors with appropriate status codes

### Styling
1. Use Tailwind CSS classes
2. Custom animations go in `tailwind.config.ts`
3. Global styles in `/app/globals.css`

## Important Notes

- The project syncs with v0.dev - major UI changes should be coordinated
- Payment integration is production-ready - test with Stripe test keys
- Email sending requires valid Resend API key
- Site metadata and SEO configuration in `/config/site-config.ts`