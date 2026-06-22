"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { publicTheme, themedCard } from "@/components/layout/public-theme";
import { submitContactForm } from "@/lib/contact/actions";

type ContactState = { submitted?: boolean; error?: string } | null;

async function contactAction(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  try {
    await submitContactForm(formData);
    return { submitted: true };
  } catch {
    return { error: "submit_failed" };
  }
}

export function ContactForm() {
  const t = useTranslations("contact");
  const [state, formAction, pending] = useActionState(contactAction, null);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <Card className={themedCard()}>
          <CardHeader>
            <CardTitle className="text-[var(--fox-charcoal)]">{t("formTitle")}</CardTitle>
            <CardDescription>{t("formDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            {state?.submitted ? (
              <p className="text-sm font-medium text-[var(--fox-gold-dark)]">{t("success")}</p>
            ) : (
              <form action={formAction} className="space-y-4">
                {state?.error ? (
                  <p className="text-sm text-destructive">{t("error")}</p>
                ) : null}
                <div>
                  <label htmlFor="name" className="text-sm font-medium text-[var(--fox-charcoal)]">
                    {t("name")}
                  </label>
                  <Input id="name" name="name" required className={`mt-1 ${publicTheme.input}`} />
                </div>
                <div>
                  <label htmlFor="email" className="text-sm font-medium text-[var(--fox-charcoal)]">
                    {t("email")}
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className={`mt-1 ${publicTheme.input}`}
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="text-sm font-medium text-[var(--fox-charcoal)]">
                    {t("subject")}
                  </label>
                  <select id="subject" name="subject" required className={`mt-1 w-full ${publicTheme.select}`}>
                    <option value="general">{t("subjectGeneral")}</option>
                    <option value="business">{t("subjectBusiness")}</option>
                    <option value="partnership">{t("subjectPartnership")}</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="text-sm font-medium text-[var(--fox-charcoal)]">
                    {t("message")}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    className={`mt-1 w-full ${publicTheme.textarea}`}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={pending}
                  className="bg-[var(--fox-gold)] text-[var(--fox-charcoal)] hover:bg-[var(--fox-gold-dark)]"
                >
                  {pending ? t("sending") : t("submit")}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className={themedCard()}>
            <CardHeader>
              <CardTitle className="text-base text-[var(--fox-charcoal)]">{t("businessInquiry")}</CardTitle>
              <CardDescription>{t("businessInquiryDesc")}</CardDescription>
            </CardHeader>
          </Card>
          <Card className={themedCard()}>
            <CardHeader>
              <CardTitle className="text-base text-[var(--fox-charcoal)]">{t("partnership")}</CardTitle>
              <CardDescription>{t("partnershipDesc")}</CardDescription>
            </CardHeader>
          </Card>
          <Card className={themedCard()}>
            <CardHeader>
              <CardTitle className="text-base text-[var(--fox-charcoal)]">{t("social")}</CardTitle>
              <CardDescription>{t("socialDesc")}</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}
