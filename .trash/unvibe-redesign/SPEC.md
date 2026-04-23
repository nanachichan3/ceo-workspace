# Unvibe Redesign SPEC — ViewPulse-Grade UX

## Goal

Redesign **Unvibe** (codebase mental-debt fighter) using **ViewPulse's UX architecture** as the reference. Keep the VIM-terminal aesthetic. Fix the UX, reliability, and flow to match ViewPulse's quality.

**Reference app:** `nanachichan3/youtube-analytic` (ViewPulse)
**Target repo:** `nanachichan3/unvibe`
**New branch:** `redesign`

---

## What to Copy from ViewPulse

### 1. Page Structure (3-phase flow)
```
Landing → [Upload] → Dashboard
```
- Landing page: hero headline, feature grid, upload zone, how-it-works steps, footer
- NO dashboard on landing — dashboard only appears AFTER upload
- Clean separation: landing = marketing, dashboard = app

### 2. Upload Zone UX
- Drag & drop OR click to browse
- Single unified zone (no split zip/github tabs on landing — move GitHub to dashboard)
- Loading overlay with spinner + "Analyzing your codebase…" text
- Error banner that doesn't crash the page
- Privacy note below the zone

### 3. Dashboard Architecture
- **Header bar:** Logo + "Start over" button (right-aligned)
- **Timeline panel:** Brushable monthly activity scale (sparkline + drag handles + year axis + presets: Last 12 months / Last 3 years / All time)
- **Tab bar:** Overview | Files | Games (matches ViewPulse's Analytic/AI Tools/Games/Videos structure but simpler)
- **Grid of stat tiles:** 4-across top row (files, lines, languages, complexity)
- **Charts row:** Language pie + lines-by-language bar
- **Largest files list**
- **AI Insights section:** Collapsible config panel, BYOK API key input, results in two columns

### 4. Games Tab UX (simplified)
- Game type chips (always visible, not buried)
- One game shown at a time with clear game name
- Clean question display with code snippet
- Score + rounds display (terminal echo style)
- Next round button

### 5. Clean Tab Navigation
- Tab bar always visible in dashboard header
- Tabs: Overview | Files | Games
- No nested modals for tab content

---

## What to Keep from Unvibe

### VIM-Terminal Aesthetic (non-negotiable)
- Dark background (#1e1e1e)
- JetBrains Mono everywhere
- Syntax-highlighted colors (keyword blue, string orange, comment green)
- Terminal-style fonts for headers, code blocks
- File browser shows emoji: 📁 📄 (not custom icons)
- Games: VIM-styled question cards (`:set game=` selector)

### GitHub Integration
- Fetch repo by URL
- Token field (collapsible)
- Progress feedback during fetch
- GitHub data feeds into games

### Game Types (keep all, but render cleaner)
- Guess the File
- What Does This Do
- Find the Bug
- Spot the Vulnerability
- Trace the Call
- Type Inference
- Refactor This
- Read the Architecture
- Commit Timeline (GitHub)
- Code Timeline
- Commit Author (GitHub)
- Line Author (GitHub)
- Component Duel
- Complexity Race

### Parsing & Analytics (reliability)
- JSZip archive parsing
- Language detection
- File size + line counts
- Complexity scoring
- Static question generation (from parser heuristics)

---

## What to Fix / Improve

### Critical UX Fixes
1. **Landing page:** Remove the split zip/github toggle from landing. Zip upload goes to dashboard. GitHub option lives in dashboard's Files tab or as a secondary option.
2. **Dashboard loading:** Show a proper loading overlay (ViewPulse style) when processing files, not just a spinner.
3. **Error handling:** Errors should show as inline banners, not crash the page or show raw stack traces.
4. **Game tab:** Remove the redundant infinite game selector in Dashboard — Games.tsx already has game type selector. Just show the current game cleanly.
5. **No data states:** Every section should gracefully handle empty/loading states.
6. **GitHub fetch progress:** Show file count updating in real-time during repo fetch (already there, but make it more prominent).

### Design Consistency
7. **Global CSS variables:** Unvibe already has VIM theme vars. Use them consistently — don't mix in new colors.
8. **Card components:** Use `card` class consistently instead of inline styles everywhere.
9. **Font:** Keep JetBrains Mono everywhere. The VIM theme is fine.
10. **Upload zone:** Make it feel like ViewPulse's landing zone — centered, large, inviting.

---

## File Changes

### New Structure
```
app/
  page.tsx              # Landing page (hero + features + upload + how-it-works + footer)
  globals.css           # Keep existing VIM vars, add card/container utilities
  layout.tsx            # Keep as-is (fonts, metadata)

components/
  site-header.tsx       # Logo + GitHub link (NEW — ViewPulse style)
  landing-upload.tsx    # Upload zone for landing page (NEW — ViewPulse landing zone style)
  hero.tsx              # Keep, simplify (remove upload zone from here)
  features.tsx          # Keep, update to ViewPulse feature grid style
  how-it-works.tsx      # Keep, update to 4-step grid
  footer.tsx           # Keep as-is
  Dashboard.tsx         # MAJOR REFACTOR — ViewPulse dashboard structure
  DashboardOverview.tsx # Overview tab content (extracted from Dashboard.tsx)
  DashboardFiles.tsx    # Files tab content (extracted)
  DashboardGames.tsx    # Games tab content (refactor Games.tsx)
  Games.tsx             # Keep games logic, simplify UI wrapper
  GitHubInput.tsx       # Keep as-is
  TimelinePanel.tsx     # NEW — brushable timeline component (from ViewPulse Dashboard)
  StatTiles.tsx         # NEW — 4 stat cards row
  LanguageCharts.tsx    # NEW — pie + bar charts
  AiInsights.tsx        # Refactor from existing Dashboard AI section
  games/
    (keep all existing game components)
lib/
  (keep all existing files — parser, ai, github, types, sanitize, patterns)
```

### Dashboard.tsx Refactor
Replace the current 3-tab (overview/files/games) layout with ViewPulse-style:
```tsx
<Dashboard>
  {/* Top bar: title + [Overview | Files | Games] tabs + Start over */}
  {/* Timeline panel: sparkline + brush handles */}
  {/* Tab content based on activeTab */}
  {/* Footer debug toggle */}
</Dashboard>
```

---

## Layout Specs

### Landing Page Sections (top to bottom)
1. **Navbar:** Logo left, "View Source" + "View on GitHub" right (ViewPulse style)
2. **Hero:** Headline + subtext + upload zone (full width, centered)
3. **Stats bento:** 4 tiles (files analyzed, languages, games, open source)
4. **Features grid:** 3-column feature cards
5. **How it works:** 4-step numbered list
6. **Footer:** GitHub link + tagline

### Dashboard Layout
```
┌─────────────────────────────────────────────────┐
│  Logo  [Overview] [Files] [Games]    ← Start over │
├─────────────────────────────────────────────────┤
│  Timeline panel: sparkline + brush handles + presets    │
├─────────────────────────────────────────────────┤
│  Tab content (Overview | Files | Games)                  │
└─────────────────────────────────────────────────┘
```

### Overview Tab
- 4 stat tiles (files, lines, languages, complexity)
- 2-column chart row (language pie + lines bar)
- Largest files list
- AI Insights (collapsed by default)

### Files Tab
- Directory tree browser (collapsible, emoji icons)
- GitHub URL input at top (to fetch repo)

### Games Tab
- Game type chips
- Current game card (question + options)
- Score display
- Next round button

---

## Tech Stack (unchanged)
- Next.js 14
- TypeScript
- Recharts (for language charts)
- JSZip
- Lucide React
- Client-side only (no server-side storage)

---

## Success Criteria

1. Landing page feels like ViewPulse — clean, structured, professional
2. Upload flow is seamless: drop file → loading → dashboard
3. Dashboard is organized: tabs, timeline, clean grid
4. Games work reliably with clear UI
5. Zero page crashes from errors
6. VIM terminal aesthetic preserved throughout
7. All existing functionality preserved (parsing, GitHub, games, AI insights)
