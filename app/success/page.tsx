"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { siteConfig } from "@/config/site-config";

interface StripeSessionSummary {
  customer_email?: string | null;
  amount_total?: number | null;
  metadata?: { service_name?: string } | null;
}

type IntakeState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success" }
  | { status: "error"; message: string };

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [session, setSession] = useState<StripeSessionSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [repoUrl, setRepoUrl] = useState("");
  const [whatBroken, setWhatBroken] = useState("");
  const [intake, setIntake] = useState<IntakeState>({ status: "idle" });

  useEffect(() => {
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

  const submitIntake = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!sessionId) {
      setIntake({ status: "error", message: "Missing session id — reload from your receipt link." });
      return;
    }
    const trimmedRepo = repoUrl.trim();
    const trimmedWhat = whatBroken.trim();
    if (trimmedWhat.length < 10) {
      setIntake({ status: "error", message: "Give us at least a sentence about what's broken (10+ characters)." });
      return;
    }
    try {
      const parsed = new URL(trimmedRepo);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        throw new Error("bad protocol");
      }
    } catch {
      setIntake({ status: "error", message: "Repo URL must start with http:// or https://" });
      return;
    }

    setIntake({ status: "submitting" });
    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          repo_url: trimmedRepo,
          what_broken: trimmedWhat,
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setIntake({
          status: "error",
          message: body.error ?? "Something went wrong. Email vibe@shipkit.io and we'll take it from there.",
        });
        return;
      }
      setIntake({ status: "success" });
    } catch (err) {
      console.error("intake submit failed", err);
      setIntake({
        status: "error",
        message: "Network error. Email vibe@shipkit.io and we'll take it from there.",
      });
    }
  };

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
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center">
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
            Thank you for choosing Vibe Rehab. One quick step and we'll be on it.
          </p>

          {session && (
            <div className="bg-slate-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-slate-900 mb-2">Order Details</h3>
              {session.metadata?.service_name ? (
                <p className="text-sm text-slate-600">
                  Service: {session.metadata.service_name}
                </p>
              ) : null}
              {session.customer_email ? (
                <p className="text-sm text-slate-600">
                  Email: {session.customer_email}
                </p>
              ) : null}
              {typeof session.amount_total === "number" ? (
                <p className="text-sm text-slate-600">
                  Amount: ${(session.amount_total / 100).toFixed(2)}
                </p>
              ) : null}
            </div>
          )}
        </div>

        {intake.status === "success" ? (
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 mb-6 text-left">
            <h2 className="font-semibold text-green-900 mb-2">Intake received</h2>
            <p className="text-sm text-green-800">
              Thanks — we have your repo and the problem description. Expect a reply within 24 hours at {session?.customer_email ?? "your email"}.
            </p>
          </div>
        ) : (
          <form onSubmit={submitIntake} className="space-y-4 mb-6 text-left">
            <div>
              <h2 className="font-semibold text-slate-900 mb-1">
                Tell us what to fix
              </h2>
              <p className="text-sm text-slate-600 mb-3">
                Two quick fields so we can start immediately instead of waiting on a reply.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="intake-repo">
                Repo or project URL
              </Label>
              <Input
                id="intake-repo"
                type="url"
                required
                inputMode="url"
                autoComplete="url"
                placeholder="https://github.com/you/your-repo"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                disabled={intake.status === "submitting"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="intake-what">What's broken?</Label>
              <Textarea
                id="intake-what"
                required
                minLength={10}
                maxLength={5000}
                rows={5}
                placeholder="Auth is broken on prod, users see a 500 after login. Started after we deployed on Tuesday..."
                value={whatBroken}
                onChange={(e) => setWhatBroken(e.target.value)}
                disabled={intake.status === "submitting"}
              />
              <p className="text-xs text-slate-500">
                Errors, symptoms, what you already tried — anything useful.
              </p>
            </div>
            {intake.status === "error" ? (
              <p className="text-sm text-red-600" role="alert">
                {intake.message}
              </p>
            ) : null}
            <Button
              type="submit"
              className="w-full bg-slate-900 text-white hover:bg-slate-800"
              disabled={intake.status === "submitting"}
            >
              {intake.status === "submitting" ? "Sending..." : "Send intake"}
            </Button>
            <p className="text-xs text-slate-500 text-center">
              Prefer email? Reply to your receipt or write to vibe@shipkit.io.
            </p>
          </form>
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

        <div className="text-center">
          <a
            href={siteConfig.url}
            className="inline-flex items-center px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
