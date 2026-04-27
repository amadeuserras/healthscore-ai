import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-900">HealthScore AI</h1>
          <div className="space-x-4">
            <Link href="/auth/login" className="text-gray-700 hover:text-blue-900">
              Log In
            </Link>
            <Link
              href="/auth/signup"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">Understand Your Biomarkers</h2>
          <p className="text-xl text-gray-600 mb-12">
            AI-powered insights from your lab results. Get personalized recommendations to optimize
            your health based on your blood test data.
          </p>

          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center mb-20">
            <Link
              href="/demo"
              className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition shadow-lg"
            >
              Try Demo
            </Link>
            <Link
              href="/auth/signup"
              className="px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-lg hover:bg-gray-50 transition border-2 border-blue-600 shadow-lg"
            >
              Sign Up Free
            </Link>
          </div>

          {/* Example Biomarker Cards */}
          <div className="text-left">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">What You'll Get</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-lg text-gray-900">Vitamin D</h4>
                    <p className="text-2xl font-bold text-health-yellow">18 ng/mL</p>
                  </div>
                  <span className="text-3xl">⚠️</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-semibold">Below optimal.</span> May affect bone health and
                  immune function.
                </p>
                <p className="text-sm text-blue-600 font-medium">
                  → Consider 2000 IU daily supplementation
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-lg text-gray-900">Fasting Glucose</h4>
                    <p className="text-2xl font-bold text-health-yellow">120 mg/dL</p>
                  </div>
                  <span className="text-3xl">⚠️</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-semibold">Elevated.</span> In the prediabetic range, but
                  reversible.
                </p>
                <p className="text-sm text-blue-600 font-medium">
                  → Reduce refined carbs, add 30min walking after meals
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-lg text-gray-900">HDL Cholesterol</h4>
                    <p className="text-2xl font-bold text-health-green">58 mg/dL</p>
                  </div>
                  <span className="text-3xl">✅</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-semibold">Optimal range.</span> Your "good" cholesterol is
                  healthy.
                </p>
                <p className="text-sm text-blue-600 font-medium">
                  → Keep up your current lifestyle habits
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-20 border-t border-gray-200">
        <p className="text-center text-gray-600 text-sm">
          HealthScore AI is not a substitute for professional medical advice. Always consult with a
          healthcare provider.
        </p>
      </footer>
    </div>
  );
}
