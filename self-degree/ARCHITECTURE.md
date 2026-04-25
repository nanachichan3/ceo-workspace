# Self-Degree — Technical Architecture

> **Document Status:** Created  
> **Author:** CTO (Nanachi)  
> **Date:** 2026-04-25  
> **Version:** 1.0.0  
> **Project:** Self-Degree (Project ID: 9)  
> **Stack:** Greenfield — no codebase exists yet  

---

## 1. Overview

Self-Degree is a self-directed, AI-powered education framework for families with children ages 8–18. The product serves parents who are considering homeschooling or alternative education paths, and replaces the traditional curriculum with an AI tutor that follows each child's curiosity and interests.

**Funnel:** Book (awareness) → Waitlist (capture) → Enrollment (conversion)

---

## 2. Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Hosting:** Vercel

### Backend
- **Primary:** Next.js API Routes (serverless)
- **Alternative:** Node.js / NestJS (defer to Phase 2 if needed)

### Database & ORM
- **Database:** PostgreSQL
- **ORM:** Prisma

### Auth
- **Provider:** Supabase Auth (email + magic link, passwordless)
- **Session:** JWT (via Supabase)

### AI
- **Provider:** Gemini API (REST)
- **Cost tracking:** `countTokens` endpoint
- **Session logging:** tokens used, topic, duration, summary

### File Storage
- **Provider:** Supabase Storage (portfolio assets, progress artifacts)

### Infrastructure
| Component | Provider |
|-----------|----------|
| Frontend + API | Vercel |
| Auth + DB + Storage | Supabase |
| CI/CD | GitHub Actions |

### Environment Variables
```
DATABASE_URL
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
GEMINI_API_KEY
```

---

## 3. Core Data Model (Prisma Schema)

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── Auth & Users ────────────────────────────────────────────────────────────

enum UserRole {
  PARENT
  ADMIN
}

model User {
  id            String       @id @default(cuid())
  email         String       @unique
  name          String?
  role          UserRole     @default(PARENT)
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt

  ownedFamily   Family?
  familyMembers FamilyMember[]
}

// ─── Family & Membership ─────────────────────────────────────────────────────

model Family {
  id          String         @id @default(cuid())
  name        String
  ownerUserId String         @unique
  ownerUser   User           @relation(fields: [ownerUserId], references: [id])
  createdAt   DateTime       @default(now())

  members     FamilyMember[]
  children    Child[]
}

enum FamilyMemberRole {
  PARENT
  CHILD
}

model FamilyMember {
  id        String           @id @default(cuid())
  familyId  String
  userId    String
  role      FamilyMemberRole
  family    Family           @relation(fields: [familyId], references: [id])
  user      User             @relation(fields: [userId], references: [id])

  @@unique([familyId, userId])
}

// ─── Children ────────────────────────────────────────────────────────────────

model Child {
  id              String        @id @default(cuid())
  familyId        String
  family          Family        @relation(fields: [familyId], references: [id])
  name            String
  age             Int
  learningProfile Json?         // interests, pace, learning style, strengths
  avatarUrl       String?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  progressEntries ProgressEntry[]
  projects        Project[]
  aiSessions      AISession[]
}

// ─── Progress Tracking ───────────────────────────────────────────────────────

enum ProgressType {
  READING
  PROJECT
  CONVERSATION
  EXPLORATION
  PRACTICE
  OTHER
}

model ProgressEntry {
  id           String       @id @default(cuid())
  childId      String
  child        Child        @relation(fields: [childId], references: [id])
  date         DateTime     @default(now())
  type         ProgressType
  subject      String?
  description  String
  artifactsUrl String[]     // URLs to uploaded files / photos
  xpEarned     Int          @default(0)
  createdAt    DateTime     @default(now())
}

// ─── Projects ────────────────────────────────────────────────────────────────

enum ProjectStatus {
  IDEATION
  IN_PROGRESS
  COMPLETED
  ABANDONED
}

model Project {
  id           String        @id @default(cuid())
  childId      String
  child        Child         @relation(fields: [childId], references: [id])
  name         String
  description  String
  status       ProjectStatus @default(IDEATION)
  artifactsUrl String[]
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
}

// ─── AI Sessions ─────────────────────────────────────────────────────────────

model AISession {
  id         String   @id @default(cuid())
  childId    String
  child      Child    @relation(fields: [childId], references: [id])
  date       DateTime @default(now())
  duration   Int      // seconds
  tokensUsed Int
  topic      String?
  summary    String?
  createdAt  DateTime @default(now())
}

// ─── Waitlist ────────────────────────────────────────────────────────────────

enum WaitlistStatus {
  PENDING
  INVITED
  CONVERTED
  EXPIRED
}

model WaitlistEntry {
  id       String         @id @default(cuid())
  email    String         @unique
  source   String?        // e.g. "book", "twitter", "friend"
  status   WaitlistStatus @default(PENDING)
  joinedAt DateTime       @default(now())
}
```

---

## 4. API Design

All endpoints prefixed with `/api`. Protected routes require a valid JWT session (Supabase Auth).

### 4.1 Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | Public | Register parent account |
| POST | `/api/auth/login` | Public | Magic link trigger |
| POST | `/api/auth/logout` | Protected | End session |
| GET | `/api/auth/me` | Protected | Get current user + family |

### 4.2 Children

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/children` | Protected | List all children for current family |
| POST | `/api/children` | Protected | Add a child to the family |
| GET | `/api/children/:id` | Protected | Get child details |
| PUT | `/api/children/:id` | Protected | Update child (name, age, profile, avatar) |

