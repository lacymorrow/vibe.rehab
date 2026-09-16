const trimTrailingSlash = (value: string): string => value.replace(/\/+$/, "");

const normalizeBaseUrl = (raw: string): string => {
  const trimmed = trimTrailingSlash(raw.trim());
  return trimmed.endsWith("/api") ? trimmed.slice(0, -"/api".length) : trimmed;
};

interface PaperclipEnv {
  base: string;
  apiKey: string;
  companyId: string;
  assigneeAgentId?: string;
}

const readPaperclipEnv = (): PaperclipEnv | { error: string } => {
  const apiUrl = process.env.PAPERCLIP_API_URL;
  const apiKey = process.env.PAPERCLIP_API_KEY;
  const companyId = process.env.PAPERCLIP_COMPANY_ID;
  if (!apiUrl || !apiKey || !companyId) {
    return {
      error:
        "PAPERCLIP_API_URL, PAPERCLIP_API_KEY, and PAPERCLIP_COMPANY_ID must be configured",
    };
  }
  return {
    base: normalizeBaseUrl(apiUrl),
    apiKey,
    companyId,
    assigneeAgentId:
      process.env.PAPERCLIP_SALES_ASSIGNEE_AGENT_ID?.trim() || undefined,
  };
};

interface CreateIssueInput {
  title: string;
  description: string;
  priority?: "low" | "medium" | "high";
}

interface CreateIssueResult {
  ok: boolean;
  identifier?: string;
  id?: string;
  status: number;
  error?: string;
}

async function createIssue(input: CreateIssueInput): Promise<CreateIssueResult> {
  const env = readPaperclipEnv();
  if ("error" in env) {
    return { ok: false, status: 0, error: env.error };
  }

  const body: Record<string, unknown> = {
    title: input.title,
    description: input.description,
    priority: input.priority ?? "high",
  };
  if (env.assigneeAgentId) {
    body.assigneeAgentId = env.assigneeAgentId;
  }

  try {
    const response = await fetch(
      `${env.base}/api/companies/${env.companyId}/issues`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );
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
    return {
      ok: true,
      status: response.status,
      id: parsed.id,
      identifier: parsed.identifier,
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export interface FileSaleIssueInput {
  tierName: string;
  tierKey: string;
  amountLabel: string;
  customerEmail: string;
  stripeSessionId: string;
  livemode: boolean;
}

export type FileSaleIssueResult = CreateIssueResult;

export async function fileSaleIssue(
  input: FileSaleIssueInput,
): Promise<FileSaleIssueResult> {
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

  return createIssue({
    title: `SALE: ${input.tierName} — ${input.customerEmail}`,
    description,
    priority: "high",
  });
}

export interface FileIntakeIssueInput {
  tierName: string;
  tierKey: string;
  customerEmail: string;
  stripeSessionId: string;
  livemode: boolean;
  repoUrl: string;
  whatBroken: string;
}

export type FileIntakeIssueResult = CreateIssueResult;

export async function fileIntakeIssue(
  input: FileIntakeIssueInput,
): Promise<FileIntakeIssueResult> {
  const modeTag = input.livemode ? "LIVE" : "TEST";
  const description = [
    `Intake submitted after checkout for **${input.tierName}**.`,
    "",
    `- Customer email: ${input.customerEmail}`,
    `- Repo / project URL: ${input.repoUrl}`,
    `- Tier: ${input.tierName} (${input.tierKey})`,
    `- Stripe mode: ${modeTag}`,
    `- Stripe session: \`${input.stripeSessionId}\` (matches SALE issue)`,
    "",
    "## What's broken (customer words)",
    "",
    input.whatBroken,
    "",
    "## Next steps",
    "- Link this to the matching SALE issue by Stripe session id.",
    "- Reach out to the customer within 24h.",
  ].join("\n");

  return createIssue({
    title: `INTAKE: ${input.customerEmail} — ${input.tierName}`,
    description,
    priority: "high",
  });
}
