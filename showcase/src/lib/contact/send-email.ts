import { Resend } from "resend";

const CONTACT_EMAIL_TO = process.env.CONTACT_EMAIL_TO ?? "support@mrfox.com";

const SUBJECT_LABELS: Record<string, string> = {
  general: "General",
  business: "Business Inquiry",
  partnership: "Partnership",
  support: "Support",
};

type ContactEmailPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export async function sendContactEmail(data: ContactEmailPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const from = process.env.CONTACT_EMAIL_FROM ?? "Mr.FOX Contact <onboarding@resend.dev>";
  const subjectLabel = SUBJECT_LABELS[data.subject] ?? data.subject;

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: CONTACT_EMAIL_TO,
    replyTo: data.email,
    subject: `[Mr.FOX Contact] ${subjectLabel} — ${data.name}`,
    text: [
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Subject: ${subjectLabel}`,
      "",
      data.message,
    ].join("\n"),
    html: [
      "<p><strong>Name:</strong> " + escapeHtml(data.name) + "</p>",
      "<p><strong>Email:</strong> " + escapeHtml(data.email) + "</p>",
      "<p><strong>Subject:</strong> " + escapeHtml(subjectLabel) + "</p>",
      "<hr />",
      "<p>" + escapeHtml(data.message).replace(/\n/g, "<br />") + "</p>",
    ].join("\n"),
  });

  if (error) {
    throw new Error(error.message);
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
