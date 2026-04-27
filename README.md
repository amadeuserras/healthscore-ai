# HealthScore AI

A web application that transforms biomarker lab data into personalized health insights using AI.

## Features

- Manual biomarker data entry
- AI-powered health analysis
- Color-coded biomarker status visualization
- Personalized health recommendations
- User authentication and history tracking

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database & Auth**: Supabase
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd healthscore-ai
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

You can find these values in your Supabase project settings under API.

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Database Setup

If you want to use the full features including authentication and history tracking, you'll need to set up the database schema in Supabase. Run the following SQL in your Supabase SQL editor:

```sql
-- Create biomarker_history table
create table biomarker_history (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  health_score integer not null,
  biomarker_data jsonb not null,
  analysis_results jsonb not null
);

-- Set up Row Level Security (RLS)
alter table biomarker_history enable row level security;

-- Create policy to allow users to read their own data
create policy "Users can view their own biomarker history"
  on biomarker_history for select
  using (auth.uid() = user_id);

-- Create policy to allow users to insert their own data
create policy "Users can insert their own biomarker history"
  on biomarker_history for insert
  with check (auth.uid() = user_id);

-- Create index for better query performance
create index biomarker_history_user_id_idx on biomarker_history(user_id);
create index biomarker_history_created_at_idx on biomarker_history(created_at desc);
```

## Project Structure

```
healthscore-ai/
├── app/
│   ├── demo/              # Demo page with biomarker input
│   ├── auth/              # Authentication pages
│   ├── history/           # User history view
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # React components
├── lib/                   # Utility functions
├── types/                 # TypeScript type definitions
└── public/               # Static assets
```

## Usage

### Try the Demo

Visit the landing page and click "Try Demo" to test the application without creating an account. The demo uses pre-filled example biomarker values.

### Create an Account

1. Click "Sign Up Free" on the landing page
2. Enter your email and create a password
3. Verify your email address
4. Log in and start tracking your biomarkers

### Analyze Your Biomarkers

1. Enter your lab test results manually
2. Click "Analyze My Results"
3. View your health score and personalized recommendations
4. Save results to your history (requires authentication)

## Deployment

The easiest way to deploy this application is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add your environment variables in the Vercel dashboard
4. Deploy!

## Future Enhancements

- PDF lab report upload and parsing
- Trend charts for biomarker tracking over time
- Integration with real OpenAI API for advanced insights
- Mobile app
- Export reports as PDF

## Disclaimer

HealthScore AI is not a substitute for professional medical advice. Always consult with a healthcare provider about your health concerns and before making any health-related decisions.

## License

MIT
