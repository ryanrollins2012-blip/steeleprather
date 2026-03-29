"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

type FormData = {
  employeeName: string;
  jobTitle: string;
  reviewPeriod: string;
  highlights: string;
  growth: string;
  tone: string;
};

function ReviewGeneratorForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasUsedFree, setHasUsedFree] = useState(false);
  const [credits, setCredits] = useState(0);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState("");

  const [form, setForm] = useState<FormData>({
    employeeName: "",
    jobTitle: "",
    reviewPeriod: "Annual",
    highlights: "",
    growth: "",
    tone: "Professional",
  });

  useEffect(() => {
    setHasUsedFree(localStorage.getItem("prg_free_used") === "true");
    setCredits(parseInt(localStorage.getItem("prg_credits") || "0", 10));
    setHasSubscription(localStorage.getItem("prg_subscription") === "true");

    const type = searchParams.get("payment");
    if (type === "single") {
      setPaymentSuccess("single");
      const current = parseInt(localStorage.getItem("prg_credits") || "0", 10);
      localStorage.setItem("prg_credits", String(current + 1));
      setCredits(current + 1);
    } else if (type === "subscription") {
      setPaymentSuccess("subscription");
      localStorage.setItem("prg_subscription", "true");
      setHasSubscription(true);
    }
  }, [searchParams]);

  const canGenerate = !hasUsedFree || credits > 0 || hasSubscription;

  const statusMessage = () => {
    if (hasSubscription) return "Unlimited reviews — subscription active";
    if (!hasUsedFree) return "Your first review is free";
    if (credits > 0) return `${credits} paid review${credits > 1 ? "s" : ""} remaining`;
    return null;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.employeeName.trim() || !form.jobTitle.trim()) {
      setError("Employee name and job title are required.");
      return;
    }
    if (!form.highlights.trim()) {
      setError("Please add at least one performance highlight.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Generation failed");
      }

      const data = await res.json();

      // Mark free review as used if applicable
      if (!hasUsedFree) {
        localStorage.setItem("prg_free_used", "true");
        setHasUsedFree(true);
      } else if (!hasSubscription && credits > 0) {
        const newCredits = credits - 1;
        localStorage.setItem("prg_credits", String(newCredits));
        setCredits(newCredits);
      }

      // Store review in sessionStorage and redirect
      sessionStorage.setItem("prg_review", data.review);
      sessionStorage.setItem("prg_employee", form.employeeName);
      router.push("/review-output");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const msg = statusMessage();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-semibold text-gray-900">
            steeleprather.com
          </Link>
          <span className="text-sm text-gray-400">Performance Review Generator</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Generate a performance review</h1>
          <p className="text-gray-500">Fill in the details below and we'll write the review for you.</p>
        </div>

        {/* Status banner */}
        {msg && (
          <div
            className="rounded-lg px-4 py-3 mb-6 text-sm font-medium"
            style={{ backgroundColor: "#e8f7f2", color: "#178a64" }}
          >
            {paymentSuccess === "single" && "Payment successful! "}
            {paymentSuccess === "subscription" && "Subscription activated! "}
            {msg}
          </div>
        )}

        {!canGenerate && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 mb-6 text-sm text-amber-800">
            You&apos;ve used your free review. Purchase below to generate more.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Employee name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.employeeName}
                onChange={(e) => setForm({ ...form, employeeName: e.target.value })}
                placeholder="Sarah Johnson"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ ["--tw-ring-color" as string]: "#1D9E75" } as React.CSSProperties}
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Job title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.jobTitle}
                onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
                placeholder="Senior Account Executive"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:border-transparent"
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Review period
              </label>
              <select
                value={form.reviewPeriod}
                onChange={(e) => setForm({ ...form, reviewPeriod: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 bg-white"
                disabled={loading}
              >
                <option>Q1</option>
                <option>Q2</option>
                <option>Q3</option>
                <option>Q4</option>
                <option>Annual</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Tone
              </label>
              <select
                value={form.tone}
                onChange={(e) => setForm({ ...form, tone: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 bg-white"
                disabled={loading}
              >
                <option>Professional</option>
                <option>Warm and encouraging</option>
                <option>Direct and concise</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              What did they do well? <span className="text-red-500">*</span>
              <span className="font-normal text-gray-400 ml-1">List 3–5 bullet points</span>
            </label>
            <textarea
              value={form.highlights}
              onChange={(e) => setForm({ ...form, highlights: e.target.value })}
              placeholder={"• Hit quarterly sales targets consistently\n• Led the CRM migration project\n• Mentored two junior team members"}
              rows={5}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 resize-none"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              What should they improve?
              <span className="font-normal text-gray-400 ml-1">1–2 points</span>
            </label>
            <textarea
              value={form.growth}
              onChange={(e) => setForm({ ...form, growth: e.target.value })}
              placeholder={"• Could improve cross-functional communication\n• Delegate more to junior team members"}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 resize-none"
              disabled={loading}
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !canGenerate}
            className="w-full py-3 px-6 rounded-lg text-white font-semibold text-base transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: "#1D9E75" }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Generating review...
              </span>
            ) : (
              "Generate Review"
            )}
          </button>

          {!canGenerate && (
            <div className="border border-gray-200 rounded-xl p-6 mt-4">
              <p className="text-sm text-gray-600 mb-4 font-medium">
                Purchase to generate more reviews:
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="/api/stripe/checkout?type=single"
                  className="flex-1 text-center py-2.5 px-4 rounded-lg border-2 font-semibold text-sm transition-colors hover:opacity-90"
                  style={{ borderColor: "#1D9E75", color: "#1D9E75" }}
                >
                  $9 — One more review
                </a>
                <a
                  href="/api/stripe/checkout?type=subscription"
                  className="flex-1 text-center py-2.5 px-4 rounded-lg text-white font-semibold text-sm transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "#1D9E75" }}
                >
                  $29/month — Unlimited
                </a>
              </div>
            </div>
          )}
        </form>
      </main>
    </div>
  );
}

export default function ReviewGeneratorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center text-gray-400">Loading...</div>}>
      <ReviewGeneratorForm />
    </Suspense>
  );
}
