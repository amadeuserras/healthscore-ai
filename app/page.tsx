import Link from 'next/link';

type CtaLinkProps = {
  href: string;
  children: React.ReactNode;
  variant: 'primary' | 'secondary';
  className?: string;
};

function CtaLink({ href, children, variant, className }: CtaLinkProps) {
  const ctaBase =
    'inline-flex items-center justify-center rounded-[33px] border px-6 py-3.5 text-sm font-medium -tracking-[0.4px] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900';

  const ctaVariant = {
    primary: 'bg-lime-950 text-lime-100 hover:bg-lime-950/90',
    secondary: 'border-stone-300 bg-white hover:bg-stone-100',
  } as const;

  return (
    <Link
      href={href}
      className={[ctaBase, ctaVariant[variant], className].filter(Boolean).join(' ')}
    >
      {children}
    </Link>
  );
}

function AccentWord({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-instrument tracking-[-1.6px] italic text-lime-800 text-[68px]">
      {children}
    </span>
  );
}

type BiomarkerPreviewCardProps = {
  title: string;
  value: string;
  status: 'warning' | 'ok';
  lead: string;
  description: string;
  recommendation: string;
  pill: string;
};

function BiomarkerPreviewCard({
  title,
  value,
  status,
  lead,
  description,
  recommendation,
  pill,
}: BiomarkerPreviewCardProps) {
  const statusEmoji = status === 'warning' ? '⚠️' : '✅';
  const valueClassName = status === 'warning' ? 'text-amber-600' : 'text-lime-800';

  return (
    <div className="rounded-xl border border-stone-200/70 bg-white p-7 shadow-[2px_2px_5px_rgba(0,0,0,0.02)]">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h4 className="text-lg font-medium tracking-[-0.3px]">{title}</h4>
          <p className={`text-2xl font-semibold ${valueClassName}`}>{value}</p>
        </div>
        <span className="text-2xl" aria-hidden>
          {statusEmoji}
        </span>
      </div>
      <p className="mb-3 text-sm leading-relaxed text-stone-500">
        <span className="font-medium">{lead}</span> {description}
      </p>
      <p className="text-sm font-medium">→ {recommendation}</p>
      <p className="mt-6">
        <span className="inline-flex items-center rounded-full border border-stone-200 bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-800">
          {pill}
        </span>
      </p>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="h-screen flex flex-col bg-stone-50">
      <nav>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <h1 className="font-tight text-2xl font-semibold tracking-[-1.2px]">
            Healthscore <span className="text-lime-800">AI</span>
          </h1>
          <div className="flex items-center gap-6">
            <CtaLink href="/auth/login" variant="secondary">
              Log In
            </CtaLink>
            <CtaLink href="/auth/signup" variant="primary">
              Sign Up
            </CtaLink>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-container px-4 py-20 md:py-24 flex-1">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 tracking-[-5px] text-4xl md:text-5xl lg:text-6xl">
            Understand your <AccentWord>biomarkers</AccentWord>
          </h2>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed tracking-[-0.3px] text-stone-500">
            AI-powered insights from your lab results. Get personalized recommendations to optimize
            your health based on your blood test data.
          </p>

          <div className="mb-14 mt-8 flex flex-wrap items-center justify-center gap-4">
            <CtaLink href="/demo" variant="primary">
              Try Demo
            </CtaLink>
            <CtaLink href="/auth/signup" variant="secondary">
              Sign Up
            </CtaLink>
          </div>

          <div className="text-left">
            <h3 className="mb-10 text-center font-tight text-3xl tracking-[-1.8px] md:text-4xl">
              What You&apos;ll Get
            </h3>
            <div className="grid gap-6 md:grid-cols-3">
              <BiomarkerPreviewCard
                title="Vitamin D"
                value="18 ng/mL"
                status="warning"
                lead="Below optimal."
                description="May affect bone health and immune function."
                recommendation="Consider 2000 IU daily supplementation"
                pill="Immunity · Bones"
              />
              <BiomarkerPreviewCard
                title="Fasting Glucose"
                value="120 mg/dL"
                status="warning"
                lead="Elevated."
                description="In the prediabetic range, but reversible."
                recommendation="Reduce refined carbs, add 30min walking after meals"
                pill="Metabolic health"
              />
              <BiomarkerPreviewCard
                title="HDL Cholesterol"
                value="58 mg/dL"
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
          <p className="text-center text-sm text-stone-500">
            Healthscore AI is not a substitute for professional medical advice. Always consult with
            a healthcare provider.
          </p>
        </div>
      </footer>
    </div>
  );
}
