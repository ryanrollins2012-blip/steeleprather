"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ReviewOutputPage() {
  const router = useRouter();
  const [review, setReview] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [copied, setCopied] = useState(false);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    const storedReview = sessionStorage.getItem("prg_review");
    const storedName = sessionStorage.getItem("prg_employee");

    if (!storedReview) {
      router.replace("/review-generator");
      return;
    }

    setReview(storedReview);
    setEmployeeName(storedName || "");
    setHasSubscription(localStorage.getItem("prg_subscription") === "true");
    setCredits(parseInt(localStorage.getItem("prg_credits") || "0", 10));
  }, [router]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(review);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = review;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  const showPaymentOptions = !hasSubscription && credits === 0;

  if (!review) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-400 text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-semibold text-gray-900">
            steeleprather.com
          </Link>
          <span className="text-sm text-gray-400">Performance Review Generator</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Success header */}
        <div className="mb-8">
          <div
            className="inline-flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-full mb-4"
            style={{ backgroundColor: "#e8f7f2", color: "#1D9E75" }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Review generated
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {employeeName ? `${employeeName}'s Performance Review` : "Your Performance Review"}
          </h1>
        </div>

        {/* Review text box */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-4 relative">
          <div className="prose prose-sm max-w-none">
            {review.split("\n\n").map((paragraph, i) => (
              <p key={i} className="text-gray-700 leading-relaxed mb-4 last:mb-0 text-sm">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mb-10">
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-opacity hover:opacity-90 text-white"
            style={{ backgroundColor: copied ? "#178a64" : "#1D9E75" }}
          >
            {copied ? (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy to clipboard
              </>
            )}
          </button>

          <Link
            href="/review-generator"
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Generate another review
          </Link>
        </div>

        {/* Upsell section */}
        {showPaymentOptions ? (
          <div className="border border-gray-200 rounded-xl p-6">
            <p className="text-sm text-gray-600 mb-1">
              This review was generated free.
            </p>
            <p className="text-sm text-gray-500 mb-5">
              To generate more reviews, upgrade to $29/month unlimited or pay $9 for your next one.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="/api/stripe/checkout?type=single"
                className="flex-1 text-center py-2.5 px-4 rounded-lg border-2 font-semibold text-sm transition-opacity hover:opacity-90"
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
        ) : (
          <div
            className="rounded-xl px-5 py-4 text-sm"
            style={{ backgroundColor: "#e8f7f2", color: "#178a64" }}
          >
            {hasSubscription
              ? "You have unlimited reviews on your active subscription."
              : `You have ${credits} paid review${credits > 1 ? "s" : ""} remaining.`}
          </div>
        )}
      </main>
    </div>
  );
}
