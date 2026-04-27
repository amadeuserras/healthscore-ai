# HealthScore AI

> A biomarker insights dashboard that turns lab results into actionable health guidance — built with Next.js, Supabase, and OpenAI.

![Demo Screenshot](screenshot.png) _(in progress)_

---

## What It Does

**HealthScore AI** takes common blood test biomarkers (glucose, cholesterol, vitamin D, etc.) and gives you:

- **A single health score** (0–100) that summarizes your overall status
- **Color-coded biomarker cards** so you can see what's optimal, what needs attention, and what's concerning at a glance
- **AI generated insights and recommendations** – In plain English (via OpenAI, optional)

You can try it in **demo mode** (no account needed) or **sign up** to save your results and track changes over time.

---

## Why I Built This

I sent Axo a cover letter saying I'd build a small prototype with your exact stack to prove I could hit the ground running. This is that prototype.

The goal was to demonstrate:

- **Understanding of your product space** — I know the "biomarker data → actionable insights" flow is your core value prop
- **Full-stack chops with your tools** — Next.js, Supabase, OpenAI API, TypeScript throughout
- **Ability to ship a polished feature end-to-end** — from authentication and database design to AI integration and UX polish

This isn't just a tech demo. It's a mini version of what I'd be building at Axo.

---

## Key Features

### 🎯 **Smart Analysis**

- Scores 8 common biomarkers against optimal ranges
- Generates a health score with clear status indicators (✅ optimal, ⚠️ suboptimal, ❌ concerning)
- Works with or without OpenAI — falls back to deterministic rule-based insights if the API key isn't configured

### 🤖 \*_AI-Powered Insights_

- Uses OpenAI's structured output mode to generate personalized recommendations
- Validates all AI responses to ensure clean, predictable JSON
- Graceful fallback if the API fails

### 🔐 **Auth + Data Persistence**

- Supabase authentication (email/password)
- Save unlimited analyses to your history
- Row-level security ensures users only see their own data

### 🚀 **Production-Ready Patterns**

- Rate limiting on the analysis endpoint (5 requests per 15 minutes per IP)
- Server-side validation of all biomarker inputs
- Proper separation of client/server code (using `'server-only'` imports)
- Type-safe end-to-end (shared types between frontend and backend)

---

## Tech Stack

| Layer        | Technology                                                |
| ------------ | --------------------------------------------------------- |
| **Frontend** | Next.js 15 (App Router), React, TypeScript, Tailwind CSS  |
| **Backend**  | Next.js API Routes, server-side validation, rate limiting |
| **Database** | Supabase (Postgres + RLS)                                 |
| **Auth**     | Supabase Auth (email/password)                            |
| **AI**       | OpenAI API (optional, with structured output validation)  |

### Architecture Highlights

- **Type safety** — shared types (`BiomarkerData`, `AnalysisResult`) flow through client and server
- **Server-only boundaries** — sensitive logic (OpenAI calls, rate limiting) uses `'server-only'` imports to prevent client bundling
- **Graceful degradation** — app works fully without OpenAI; AI is an enhancement, not a dependency
- **Production patterns** — request validation, rate limiting, error handling, RLS policies

---

## Quick Start

### 1. Clone and install

```bash
git clone https://github.com/amadeuserras/healthscore-ai.git
cd healthscore-ai
npm install
```

### 2. Set up environment variables

Create a `.env.local` file (use `.env.local.example` as reference):

```bash
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key

# OpenAI (optional — app works without it)
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini  # optional, defaults to gpt-4o-mini
```

### 3. Set up Supabase database

Run this SQL in your Supabase SQL editor:

```sql
-- Create the history table
create table biomarker_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  health_score integer not null,
  biomarker_data jsonb not null,
  analysis_results jsonb not null,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table biomarker_history enable row level security;

-- Users can only see their own records
create policy "Users can view own history"
  on biomarker_history for select
  using (auth.uid() = user_id);

create policy "Users can insert own history"
  on biomarker_history for insert
  with check (auth.uid() = user_id);
```

### 4. Run it

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and try the demo.

---

## Next Steps

1. **PDF upload** — let users upload lab reports and extract biomarkers via OpenAI Vision API
2. **Google login (OAuth)** — let users sign in with Google via Supabase Auth (Google provider)
3. **Trend visualization** — line charts showing how biomarkers change over time
4. **Email notifications** — remind users to retest after 3 months
5. **More biomarkers** — expand beyond the core 8 (hormones, inflammatory markers, etc.)

---

**License:** MIT
