import { type NextRequest, NextResponse } from "next/server";

/**
 * Contact-form health check (LAC-3573).
 *
 * Verifies the configuration that historically takes the contact form down —
 * a missing/revoked Resend key — WITHOUT sending a real email. A daily CI job
 * (see .github/workflows/contact-form-healthcheck.yml) hits this endpoint and
 * pages us the moment any check fails.
 *
 * Optionally gated by HEALTHCHECK_TOKEN: if that env var is set, callers must
 * pass ?token=... or an "x-healthcheck-token" header. If it is unset, the
 * endpoint is open (so monitoring keeps working even before the token exists).
 */

const RESEND_DOMAINS_URL = "https://api.resend.com/domains";

interface Check {
	name: string;
	ok: boolean;
	detail: string;
}

function isAuthorized(request: NextRequest): boolean {
	const expected = process.env.HEALTHCHECK_TOKEN;
	if (!expected) return true;
	const header = request.headers.get("x-healthcheck-token");
	const query = new URL(request.url).searchParams.get("token");
	return header === expected || query === expected;
}

async function checkResend(): Promise<Check> {
	const key = process.env.RESEND_API_KEY;
	if (!key) {
		return { name: "resend_api_key", ok: false, detail: "RESEND_API_KEY not set" };
	}
	try {
		const response = await fetch(RESEND_DOMAINS_URL, {
			headers: { Authorization: `Bearer ${key}` },
		});
		if (response.status === 401 || response.status === 403) {
			return {
				name: "resend_api_key",
				ok: false,
				detail: `Resend rejected key (HTTP ${response.status})`,
			};
		}
		if (!response.ok) {
			return {
				name: "resend_api_key",
				ok: false,
				detail: `Resend API unhealthy (HTTP ${response.status})`,
			};
		}
		return { name: "resend_api_key", ok: true, detail: "valid" };
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		return {
			name: "resend_api_key",
			ok: false,
			detail: `Resend request failed: ${message}`,
		};
	}
}

export async function GET(request: NextRequest) {
	if (!isAuthorized(request)) {
		return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
	}

	const checks: Check[] = [];
	const hasResend = Boolean(process.env.RESEND_API_KEY);

	checks.push({
		name: "email_provider_configured",
		ok: hasResend,
		detail: hasResend ? "resend" : "RESEND_API_KEY not set",
	});

	if (hasResend) {
		checks.push(await checkResend());
	}

	const ok = checks.every((c) => c.ok);
	return NextResponse.json(
		{ ok, checks },
		{
			status: ok ? 200 : 503,
			headers: { "Cache-Control": "no-store, max-age=0" },
		},
	);
}
