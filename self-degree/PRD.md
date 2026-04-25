# Self-Degree — Product Design Document

**Version:** 1.0  
**Date:** 2026-04-25  
**Author:** CTO  
**Status:** For CEO Review  
**Project:** Self-Degree (ID: 9)  
**Stage:** MVP → Validation

---

## 1. Product Vision

Self-Degree is an AI-powered, self-directed education platform that replaces traditional curricula with an intelligent tutor that follows each child's curiosity. We serve families who have chosen — or are considering — homeschooling and alternative education paths, and we give their children an AI companion that learns alongside them.

**Core belief:** Children who learn from their curiosity develop deeper expertise, stronger intrinsic motivation, and better problem-solving skills than children taught to a test. The 2 Sigma Problem proves that one-on-one tutoring doubles learning outcomes. Self-Degree makes 1-on-1 tutoring accessible and affordable by using AI.

**North star:** A world where every child learns through curiosity, not obligation.

---

## 2. User Personas

### Persona 1: The Thoughtful Parent (Primary Buyer)
- **Age:** 32–48
- **Role:** Decision-maker for children's education
- **Situation:** Considering homeschooling after seeing their child's potential stifled by school; or already homeschooling but feeling isolated
- **Pain points:** 
  - "I don't know if my child is on track."
  - "Homeschooling is lonely — where's the community?"
  - "I'm not qualified to teach advanced subjects."
  - "Traditional curricula feel like school-at-home."
- **Goals:** Confident their child is learning meaningfully; want a framework that validates their choice; need evidence of progress
- **Trigger:** Reading the book or hearing about Self-Degree through content marketing
- **Willingness to pay:** Medium-high if convinced of quality; "founding member" pricing resonates

### Persona 2: The Curious Child (End User)
- **Age:** 8–18 (primary segment: 10–15)
- **Situation:** Learning at home, has interests they're passionate about, sometimes feels isolated from peers
- **Pain points:**
  - "Mom keeps assigning stuff I don't care about."
  - "School was boring — but learning on my own is scary."
  - "I want to go deep in my interest but I don't know how."
- **Goals:** Learn cool things, share discoveries, feel "seen" by the AI tutor
- **How they interact:** Primarily via the AI tutor chat; progress dashboard is parent-facing

### Persona 3: The Self-Directed Learner (Direct Buyer, 16–30)
- **Situation:** Left or never entered traditional education; building skills for careers without credentials
- **Pain points:**
  - "Bootcamps are expensive and narrow."
  - "I learn best by following my own path but I need structure."
  - "No one takes self-education seriously without credentials."
- **Goals:** Skill-building, portfolio, credentials that matter, community of peers
- **Trigger:** Blog posts, YouTube videos about alternative education, The 2 Sigma Problem

---

## 3. Core Features

### F1: Landing Page + Waitlist
**Route:** `/`

The entry point. Must accomplish two things in under 30 seconds: (1) make the visitor feel seen, (2) get their email.

**Elements:**
- Hero: "Your child's curiosity is the curriculum." + subhead explaining the thesis
- Book purchase link (Gumroad or similar)
- Waitlist form: email + "What's your biggest challenge with your child's education?" (optional, qualitative)
- Social proof: "Join X,XXX families on the waitlist" + testimonials once available
- Navigation: Login / Sign up (post-launch, this becomes secondary)

**Conversion metric:** Email capture rate. Target: 15% of organic traffic.

---

### F2: Parent Auth (Magic Link)
**Routes:** `/auth/login`, `/auth/signup`

Supabase Auth via magic link. Parent enters email → receives link → clicks → dashboard.

**Flow:**
1. `/auth/signup` → parent enters email + name
2. Supabase sends magic link
3. Parent clicks → redirected to `/dashboard` with session
4. `/auth/login` → same flow for returning users

**Constraints:**
- No password login (magic link only for MVP)
- No OAuth providers in MVP
- No child login accounts

---

### F3: Family Dashboard
**Route:** `/dashboard`

Parent's home base after login.

**Elements:**
- Family name + child card (MVP: 1 child only)
- Quick stats: total progress entries, projects count, AI session count
- "Start AI Session" button → routes to `/children/:id/ai-tutor`
- "Log Progress" button → routes to child's progress view
- Link to edit child profile

**MVP constraint:** Hard cap of 1 child per family account. Multi-child support is Phase 2.

---

### F4: Child Profile Management
**Route:** `/children/:id`

Parent can add/edit child details.

**Fields:**
- Name (required)
- Age (required)
- Learning profile: interests, pace, learning style — stored as free-form JSON in MVP (no fancy UI)
- Avatar URL (optional)

**UX:** Created once, editable. "Add Child" button transforms into "Edit Child" once child exists.

---

### F5: Progress Logging
**Route:** `/children/:id` (progress tab)

Parent manually logs what the child learned today.

