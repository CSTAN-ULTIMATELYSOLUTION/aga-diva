import { Resend } from "resend";

type EmailRequestBody = {
  applicantEmail?: string;
  employeeName?: string;
  html?: string;
  text?: string;
};

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const cleanEmail = (value?: string) => {
  const email = (value || "").trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : "";
};

const splitEmails = (value?: string) =>
  (value || "")
    .split(",")
    .map((email) => cleanEmail(email))
    .filter(Boolean);

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const bcc = splitEmails(process.env.RESEND_BCC_EMAIL);

  if (!apiKey || !from) {
    console.error("Missing Resend environment variables");
    return json({ error: "Missing Resend environment variables" }, 500);
  }

  let body: EmailRequestBody;

  try {
    body = (await request.json()) as EmailRequestBody;
  } catch (error) {
    console.error("Invalid email request body", error);
    return json({ error: "Invalid request body" }, 400);
  }

  if (!body.html || !body.text) {
    return json({ error: "Missing email report content" }, 400);
  }

  const applicantEmail = cleanEmail(body.applicantEmail);

  if (!applicantEmail) {
    return json({ error: "Missing valid applicant email" }, 400);
  }

  const employeeName = (body.employeeName || "New team member").trim();
  const resend = new Resend(apiKey);

  const { data, error } = await resend.emails.send({
    from,
    to: applicantEmail,
    bcc: bcc.length ? bcc : undefined,
    replyTo: applicantEmail,
    subject: `Diva Onboarding Submission - ${employeeName}`,
    html: body.html,
    text: body.text,
  });

  if (error) {
    console.error("Resend email failed", error);
    return json({ error: "Email send failed" }, 502);
  }

  return json({ ok: true, id: data?.id });
}
