interface MailgunConfig {
  apiKey: string;
  apiBaseUrl: string;
  domain: string;
  from: string;
}

function getMailgunConfig(): MailgunConfig {
  const apiKey = process.env.MAILGUN_API_KEY?.trim();
  const domain = process.env.MAILGUN_DOMAIN?.trim();
  if (!apiKey || !domain) {
    throw new Error("Mailgun is not configured.");
  }

  const region = process.env.MAILGUN_REGION?.trim().toLowerCase();
  const apiBaseUrl =
    region === "eu" ? "https://api.eu.mailgun.net" : "https://api.mailgun.net";
  const from =
    process.env.MAILGUN_FROM?.trim() || `AGI Institutions <login@${domain}>`;
  return { apiKey, apiBaseUrl, domain, from };
}

export function assertMailgunConfigured() {
  getMailgunConfig();
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function sendLoginCodeEmail({
  code,
  name,
  to,
}: {
  code: string;
  name: string;
  to: string;
}) {
  const config = getMailgunConfig();
  const form = new FormData();
  form.set("from", config.from);
  form.set("to", to);
  form.set("subject", "Your AGI Institutions sign-in code");
  form.set(
    "text",
    `Hello ${name},\n\nYour AGI Institutions sign-in code is ${code}.\n\nIt expires in 10 minutes. If you did not request this code, you can ignore this email.`
  );
  form.set(
    "html",
    `<p>Hello ${escapeHtml(name)},</p><p>Your AGI Institutions sign-in code is:</p><p style="font-size:28px;font-weight:700;letter-spacing:0.18em">${code}</p><p>It expires in 10 minutes. If you did not request this code, you can ignore this email.</p>`
  );

  const response = await fetch(
    `${config.apiBaseUrl}/v3/${encodeURIComponent(config.domain)}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`api:${config.apiKey}`).toString("base64")}`,
      },
      body: form,
    }
  );
  if (!response.ok) {
    const detail = (await response.text()).slice(0, 300);
    throw new Error(`Mailgun rejected the sign-in email (${response.status}): ${detail}`);
  }
}