### 4.3 Progress

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/children/:id/progress` | Protected | List progress entries for child |
| POST | `/api/children/:id/progress` | Protected | Log a new progress entry |

### 4.4 Projects

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/children/:id/projects` | Protected | List projects for child |
| POST | `/api/children/:id/projects` | Protected | Create a new project |

### 4.5 AI Sessions

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/ai/sessions` | Protected | Log an AI tutoring session |
| GET | `/api/ai/sessions/:childId` | Protected | Get AI session history for child |

### 4.6 Public

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/waitlist` | Public | Join the waitlist |
| GET | `/api/book` | Public | Redirect to Gumroad / book purchase page |

---

## 5. Frontend Pages

### 5.1 Public
| Route | Description |
|-------|-------------|
| `/` | Landing page — value proposition, book link, waitlist signup |

### 5.2 Auth
| Route | Description |
|-------|-------------|
| `/auth/login` | Magic link login |
| `/auth/signup` | Parent registration |

### 5.3 Dashboard (Protected)
| Route | Description |
|-------|-------------|
| `/dashboard` | Family overview — list of children, quick stats |
| `/children/:id` | Individual child — progress timeline, project portfolio |
| `/children/:id/ai-tutor` | AI tutor chat interface |

---

## 6. AI Integration

### 6.1 Tutor Interface
- Chat-based UI — parent or child types a message, AI responds
- Follows child's interests — the AI is not bound to a fixed curriculum
- Generates challenges, suggestions, and follow-up questions based on what the child is exploring
- No long-term memory in Phase 1 MVP — each session is standalone

### 6.2 System Prompt Philosophy
The AI tutor operates under a system prompt embodying the Self-Degree philosophy:

> *"You are an AI tutor for a self-directed learner. Your role is to follow the child's curiosity — not to impose a curriculum. Ask questions. Generate challenges at the edge of their knowledge. Celebrate their discoveries. Never lecture. Never test. Never correct harshly. The child leads; you facilitate."*

### 6.3 Cost Tracking
- Use `gemini-1.5-flash` or similar cost-efficient model as default
- Call `countTokens` before/during session for预算 estimation
- Log `tokensUsed` per session to `AISession` table for analytics

### 6.4 Session Logging
Every AI tutoring session logs:
- `childId`
- `date`
- `duration` (seconds)
- `tokensUsed`
- `topic` (extracted or provided)
- `summary` (AI-generated brief recap)

---

## 7. Authentication Flow

### Provider: Supabase Auth

**Magic Link (Passwordless):**
1. Parent enters email on `/auth/login`
2. Supabase sends magic link to inbox
3. Parent clicks link → redirected to `/dashboard` with session established

**JWT Session:**
- Supabase issues JWT on successful auth
- Token stored in HTTP-only cookie or Supabase client storage
- Middleware (Next.js middleware.ts) validates token on every protected request

**Route Protection:**
```
/dashboard/*        → require valid JWT
/children/*         → require valid JWT
/api/children/*     → require valid JWT
/api/ai/*           → require valid JWT
```

**Public Routes:**
```
/                    → public
/auth/login          → public
/auth/signup         → public
/api/waitlist        → public
/api/book           → public
```

---

## 8. Infrastructure

### 8.1 Hosting (Vercel)
- Frontend: Next.js 14 App Router on Vercel
- API Routes: serverless functions on Vercel (same deployment)
- Environment variables set via Vercel dashboard

### 8.2 Supabase
- **Auth:** Magic link email, JWT management
- **Database:** PostgreSQL (Prisma as ORM)
- **Storage:** Supabase Storage buckets for portfolio artifacts

### 8.3 CI/CD (GitHub Actions)
```
Push → Build → Type Check → Lint → Test → Deploy to Vercel (preview)
Main → Build → Type Check → Lint → Test → Deploy to Vercel (production)
```

### 8.4 Environment Variables Summary
| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anon key (public) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only) |
| `GEMINI_API_KEY` | Google AI Studio API key |

---

## 9. Phase 1 MVP Scope

**In Scope:**
- Landing page (`/`) with value prop, book link, and waitlist signup form
- Parent signup + login via magic link
- Add up to 1 child per family account
- Log progress entries manually (parent types what the child did today)
- View child's progress timeline
- Book purchase redirect link
- AI tutor chat interface with Gemini (session-level, no memory)

**Out of Scope (Phase 2+):**
- Multi-child support per family
- Child accounts / login
- AI long-term memory / persistent context across sessions
- Portfolio sharing / public pages
- Payment / enrollment flow (waitlist → invite only in MVP)
- Push notifications
- Mobile apps

---

## 10. Directory Structure (Recommended)

```
self-degree/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app/
│   │   ├── page.tsx                 # Landing
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── children/
│   │   │   └── [id]/
│   │   │       ├── page.tsx          # Child progress view
│   │   │       └── ai-tutor/
│   │   │           └── page.tsx      # AI tutor chat
│   │   └── auth/
│   │       ├── login/page.tsx
│   │       └── signup/page.tsx
│   ├── components/
│   │   ├── ui/                      # Shadcn/ui primitives
│   │   ├── LandingHero.tsx
│   │   ├── WaitlistForm.tsx
│   │   ├── ChildProgressTimeline.tsx
│   │   ├── ProjectCard.tsx
│   │   └── AITutorChat.tsx
│   ├── lib/
│   │   ├── prisma.ts                # Prisma client singleton
│   │   ├── supabase.ts              # Supabase client
│   │   ├── gemini.ts                # Gemini API helpers
│   │   └── auth.ts                   # Auth utilities
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useChat.ts
│   └── types/
│       └── index.ts
├── public/
├── .env.local
├── .gitignore
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── README.md
```

---

*Last updated: 2026-04-25 by CTO (Nanachi)*
