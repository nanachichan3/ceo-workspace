# Self-Degree

> AI-powered self-directed education framework for families

## Quick Start

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase and Gemini credentials

# Push schema to database
npx prisma db push

# Start development server
npm run dev
```

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Auth:** Supabase Auth (Magic Link)
- **Database:** PostgreSQL + Prisma ORM
- **AI:** Gemini API

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── dashboard/page.tsx           # Family dashboard
│   ├── children/[id]/
│   │   ├── page.tsx                # Child progress view
│   │   └── ai-tutor/page.tsx       # AI tutor chat
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   └── api/
│       ├── waitlist/route.ts
│       ├── children/route.ts
│       ├── children/[id]/route.ts
│       ├── children/[id]/progress/route.ts
│       └── ai/chat/route.ts
├── lib/
│   ├── prisma.ts                   # Prisma client
│   ├── supabase.ts                # Supabase client
│   └── gemini.ts                   # Gemini API helpers
└── middleware.ts                   # Auth middleware
```

## Environment Variables

```env
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
GEMINI_API_KEY=xxx
```

## Features

- Landing page with waitlist signup
- Magic link authentication
- Family dashboard with child profiles
- Progress logging (timeline view)
- AI tutor chat (Gemini-powered)
- Session tracking and XP system

## Development

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run typecheck    # Run TypeScript checks
npx prisma studio    # Open Prisma Studio
```

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for full technical specification.