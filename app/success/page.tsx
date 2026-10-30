"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { siteConfig } from "@/config/site-config";
import { isCheckoutSessionId } from "@/lib/checkout-session-id";
import type { CheckoutSessionSummary } from "@/lib/checkout-session-summary";

const SUPPORT_EMAIL = "vibe@shipkit.io";

const formatAmount = (amountTotal: number, currency: string | null): string => {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: (currency ?? "usd").toUpperCase(),
    }).format(amountTotal / 100);
  } catch {
    return `$${(amountTotal / 100).toFixed(2)}`;
  }
};

type IntakeState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success" }
  | { status: "error"; message: string };

const PageShell = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
    <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-8">{children}</div>
  </div>
);

// No session id means there is no order to confirm, so the page says that
// instead of claiming a payment that may never have happened.
const OrderNotFound = () => (
  <PageShell>
    <div className="text-center">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg
          className="w-8 h-8 text-slate-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      </div>

      <h1 className="text-2xl font-bold text-slate-900 mb-4">We can&apos;t find that order</h1>

      <p className="text-slate-600 mb-6">
        Your receipt email has a link to this page that carries your order with it. Open that
        link and the intake form will be waiting.
      </p>

      <a
        href={siteConfig.url}
        className="inline-flex items-center px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
      >
        Back to Vibe Rehab
      </a>

      <p className="text-xs text-slate-500 mt-6">
        Just paid and the link is not working? Write to{" "}
        <a href={`mailto:${SUPPORT_EMAIL}`} className="underline">
          {SUPPORT_EMAIL}
        </a>{" "}
        and we will start without it.
      </p>
    </div>
  </PageShell>
);

const PaidOrder = ({ sessionId }: { sessionId: string }) => {
  const [session, setSession] = useState<CheckoutSessionSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [repoUrl, setRepoUrl] = useState("");
  const [whatBroken, setWhatBroken] = useState("");
  const [intake, setIntake] = useState<IntakeState>({ status: "idle" });
  const customerEmail = session?.customer_email ?? null;
  // Nothing to show means no empty card.
  const orderDetails =
    session &&
    (session.service_name || session.customer_email || typeof session.amount_total === "number")
      ? session
      : null;

  useEffect(() => {
    fetch(`/api/checkout-session?session_id=${encodeURIComponent(sessionId)}`)
      .then(async (res) => {
        // A session we cannot read is not worth an error on this page: the
        // payment already went through and the intake form works without it.
        if (!res.ok) return null;
        return (await res.json()) as CheckoutSessionSummary;
      })
      .then((data) => {
        setSession(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching session:", err);
        setLoading(false);
      });
  }, [sessionId]);

  const submitIntake = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
          message: body.error ?? `Something went wrong. Email ${SUPPORT_EMAIL} and we'll take it from there.`,
        });
        return;
      }
      setIntake({ status: "success" });
    } catch (err) {
      console.error("intake submit failed", err);
      setIntake({
        status: "error",
        message: `Network error. Email ${SUPPORT_EMAIL} and we'll take it from there.`,
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
    <PageShell>
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-4">Payment Successful!</h1>

        <p className="text-slate-600 mb-6">
          Thank you for choosing Vibe Rehab. One quick step and we&apos;ll be on it.
        </p>

        {orderDetails && (
          <div className="bg-slate-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-slate-900 mb-2">Order Details</h3>
            {orderDetails.service_name ? (
              <p className="text-sm text-slate-600">Service: {orderDetails.service_name}</p>
            ) : null}
            {customerEmail ? <p className="text-sm text-slate-600">Email: {customerEmail}</p> : null}
            {typeof orderDetails.amount_total === "number" ? (
              <p className="text-sm text-slate-600">
                Amount: {formatAmount(orderDetails.amount_total, orderDetails.currency)}
              </p>
            ) : null}
          </div>
        )}
      </div>

      {intake.status === "success" ? (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 mb-6 text-left">
          <h2 className="font-semibold text-green-900 mb-2">Intake received</h2>
          <p className="text-sm text-green-800">
            Thanks — we have your repo and the problem description. Expect a reply within 24 hours at {customerEmail ?? "your email"}.
          </p>
        </div>
      ) : (
        <form onSubmit={submitIntake} className="space-y-4 mb-6 text-left">
          <div>
            <h2 className="font-semibold text-slate-900 mb-1">Tell us what to fix</h2>
            <p className="text-sm text-slate-600 mb-3">
              Two quick fields so we can start immediately instead of waiting on a reply.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="intake-repo">Repo or project URL</Label>
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
            <Label htmlFor="intake-what">What&apos;s broken?</Label>
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
            Prefer email? Reply to your receipt or write to {SUPPORT_EMAIL}.
          </p>
        </form>
      )}

      <div className="bg-slate-50 rounded-lg p-4 mb-6">
        <h2 className="font-semibold text-slate-900 mb-2">What happens next?</h2>
        <ul className="text-sm text-slate-600 space-y-1 text-left">
          <li>• We&apos;ll reach out within 24 hours</li>
          <li>• Quick project assessment &amp; timeline</li>
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
    </PageShell>
  );
};

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  // The receipt link is the only evidence this page has that an order exists.
  if (!isCheckoutSessionId(sessionId)) return <OrderNotFound />;

  return <PaidOrder sessionId={sessionId} />;
}
