# Self-Degree — MVP Feature Scope

**Version:** 1.0
**Date:** 2026-04-25
**Author:** CTO
**Status:** For CEO review — actionable for development

---

## 1. What Are We Building?

Self-Degree MVP is a **minimum family onboarding + learning log + AI tutor** product.

**Goal:** Validate that families will sign up, add a child, log progress, and use an AI tutor — before building community, payment, or multi-child infrastructure.

**Core assumption to validate:** Parents will pay for an AI-powered self-directed education framework once they've discovered it through the book or waitlist.

---

## 2. MVP Feature List

### Feature 1 — Landing Page + Waitlist
**Route:** `/`

**What it does:**
- Hero with headline + value prop (use existing landing-page-copy.md)
- Waitlist email capture form → stores in `WaitlistEntry` table
- Book purchase redirect link (Gumroad or similar)
- Navigation to `/auth/login` and `/auth/signup`

**What's NOT in scope:**
- Any pricing display (no payment yet)
- Discovery call booking widget
- Testimonials section with real data (placeholder text is fine)

**Priority:** P0 — this is the entry point; nothing else matters without it

---

### Feature 2 — Parent Auth (Magic Link)
**Routes:** `/auth/login`, `/auth/signup`

**What it does:**
- Parent enters email
- Supabase sends magic link
- Parent clicks link → session established → redirected to `/dashboard`
- Logout functionality

**What's NOT in scope:**
- Password-based login
- OAuth (Google, Apple)
- Child login accounts
- Multi-parent family accounts

**Priority:** P0 — gate for dashboard features

---

### Feature 3 — Family Dashboard (1 Child)
**Route:** `/dashboard`

**What it does:**
- Shows the parent their family name and single child card
- Displays: child name, age, quick stats (total progress entries, projects count)
- Link to child's full progress view
- Link to AI tutor
- Button to add/update child profile

**What's NOT in scope:**
- Multiple children per family (hard cap: 1 child in MVP)
- Multi-parent households
- Community/peer features
- Any billing/subscription UI

**Priority:** P0 — core parent experience

---

### Feature 4 — Progress Logging
**Route:** `/children/:id` (progress view) + `POST /api/children/:id/progress`

**What it does:**
- Parent manually logs a progress entry for the child
  - Type: Reading / Project / Conversation / Exploration / Practice / Other
  - Subject (optional free text)
  - Description (what happened)
  - Artifacts URL (optional — link to uploaded photo/file)
- Chronological timeline view of all entries for that child
- XP earned display (gamification layer — simple, not complex)

**What's NOT in scope:**
- Automated progress tracking
- Teacher/coach input on entries
- Public portfolio pages
- Progress export (PDF, etc.)

**Priority:** P1 — the primary "proof of learning" artifact

---

### Feature 5 — AI Tutor Chat
**Route:** `/children/:id/ai-tutor`

**What it does:**
- Simple chat interface: parent or child types a message → Gemini API responds
- Tutor follows the Self-Degree system prompt philosophy (see below)
- No long-term memory — each session is standalone
- Session logged to `AISession` table: tokens used, duration, topic, AI-generated summary
- Uses `gemini-1.5-flash` for cost efficiency

**System prompt:**
> "You are an AI tutor for a self-directed learner. Your role is to follow the child's curiosity — not to impose a curriculum. Ask questions. Generate challenges at the edge of their knowledge. Celebrate their discoveries. Never lecture. Never test. Never correct harshly. The child leads; you facilitate."

**What's NOT in scope:**
- Persistent memory across sessions (session-level only)
- Multi-modal input (images, file uploads)
- Voice interface
- Structured lesson plans
- Parent-facing "session review" view

**Priority:** P1 — the differentiating feature

---

### Feature 6 — Child Profile Management
**Route:** `/children/:id` + `PUT /api/children/:id`

**What it does:**
- Parent can add/edit a child: name, age, learning profile (interests, pace, learning style as free-form JSON)
- Avatar URL (optional, simple text field)
- Created once, editable

**What's NOT in scope:**
- Child login / child-facing UI
- More than 1 child per family
- Structured "learning profile builder" UI (plain JSON editing is fine for MVP)

**Priority:** P1 — foundation for progress and AI features

---

### Feature 7 — Waitlist → Enrolment Invite (MVP Workflow)
**What it does:**
- Waitlist entries have status: PENDING / INVITED / CONVERTED / EXPIRED
- CEO can manually mark a waitlist entry as INVITED from DB (no admin UI needed for MVP)
- Invited email → directs to `/auth/signup` with invite context (just manual DB update by founder for MVP)
- On signup, `WaitlistEntry.status` updates to CONVERTED

**What's NOT in scope:**
- Automated email sending on invite
- Admin dashboard for managing invites
- Cohort management
- Payment processing

**Priority:** P2 — needed to demonstrate real conversion flow, but CEO can operate manually

---

## 3. Tech Stack (Already Decided)

**No decision needed — use what ARCHITECTURE.md specifies:**

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (App Router) + TypeScript + Tailwind CSS |
| Hosting | Vercel |
| Auth | Supabase Auth (magic link) |
| Database | PostgreSQL (Supabase) |
| ORM | Prisma |
| AI | Gemini API (`gemini-1.5-flash`) via REST |
| File Storage | Supabase Storage (MVP: not actively used, just artifact URL fields) |
| CI/CD | GitHub Actions |

**Decision:** Build on this stack as specified. Do not revisit tech choices for MVP.

---

## 4. What's NOT in MVP

This is a hard list. Do not build these in the MVP phase.

