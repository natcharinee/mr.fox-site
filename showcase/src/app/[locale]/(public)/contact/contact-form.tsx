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
    <div className={publicTheme.pageGrid}>
      <div className="grid gap-8 lg:grid-cols-2">
        <Card className={themedCard()}>
          <CardHeader>
            <CardTitle className={publicTheme.cardTitle}>{t("formTitle")}</CardTitle>
            <CardDescription className={publicTheme.cardDescription}>
              {t("formDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {state?.submitted ? (
              <p className="text-sm font-medium text-[var(--vulpine-primary)]">
                {t("success")}
              </p>
            ) : (
              <form action={formAction} className="space-y-4">
                {state?.error ? (
                  <p className="text-sm text-destructive">{t("error")}</p>
                ) : null}
                <div>
                  <label htmlFor="name" className={publicTheme.label}>
                    {t("name")}
                  </label>
                  <Input id="name" name="name" required className={`mt-1 ${publicTheme.input}`} />
                </div>
                <div>
                  <label htmlFor="email" className={publicTheme.label}>
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
                  <label htmlFor="subject" className={publicTheme.label}>
                    {t("subject")}
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    className={`mt-1 w-full ${publicTheme.select}`}
                  >
                    <option value="general">{t("subjectGeneral")}</option>
                    <option value="business">{t("subjectBusiness")}</option>
                    <option value="partnership">{t("subjectPartnership")}</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className={publicTheme.label}>
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
                <Button type="submit" disabled={pending} className={publicTheme.submitButton}>
                  {pending ? t("sending") : t("submit")}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className={themedCard()}>
            <CardHeader>
              <CardTitle className={`text-base ${publicTheme.cardTitle}`}>
                {t("businessInquiry")}
              </CardTitle>
              <CardDescription className={publicTheme.cardDescription}>
                {t("businessInquiryDesc")}
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className={themedCard()}>
            <CardHeader>
              <CardTitle className={`text-base ${publicTheme.cardTitle}`}>
                {t("partnership")}
              </CardTitle>
              <CardDescription className={publicTheme.cardDescription}>
                {t("partnershipDesc")}
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className={themedCard()}>
            <CardHeader>
              <CardTitle className={`text-base ${publicTheme.cardTitle}`}>
                {t("social")}
              </CardTitle>
              <CardDescription className={publicTheme.cardDescription}>
                {t("socialDesc")}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}