**Fields:**
- Type: Reading / Project / Conversation / Exploration / Practice / Other
- Subject (optional free text — "we read about dinosaurs" or "built a trebuchet")
- Description (required — what happened, what the child discovered)
- Artifacts URL (optional — link to photo, video, or uploaded file)
- XP earned (auto-calculated: 10 XP per entry)

**View:** Chronological timeline, newest first. XP total displayed prominently.

**Why manual?** In MVP, automation is out of scope. Parent involvement is a feature, not a bug — it keeps the parent engaged in the child's learning journey.

---

### F6: AI Tutor Chat (Core Differentiator)
**Route:** `/children/:id/ai-tutor`

The heart of Self-Degree.

**How it works:**
1. Parent or child types a message to the AI
2. AI responds following the Self-Degree philosophy (see system prompt below)
3. Session is logged: duration, tokens used, topic, AI-generated summary

**System Prompt:**
> "You are an AI tutor for a self-directed learner. Your role is to follow the child's curiosity — not to impose a curriculum. Ask questions. Generate challenges at the edge of their knowledge. Celebrate their discoveries. Never lecture. Never test. Never correct harshly. The child leads; you facilitate."

**Constraints (MVP):**
- No long-term memory — each session is standalone
- Uses `gemini-1.5-flash` for cost efficiency
- Token counting before generation to track cost
- No multi-modal input (text only)

**Session logging fields:**
- `childId`
- `date`
- `duration` (seconds)
- `tokensUsed`
- `topic` (extracted or provided)
- `summary` (AI-generated brief recap, 1–2 sentences)

---

### F7: Waitlist → Enrollment Flow
**MVP workflow (manual for now):**

1. CEO reviews waitlist entries in PostgreSQL
2. Flags entry as `INVITED` via direct DB update
3. Invited user receives email directing them to `/auth/signup`
4. On signup, `WaitlistEntry.status` updates to `CONVERTED`

**Out of scope (MVP):**
- Automated email sending on invite
- Admin dashboard for managing invites
- Payment processing

---

## 4. User Flows

### Flow 1: First-Time Visitor → Enrolled Family

```
Visitor lands on page (/)
    ↓
Reads hero + explanation (5 seconds)
    ↓
Clicks "Get the Book" or "Join Waitlist"
    ↓
[Book] → redirected to Gumroad / book purchase page
[Waitlist] → enters email + optional challenge question
    ↓
WaitlistEntry stored as PENDING
    ↓
[Future: CEO invites manually]
    ↓
Visitor receives invite email
    ↓
Visitor signs up at /auth/signup (magic link sent)
    ↓
Magic link clicked → redirected to /dashboard
    ↓
Parent adds child profile (name, age, interests)
    ↓
"Start First AI Session" → /children/:id/ai-tutor
    ↓
Parent types first message to AI tutor
    ↓
AI responds following Self-Degree philosophy
    ↓
Session logged → success!
```

### Flow 2: Parent Logs Progress

```
Parent logs in → /dashboard
    ↓
Clicks child card → /children/:id
    ↓
Clicks "Log Progress"
    ↓
Selects type: Reading / Project / Conversation / Exploration / Practice / Other
    ↓
Enters subject + description
    ↓
[Optional] Adds artifact URL
    ↓
Submits → ProgressEntry created → timeline updated
    ↓
XP awarded (10 XP per entry)
    ↓
Level up notification if threshold crossed
```

### Flow 3: AI Tutor Session

```
Parent or child opens /children/:id/ai-tutor
    ↓
Types message: "We started learning about astronomy..."
    ↓
AI responds with questions: "What aspect interests you most — planets, stars, galaxies?"
    ↓
Child answers → AI generates a challenge at the edge of their knowledge
    ↓
Conversation continues, child leads
    ↓
Session ends (parent closes chat or clicks "End Session")
    ↓
AISession record created: duration, tokens, topic, summary
    ↓
Tokens counted and displayed
```

---

## 5. Edge Cases

### EC1: Child Already Has a Strong Curriculum
**Scenario:** Parent has been homeschooling with a structured curriculum (e.g., Classical Conversations, Saxon Math).

**Handling:**
- Don't position Self-Degree as a replacement for ALL curriculum
- Position as: "Your curriculum + Self-Degree AI tutor = better outcomes"
- AI tutor can help with specific subjects where the child is stuck
- Messaging: "The AI tutor doesn't replace your curriculum — it fills the gaps where curiosity lives"

**UI note:** Allow parent to log "Curriculum work" as a progress type — validates their existing approach.

### EC2: Parent Skeptical of AI in Education
**Scenario:** "AI will make my child dependent on technology" or "ChatGPT cheats them out of real learning."

**Handling:**
- Book addresses these concerns directly
- System prompt emphasizes facilitation, not answers
- Sessions are logged so parent can review what happened
- No "correct answers" mode — the AI asks questions, doesn't give grades

