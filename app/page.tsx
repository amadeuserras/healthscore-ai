import { BiomarkerPreviewCard } from '@/components/BiomarkerPreviewCard';
import { AccentWord, CtaLink } from '@/components/ui';

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
