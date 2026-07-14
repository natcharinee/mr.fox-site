"use client";

import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Building2,
  Clock,
  Handshake,
  Headphones,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassCard, VulpineSectionHeader } from "@/components/vulpine/vulpine-primitives";
import { publicTheme, pageWidth } from "@/components/layout/public-theme";
import { MRFOX_MAP_LINK } from "@/lib/contact/map";
import { submitContactForm } from "@/lib/contact/actions";
import {
  ContactGuideCard,
  type ContactGuideContent,
} from "@/components/contact/contact-guide-card";
import { ContactMapCard } from "@/components/contact/contact-map-card";
import { SocialLinkButton } from "@/components/contact/social-platform-icon";
import { MRFOX_SOCIAL_LINKS } from "@/lib/contact/social-links";
import { cn } from "@/lib/utils";

type ContactSubject = "general" | "business" | "partnership" | "support";

type ContactState = { submitted?: boolean; error?: string } | null;

type PathwayItem = {
  id: ContactSubject;
  title: string;
  description: string;
};

type HelpItem = {
  title: string;
  description: string;
};

const PATHWAY_ICONS: Record<ContactSubject, typeof Building2> = {
  business: Building2,
  partnership: Handshake,
  support: Headphones,
  general: MessageSquare,
};

const PATHWAY_ACCENTS: Record<ContactSubject, string> = {
  business:
    "border-[var(--vulpine-primary-container)]/35 bg-[var(--vulpine-primary-container)]/10 text-[var(--vulpine-primary-container)]",
  partnership:
    "border-[var(--vulpine-primary-container)]/30 bg-[var(--vulpine-primary-container)]/8 text-[var(--vulpine-primary)]",
  support:
    "border-[var(--vulpine-primary-container)]/25 bg-[var(--vulpine-primary-container)]/6 text-[var(--vulpine-primary)]",
  general: "border-white/15 bg-white/5 text-white/70",
};

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