**Messaging:** "Self-Degree isn't replacing you or your child's thinking. It's a tool that follows their curiosity, not one that directs it."

### EC3: Child Resistant to Self-Directed Learning
**Scenario:** Child is used to being told what to learn and doesn't know how to direct their own education.

**Handling:**
- AI starts with structured prompts to buildhabit: "What did you learn today?" → child answers → AI reflects back
- Gamification: XP and levels provide extrinsic motivation while intrinsic motivation builds
- Parent-facing dashboard shows progress — child sees their journey visually
- Chapter 4 of the book addresses this transition

### EC4: No Internet / Limited Connectivity
**Scenario:** Family travels, lives rurally, has spotty internet.

**MVP handling:** AI tutor requires internet. Acknowledge in docs. No offline mode in MVP.

**Phase 2 consideration:** Cached lessons, offline progress queue.

### EC5: Child Wants to Learn "Weird" Things
**Scenario:** Child is obsessed with medieval siege weapons, obscure Pokémon lore, or whatever is trending.

**Handling:**
- This is the feature, not a bug
- AI tutor leans INTO the interest, finds depth
- "Weird" interests often lead to deep expertise and creative thinking
- The book addresses how passion projects build transferable skills

---

## 6. Non-Goals (What's NOT in MVP)

**Auth & Identity:**
- ❌ Password-based login (magic link only)
- ❌ OAuth (Google, Apple, GitHub)
- ❌ Child login / child accounts
- ❌ Multi-parent family accounts
- ❌ Admin dashboard for waitlist management

**Product:**
- ❌ More than 1 child per family
- ❌ AI long-term memory / persistent context across sessions
- ❌ Structured learning paths or curricula
- ❌ Portfolio sharing / public profile pages
- ❌ Community features (forums, peer groups)
- ❌ Parent coaching / expert feedback
- ❌ Automated progress tracking (GPS, APIs)
- ❌ Push notifications
- ❌ Payment processing / Stripe integration
- ❌ Pricing tiers (Explorer / Builder / Full Degree)

**Platform:**
- ❌ Mobile apps (iOS, Android)
- ❌ Advanced responsive design beyond basic Tailwind

---

## 7. Success Metrics

### MVP Validation Criteria

| Metric | Definition | Target |
|--------|-----------|--------|
| **Waitlist conversion** | Visitors who enter email on landing page | 15% of organic traffic |
| **Email → Signup** | Waitlist members who complete signup | 20% of waitlist |
| **First AI session** | Signed-up families who complete 1 AI session within 7 days | 40% of signups |
| **Progress logging** | Families who log 3+ progress entries within 14 days | 30% of signups |
| **Retention (30d)** | Signed-up families who return within 30 days | 25% of signups |
| **Session depth** | Average AI session duration | >5 minutes |

### How We'll Measure

- **Supabase Analytics:** Waitlist signups, email → signup conversion
- **Prisma + Supabase:** AI session logs, progress entries, session duration
- **Qualitative:** Parent interviews for MVP cohort (10 families)
- **Book sales:** As a leading indicator of product-market fit

### MVP Success Bar

**"Validated" means:**
- 50+ enrolled families
- 40%+ of signups complete an AI session within 7 days
- 30%+ of signups log 3+ progress entries within 14 days
- Qualitative feedback is positive (parents feel their child's curiosity is being nurtured)

**"Not yet validated" actions:**
- Double down on content marketing (book launch, blog, YouTube)
- Interview drop-offs to understand friction
- Simplify the onboarding flow
- Consider pricing change (free → paid founding member tier)

---

## 8. Open Decisions (Pending CEO Input)

### D1 — Book Integration
**Question:** Where does the book purchase link point?
- Gumroad URL needed
- Is the book already published and live?

### D2 — Waitlist Invite Model
**Question:** Are we still strictly invite-only post-launch? Or does the waitlist open up after launch?
- **Impact:** Changes auth flow requirements

### D3 — Founding Member Pricing
**Question:** Do MVP families get a "founding member" rate locked in?
- **No action needed now** — just flag for pre-Stripe decision
- Keep door open for `enrollment_tier` field on User or Family

### D4 — Success Metric Confirmation
**Question:** Do the targets above align with CEO's definition of MVP success?
- 50 enrolled families vs. 100?
- Is "validated" at these thresholds?

---

## 9. Technical Constraints (from ARCHITECTURE.md)

- **Frontend:** Next.js 14 App Router + TypeScript + Tailwind CSS on Vercel
- **Auth:** Supabase Auth (magic link) — no passwords, no OAuth
- **Database:** PostgreSQL via Supabase + Prisma ORM
- **AI:** Gemini API (`gemini-1.5-flash` default) — REST calls
- **Session storage:** Prisma `AISession` table — tokens used, duration, topic, summary
- **No persistent AI memory** in MVP — session-level only

---

*Document version: 1.0.0*  
*CTO (Nanachi) | 2026-04-25*
