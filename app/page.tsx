import Link from 'next/link';

const primaryCta =
  'inline-flex py-3.5 px-6 items-center justify-center rounded-[33px] border border-brand-lime bg-brand-ink -tracking-[0.4px] text-sm font-medium text-brand-lime transition hover:bg-[#0a3233] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-ink';

const secondaryCta =
  'inline-flex py-3.5 px-6 items-center justify-center rounded-[33px] border border-neutral-200 bg-white -tracking-[0.4px] text-sm font-medium text-brand-ink transition hover:bg-surface-mute focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-ink';

const navLink = 'text-[15px] font-medium text-ink/80 transition-colors hover:text-brand-ink';

const protocolPill =
  'inline-flex items-center rounded-full border border-pill-border/40 bg-neutral-100 px-2.5 py-1 text-xs font-medium text-ink/90';

function AccentWord({ children }: { children: React.ReactNode }) {
  return <span className="font-instrument italic text-green-800 text-[67px]">{children}</span>;
}

type BiomarkerPreviewCardProps = {
  title: string;
  value: string;
  valueClassName: string;
  status: 'warning' | 'ok';
  lead: string;
  description: string;
  recommendation: string;
  pill: string;
};

function BiomarkerPreviewCard({
  title,
  value,
  valueClassName,
  status,
  lead,
  description,
  recommendation,
  pill,
}: BiomarkerPreviewCardProps) {
  const statusEmoji = status === 'warning' ? '⚠️' : '✅';

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-8 shadow-[2px_2px_5px_rgba(0,0,0,0.02)]">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h4 className="text-lg font-medium -tracking-[0.3px] text-slate-900">{title}</h4>
          <p className={`text-2xl font-semibold ${valueClassName}`}>{value}</p>
        </div>
        <span className="text-2xl" aria-hidden></span>
      </div>
      <p className="mb-4 text-sm leading-relaxed text-ink/50">
        <span className="font-medium text-ink">{lead}</span> {description}
      </p>
      <p className="text-sm font-medium text-brand-ink">→ {recommendation}</p>
      <p className="mt-4">
        <span className={protocolPill}>{pill}</span>
      </p>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="h-screen flex flex-col bg-surface-mute">
      <nav className="backdrop-blur-sm">
        <div className="mx-auto flex max-w-container items-center justify-between px-4 py-4">
          <h1 className="font-tight text-2xl font-semibold -tracking-[0.8px] text-brand-ink">
            HealthScore <span className="text-green-800">AI</span>
          </h1>
          <div className="flex items-center gap-6">
            <Link href="/auth/login" className={secondaryCta}>
              Log In
            </Link>
            <Link href="/auth/signup" className={primaryCta}>
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-container px-4 py-20 md:py-24 flex-1">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 font-tight text-4xl -tracking-[1.7px] text-ink md:text-5xl lg:text-6xl">
            Understand your <AccentWord>biomarkers</AccentWord>
          </h2>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-ink/70">
            AI-powered insights from your lab results. Get personalized{' '}
            <span className="font-instrument italic">recommendations</span> to optimize your health
            based on your blood test data.
          </p>

          <div className="mb-20 mt-12 flex flex-wrap items-center justify-center gap-4">
            <Link href="/demo" className={primaryCta}>
              Try Demo
            </Link>
            <Link href="/auth/signup" className={secondaryCta}>
              Sign Up
            </Link>
          </div>

          <div className="text-left">
            <h3 className="mb-10 text-center font-tight text-3xl -tracking-[0.3px] text-ink md:text-4xl">
              What You&apos;ll Get
            </h3>
            <div className="grid gap-6 md:grid-cols-3">
              <BiomarkerPreviewCard
                title="Vitamin D"
                value="18 ng/mL"
                valueClassName="text-health-yellow"
                status="warning"
                lead="Below optimal."
                description="May affect bone health and immune function."
                recommendation="Consider 2000 IU daily supplementation"
                pill="Immunity · Bones"
              />
              <BiomarkerPreviewCard
                title="Fasting Glucose"
                value="120 mg/dL"
                valueClassName="text-health-yellow"
                status="warning"
                lead="Elevated."
                description="In the prediabetic range, but reversible."
                recommendation="Reduce refined carbs, add 30min walking after meals"
                pill="Metabolic health"
              />
              <BiomarkerPreviewCard
                title="HDL Cholesterol"
                value="58 mg/dL"
                valueClassName="text-brand-ink"
                status="ok"
                lead="Optimal range."
                description='Your "good" cholesterol is healthy.'
                recommendation="Keep up your current lifestyle habits"
                pill="Cardiovascular"
              />
            </div>
          </div>
        </div>
      </main>

      <footer className="">
        <div className="mx-auto max-w-container px-4 py-4">
          <p className="text-center text-sm text-ui-333">
            HealthScore AI is not a substitute for professional medical advice. Always consult with
            a healthcare provider.
          </p>
        </div>
      </footer>
    </div>
  );
}