export function ContactPageContent({
  guide,
  embedded = false,
}: {
  guide: ContactGuideContent;
  embedded?: boolean;
}) {
  const t = useTranslations("contact");
  const [subject, setSubject] = useState<ContactSubject>("general");
  const [state, formAction, pending] = useActionState(contactAction, null);

  const pathways = t.raw("pathwayItems") as PathwayItem[];
  const helpItems = t.raw("help.items") as HelpItem[];

  function selectPathway(id: ContactSubject) {
    setSubject(id);
  }

  return (
    <div
      id={embedded ? "contact" : undefined}
      className={cn(
        embedded
          ? "mt-16 scroll-mt-24 border-t border-white/5 pt-16 md:mt-20 md:pt-20"
          : cn(pageWidth, "py-12 md:py-16"),
      )}
    >
      {embedded ? (
        <VulpineSectionHeader
          eyebrow={t("formEyebrow")}
          title={t("title")}
          description={t("subtitle")}
          className="mb-10"
        />
      ) : null}
      <div className="grid gap-8 lg:grid-cols-5 lg:gap-10">
        <div className="space-y-8 lg:col-span-3">
        <GlassCard className="p-6 sm:p-8">
          <div className="mb-6 border-b border-white/8 pb-6">
            <p className="vulpine-label mb-2 text-[var(--vulpine-primary-container)]">
              {t("formEyebrow")}
            </p>
            <h2 className="font-display text-xl font-bold uppercase text-[var(--vulpine-on-surface)] sm:text-2xl">
              {t("formTitle")}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--vulpine-on-surface-variant)] sm:text-base">
              {t("formDesc")}
            </p>
          </div>

          {state?.submitted ? (
            <div className="rounded-2xl border border-[var(--vulpine-primary-container)]/30 bg-[var(--vulpine-primary-container)]/10 px-5 py-8 text-center">
              <p className="font-display text-lg font-bold text-[var(--vulpine-primary-container)]">
                {t("success")}
              </p>
            </div>
          ) : (
            <form action={formAction} className="space-y-5">
              {state?.error ? (
                <p className="text-sm text-destructive">{t("error")}</p>
              ) : null}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className={publicTheme.label}>
                    {t("name")}
                  </label>
                  <Input id="name" name="name" required className={`mt-1.5 ${publicTheme.input}`} />
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
                    className={`mt-1.5 ${publicTheme.input}`}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className={publicTheme.label}>
                  {t("subject")}
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  value={subject}
                  onChange={(event) => setSubject(event.target.value as ContactSubject)}
                  className={`mt-1.5 w-full ${publicTheme.select}`}
                >
                  <option value="general">{t("subjectGeneral")}</option>
                  <option value="business">{t("subjectBusiness")}</option>
                  <option value="partnership">{t("subjectPartnership")}</option>
                  <option value="support">{t("subjectSupport")}</option>
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
                  rows={5}
                  className={`mt-1.5 w-full ${publicTheme.textarea}`}
                />
              </div>
              <Button type="submit" disabled={pending} className={publicTheme.submitButton}>
                {pending ? t("sending") : t("submit")}
              </Button>
            </form>
          )}
        </GlassCard>

        <div className="grid gap-4 sm:grid-cols-2">
          {pathways.map((item) => {
            const Icon = PATHWAY_ICONS[item.id];
            const active = subject === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => selectPathway(item.id)}
                className="text-left"
              >
                <GlassCard
                  className={cn(
                    "h-full p-5 transition-all vulpine-glow-hover",
                    active
                      ? "border-[var(--vulpine-primary-container)]/50 shadow-[0_0_24px_rgba(255,184,0,0.12)]"
                      : "hover:border-white/20",
                  )}
                >
                  <div
                    className={cn(
                      "mb-4 flex size-12 items-center justify-center rounded-2xl border",
                      PATHWAY_ACCENTS[item.id],
                    )}
                  >
                    <Icon className="size-5" aria-hidden />
                  </div>
                  <h3 className="font-display text-sm font-bold uppercase tracking-wide text-[var(--vulpine-on-surface)] sm:text-base">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--vulpine-on-surface-variant)]">
                    {item.description}
                  </p>
                </GlassCard>
              </button>
            );
          })}
        </div>

        <ContactGuideCard content={guide} />
        </div>

        <aside className="flex flex-col gap-5 lg:col-span-2">
          <GlassCard className="p-6">
            <p className="vulpine-label mb-2 text-[var(--vulpine-primary-container)]">
              {t("direct.eyebrow")}
            </p>
            <h3 className="font-display text-lg font-bold uppercase text-[var(--vulpine-on-surface)]">
              {t("direct.title")}
            </h3>
            <ul className="mt-5 space-y-4">
              <ContactDetail
                icon={Mail}
                label={t("direct.emailLabel")}
                value={t("direct.emailValue")}
                href={t("direct.emailHref")}
              />
              <ContactDetail
                icon={Phone}
                label={t("direct.phoneLabel")}
                value={t("direct.phoneValue")}
                href={t("direct.phoneHref")}
              />
              <ContactDetail icon={Clock} label={t("direct.hoursLabel")} value={t("direct.hoursValue")} />
              <ContactDetail
                icon={MapPin}
                label={t("direct.addressLabel")}
                value={t("direct.addressValue")}
                href={MRFOX_MAP_LINK}
                external
              />
            </ul>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="font-display text-base font-bold uppercase text-[var(--vulpine-on-surface)]">
              {t("response.title")}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--vulpine-on-surface-variant)]">
              {t("response.desc")}
            </p>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="font-display text-base font-bold uppercase text-[var(--vulpine-on-surface)]">
              {t("social.title")}
            </h3>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {MRFOX_SOCIAL_LINKS.map((item) => (
                <SocialLinkButton
                  key={item.id}
                  platform={item.id}
                  label={item.label}
                  href={item.href}
                />
              ))}
            </div>
          </GlassCard>

          <ContactMapCard className="flex-1" />
        </aside>
      </div>

      <section className="mt-16 border-t border-white/5 pt-16 md:mt-20">
        <VulpineSectionHeader
          eyebrow={t("help.eyebrow")}
          title={t("help.title")}
          description={t("help.subtitle")}
        />
        <div className="grid gap-4 md:grid-cols-2">
          {helpItems.map((item) => (
            <GlassCard key={item.title} className="p-5 sm:p-6">
              <h3 className="font-display text-base font-bold text-[var(--vulpine-on-surface)]">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--vulpine-on-surface-variant)]">
                {item.description}
              </p>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <GlassCard className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="vulpine-label mb-2 text-[var(--vulpine-primary-container)]">
              {t("office.eyebrow")}
            </p>
            <h3 className="font-display text-lg font-bold uppercase text-[var(--vulpine-on-surface)]">
              {t("office.company")}
            </h3>
            <p className="mt-2 text-sm text-[var(--vulpine-on-surface-variant)]">
              <a
                href={MRFOX_MAP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(publicTheme.link, "hover:underline")}
              >
                {t("office.address")}
              </a>
            </p>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-[var(--vulpine-on-surface-variant)]">
            {t("office.note")}
          </p>
        </GlassCard>
      </section>
    </div>
  );
}

function ContactDetail({
  icon: Icon,
  label,
  value,
  href,
  external,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}) {
  const content = href ? (
    <a
      href={href}
      className={cn(
        "mt-0.5 inline-block text-sm transition-colors hover:underline",
        publicTheme.link,
      )}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {value}
    </a>
  ) : (
    <p className="mt-0.5 text-sm text-[var(--vulpine-on-surface)]">{value}</p>
  );

  return (
    <li className="flex gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[var(--vulpine-primary-container)]">
        <Icon className="size-4" aria-hidden />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium uppercase tracking-wide text-[var(--vulpine-on-surface-variant)]">
          {label}
        </p>
        {content}
      </div>
    </li>
  );
}
