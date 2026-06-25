"use server";

import { z } from "zod";
import { logAudit } from "@/lib/audit";
import { sendContactEmail } from "@/lib/contact/send-email";

const contactSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(320),
  subject: z.enum(["general", "business", "partnership", "support"]),
  message: z.string().min(1).max(5000),
});

export async function submitContactForm(formData: FormData) {
  const data = contactSchema.parse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  });

  const details = JSON.stringify(data);

  await sendContactEmail(data);
  await logAudit(null, "contact_submit", "contact", undefined, details);

  const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
  if (webhookUrl) {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "mrfox-showcase-contact",
        ...data,
        submittedAt: new Date().toISOString(),
      }),
    });
  }
}
