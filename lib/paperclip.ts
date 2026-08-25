const trimTrailingSlash = (value: string): string => value.replace(/\/+$/, "");

const normalizeBaseUrl = (raw: string): string => {
  const trimmed = trimTrailingSlash(raw.trim());
  return trimmed.endsWith("/api") ? trimmed.slice(0, -"/api".length) : trimmed;
};

export interface FileSaleIssueInput {
  tierName: string;
  tierKey: string;
  amountLabel: string;
  customerEmail: string;
  stripeSessionId: string;
  livemode: boolean;
}

export interface FileSaleIssueResult {
  ok: boolean;
  identifier?: string;
  id?: string;
  status: number;
  error?: string;
}

export async function fileSaleIssue(input: FileSaleIssueInput): Promise<FileSaleIssueResult> {
  const apiUrl = process.env.PAPERCLIP_API_URL;
  const apiKey = process.env.PAPERCLIP_API_KEY;
  const companyId = process.env.PAPERCLIP_COMPANY_ID;

  if (!apiUrl || !apiKey || !companyId) {
    return {
      ok: false,
      status: 0,
      error: "PAPERCLIP_API_URL, PAPERCLIP_API_KEY, and PAPERCLIP_COMPANY_ID must be configured",
    };
  }

  const base = normalizeBaseUrl(apiUrl);
  const assigneeAgentId = process.env.PAPERCLIP_SALES_ASSIGNEE_AGENT_ID?.trim() || undefined;
  const modeTag = input.livemode ? "LIVE" : "TEST";

  const description = [
    `A vibe.rehab customer purchased **${input.tierName}** (${input.amountLabel}).`,
    "",
    `- Customer email: ${input.customerEmail}`,
    `- Tier: ${input.tierName} (${input.tierKey})`,
    `- Amount: ${input.amountLabel}`,
    `- Stripe mode: ${modeTag}`,
    `- Stripe session: \`${input.stripeSessionId}\``,
    "",
    "## Next steps",
    "- Reach out to the customer within 24h to kick off intake.",
    "- Confirm scope, collect repo/site URL and description of the issue.",
    "- Track fulfillment through completion.",
  ].join("\n");

  const body: Record<string, unknown> = {
    title: `SALE: ${input.tierName} — ${input.customerEmail}`,
    description,
    priority: "high",
  };
  if (assigneeAgentId) {
    body.assigneeAgentId = assigneeAgentId;
  }

  try {
    const response = await fetch(`${base}/api/companies/${companyId}/issues`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const text = await response.text();
    if (!response.ok) {
      return { ok: false, status: response.status, error: text.slice(0, 500) };
    }
    let parsed: { id?: string; identifier?: string } = {};
    try {
      parsed = JSON.parse(text);
    } catch {
      // ignore parse errors, return status only
    }
    return { ok: true, status: response.status, id: parsed.id, identifier: parsed.identifier };
  } catch (error) {
    return { ok: false, status: 0, error: error instanceof Error ? error.message : String(error) };
  }
}
