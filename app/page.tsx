import Link from "next/link";

const beforeExample = `• Consistently hit quarterly targets
• Led migration to new CRM system
• Mentored two junior reps
• Strong communication with clients`;

const afterExample = `Sarah had an exceptional year that demonstrated both her individual contributions and her growing leadership presence within the team.

From a performance standpoint, Sarah consistently hit her quarterly targets throughout the year, delivering results that reflect her deep understanding of the sales cycle and her ability to manage a complex pipeline. Her work on the CRM migration was particularly notable — she took ownership of a project that required technical coordination across multiple teams and saw it through to completion without disrupting day-to-day operations.

What sets Sarah apart is her investment in the people around her. Her mentorship of two junior representatives has already begun to show returns: both have ramped faster than previous cohorts and credit Sarah's guidance as a key factor.

Looking ahead to next year, I'm excited to see Sarah take on a more formal leadership role. With the foundation she's built this year, she's well positioned to expand her impact beyond her individual quota and help shape the direction of the team.`;

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="font-semibold text-gray-900">steeleprather.com</span>
          <Link
            href="/review-generator"
            className="text-sm font-medium px-4 py-2 rounded-md text-white"
            style={{ backgroundColor: "#1D9E75" }}
          >
            Get started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-4">
          Performance reviews shouldn&apos;t<br className="hidden sm:block" />
          take all weekend
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
          Paste in bullet points about your employee. Get a polished, professional review in seconds.
        </p>
        <Link
          href="/review-generator"
          className="inline-block px-8 py-4 rounded-lg text-white font-semibold text-lg transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#1D9E75" }}
        >
          Generate a review free
        </Link>
        <p className="mt-3 text-sm text-gray-400">No credit card required for your first review</p>
      </section>

      {/* Before / After */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <h2 className="text-center text-sm font-semibold uppercase tracking-wider text-gray-400 mb-8">
          From this...to this
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-xl p-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
              Your bullet points
            </div>
            <pre className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed font-sans">
              {beforeExample}
            </pre>
          </div>
          <div
            className="rounded-xl p-6"
            style={{ backgroundColor: "#e8f7f2", borderColor: "#1D9E75", border: "1px solid #1D9E75" }}
          >
            <div
              className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: "#1D9E75" }}
            >
              Generated review
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{afterExample}</p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Simple pricing</h2>
          <p className="text-gray-500 mb-12">Pay per review, or go unlimited.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Free */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-left">
              <div className="text-sm font-semibold text-gray-400 mb-1">First review</div>
              <div className="text-3xl font-bold text-gray-900 mb-1">Free</div>
              <p className="text-sm text-gray-500 mb-6">Try it with no commitment</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <Check /> 1 full review
                </li>
                <li className="flex items-center gap-2">
                  <Check /> Copy to clipboard
                </li>
                <li className="flex items-center gap-2">
                  <Check /> All tone options
                </li>
              </ul>
            </div>

            {/* Pay as you go */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-left">
              <div className="text-sm font-semibold text-gray-400 mb-1">Pay as you go</div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                $9 <span className="text-lg font-normal text-gray-400">/ review</span>
              </div>
              <p className="text-sm text-gray-500 mb-6">One-time purchase</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <Check /> 1 additional review
                </li>
                <li className="flex items-center gap-2">
                  <Check /> Copy to clipboard
                </li>
                <li className="flex items-center gap-2">
                  <Check /> All tone options
                </li>
              </ul>
            </div>

            {/* Unlimited */}
            <div
              className="rounded-xl p-6 text-left relative"
              style={{ backgroundColor: "#1D9E75" }}
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-semibold px-3 py-1 rounded-full">
                BEST VALUE
              </div>
              <div className="text-sm font-semibold text-green-200 mb-1">Unlimited</div>
              <div className="text-3xl font-bold text-white mb-1">
                $29 <span className="text-lg font-normal text-green-200">/ month</span>
              </div>
              <p className="text-sm text-green-100 mb-6">Cancel anytime</p>
              <ul className="space-y-2 text-sm text-white">
                <li className="flex items-center gap-2">
                  <CheckWhite /> Unlimited reviews
                </li>
                <li className="flex items-center gap-2">
                  <CheckWhite /> Copy to clipboard
                </li>
                <li className="flex items-center gap-2">
                  <CheckWhite /> All tone options
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10">
            <Link
              href="/review-generator"
              className="inline-block px-8 py-4 rounded-lg text-white font-semibold text-lg transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#1D9E75" }}
            >
              Generate a review free
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-6 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} steeleprather.com
        </div>
      </footer>
    </div>
  );
}

function Check() {
  return (
    <svg
      className="w-4 h-4 flex-shrink-0"
      style={{ color: "#1D9E75" }}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function CheckWhite() {
  return (
    <svg
      className="w-4 h-4 flex-shrink-0 text-white"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
