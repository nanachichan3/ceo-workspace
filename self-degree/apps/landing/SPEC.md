# Self-Degree Landing Page MVP — SPEC

**Version:** 1.0.0  
**Date:** 2026-04-24  
**Stage:** MVP Build  
**Owner:** CTO

---

## Overview

Self-Degree is both a framework (book + philosophy) and a product ecosystem (including the Quested AI learning platform). This landing page is for the **Self-Degree Framework** — the book/movement — targeting families exploring alternatives to traditional schooling.

**Purpose:** Convert curious parents to waitlist signups. Capture emails for early access to the framework + community.

---

## Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **Framework** | Next.js 14 (App Router) | Fast dev, good SEO |
| **Language** | TypeScript | Type safety |
| **Styling** | Tailwind CSS | Rapid styling |
| **Forms** | Native + API route | Email capture |
| **Analytics** | Simple pageview tracking | MVP |
| **Hosting** | Vercel | Fast deployment |

---

## User Flow

```
1. User lands on self-degree.com (or /landing)
2. Reads the problem → hooks curiosity
3. Sees solution pillars → understands the framework
4. Reads framework phases → understands HOW it works
5. Enters email → joins waitlist
```

---

## Page Sections

| Section | Content Source |
|---------|---------------|
| Nav | Logo + links (Problem, Solution, Framework, Waitlist CTA) |
| Hero | Headline + email capture |
| Problem | 3 pain points from buyer complaints research |
| Solution | 3 pillars: Self-Directed, AI-Powered, Portfolio-Based |
| Framework | 3 phases: Discovery, Depth, Portfolio |
| Waitlist | Email capture form |

---

## Waitlist Integration

**MVP:** Console log + localStorage for email capture.
**Post-MVP:** Wire to Loops, ConvertKit, or Notion database.

---

## Files

- `app/page.tsx` — Main landing page component
- `app/layout.tsx` — Root layout with metadata
- `app/globals.css` — Tailwind CSS imports
- `public/index.html` — Static HTML version (fallback)