**Auth & Users:**
- [ ] Password login (magic link only)
- [ ] OAuth providers (Google, Apple, GitHub)
- [ ] Child login / child accounts
- [ ] Multi-parent family accounts
- [ ] Admin dashboard

**Product:**
- [ ] More than 1 child per family
- [ ] AI long-term memory / persistent context across sessions
- [ ] Structured learning paths or curricula
- [ ] Portfolio sharing / public profile pages
- [ ] Community features (forums, peer groups)
- [ ] Parent coaching or feedback features
- [ ] Automated progress tracking (GPS, APIs, etc.)
- [ ] Push notifications

**Business:**
- [ ] Payment / subscription processing (Stripe)
- [ ] Pricing tiers (Explorer / Builder / Full Degree)
- [ ] Cohort management
- [ ] Referral program
- [ ] Email automation beyond magic link auth

**Mobile:**
- [ ] Mobile apps (iOS, Android)
- [ ] Responsive refinements beyond basic Tailwind

---

## 5. Open Decisions Needed from CEO

### D1 — Book Integration
The landing page should link to the book. **Where does the book purchase link point?**
- Gumroad URL needed
- Is the book already published and live?

### D2 — Waitlist Invite Flow
The MVP has a manual workaround for invite → signup. **Who triggers invites?**
- Is this still a waitlist-only model where CEO manually invites?
- Or do we open general signup after launch?
- **Impact:** Changes auth flow requirements

### D3 — Success Metric Definition
**What does "MVP success" look like?**
- 10 enrolled families? 50? (No payment yet, so "enrolled" = has an account + added a child)
- Do we consider a family "validated" if they log 5+ progress entries?
- Is there a target DAU/MAU for the AI tutor?

### D4 — Invited Cohort Size
**How many families are we targeting for the first cohort?**
- This affects whether we need queuing infrastructure in MVP or not
- If <20 families: manual waitlist management is fine
- If >20 families: need some kind of invite queue system

### D5 — Founding Member Pricing (for later)
We should agree on whether MVP families get a "founding member" rate locked in.
- **No action needed now** — just flag that this decision is coming before we build the payment flow
- Keep the door open for `enrollment_tier` field on User or Family

---

## 6. Directory Structure

```
self-degree/
├── prisma/
│   └── schema.prisma          ← already designed in ARCHITECTURE.md
├── src/
│   ├── app/
│   │   ├── page.tsx           ← Landing page (P0)
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   ├── dashboard/
│   │   │   └── page.tsx       ← Family dashboard (P0)
│   │   ├── children/
│   │   │   └── [id]/
│   │   │       ├── page.tsx    ← Child progress view (P1)
│   │   │       └── ai-tutor/
│   │   │           └── page.tsx ← AI tutor chat (P1)
│   │   └── auth/
│   │       ├── login/page.tsx (P0)
│   │       └── signup/page.tsx (P0)
│   ├── components/
│   │   ├── ui/                 ← Shadcn/ui primitives
│   │   ├── LandingHero.tsx
│   │   ├── WaitlistForm.tsx
│   │   ├── ChildProgressTimeline.tsx
│   │   └── AITutorChat.tsx
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── supabase.ts
│   │   ├── gemini.ts
│   │   └── auth.ts
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

## 7. Build Order (Recommended)

**Phase A — Skeleton (Week 1)**
1. Bootstrap Next.js 14 project with TypeScript + Tailwind
2. Set up Prisma with the schema from ARCHITECTURE.md
3. Configure Supabase project (Auth + PostgreSQL)
4. Set up GitHub repo + GitHub Actions CI pipeline
5. Deploy to Vercel (empty shell)

**Phase B — Landing + Auth (Week 1–2)**
6. Build landing page `/` with waitlist form
7. Build `/auth/login` and `/auth/signup` (magic link)
8. Set up route protection middleware
9. Build `/dashboard` shell

**Phase C — Core Features (Week 2–3)**
10. Child profile CRUD (add/edit 1 child)
11. Progress logging (timeline view + form)
12. AI tutor chat interface + Gemini integration
13. Session logging for AI sessions

**Phase D — Polish + Integration (Week 3–4)**
14. Wire up all features end-to-end
15. Error handling + loading states
16. Responsive basics
17. Final QA + bug fixes

---

## 8. Estimated Build Time

| Phase | Effort | Notes |
|-------|--------|-------|
| Skeleton + CI/CD | 1 day | Standard Next.js bootstrap |
| Landing + Waitlist | 1 day | Copy already written |
| Auth (magic link) | 0.5 day | Supabase handles most |
| Dashboard | 0.5 day | Simple layout |
| Child profile | 0.5 day | Basic CRUD |
| Progress logging | 1 day | Form + timeline |
| AI tutor chat | 2 days | Chat UI + Gemini API + session logging |
| Polish + QA | 1 day | |
| **Total** | **~7–8 days** | **1.5–2 weeks for 1 developer** |

**Note:** This assumes the developer is familiar with Next.js 14 App Router, Supabase Auth, and the Gemini API. Timeline assumes focused, uninterrupted work (4–6 hours/day). Realistically with context switching: 2–3 weeks.

---

## 9. Immediate Next Steps (Before Coding Starts)

1. **CEO confirms** book purchase URL (D1) and invite model (D2)
2. **CTO or contractor** bootstraps Next.js project, sets up Supabase project, connects to Vercel
3. **CTO** creates GitHub repo with the ARCHITECTURE.md schema and directory structure
4. **CTO** creates first GitHub Issues for the build order above

---

*CTO (Nanachi) | Self-Degree MVP Scope v1.0 | 2026-04-25*
