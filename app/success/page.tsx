"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site-config";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set document title for SEO
    document.title = "Success - Payment Confirmed | Vibe Rehab";

    if (sessionId) {
      fetch(`/api/checkout-session?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          setSession(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching session:", err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-4">
          Payment Successful!
        </h1>

        <p className="text-slate-600 mb-6">
          Thank you for choosing Vibe Rehab. We've received your payment and
          will get started on fixing your code right away.
        </p>

        {session && (
          <div className="bg-slate-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-slate-900 mb-2">Order Details</h3>
            <p className="text-sm text-slate-600">
              Service: {session.metadata?.service_name}
            </p>
            <p className="text-sm text-slate-600">
              Email: {session.customer_email}
            </p>
            <p className="text-sm text-slate-600">
              Amount: ${(session.amount_total / 100).toFixed(2)}
            </p>
          </div>
        )}

        <div className="bg-slate-50 rounded-lg p-4 mb-6">
          <h2 className="font-semibold text-slate-900 mb-2">
            What happens next?
          </h2>
          <ul className="text-sm text-slate-600 space-y-1 text-left">
            <li>• We'll reach out within 24 hours</li>
            <li>• Quick project assessment & timeline</li>
            <li>• Start fixing your code immediately</li>
            <li>• Regular progress updates</li>
          </ul>
        </div>

        <a
          href={siteConfig.url}
          className="inline-flex items-center px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
}
