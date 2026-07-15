"use client";

import { useActionState, useEffect, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ActionState = {
  ok: boolean;
  message?: string;
  error?: string;
} | null;

type Props = {
  action: (formData: FormData) => Promise<void>;
  successMessage?: string;
  successHref?: string;
  successLinkLabel?: string;
  className?: string;
  children: ReactNode;
};

export function AdminSaveForm({
  action,
  successMessage = "บันทึกสำเร็จแล้ว",
  successHref,
  successLinkLabel = "ไปหน้ารวม",
  className,
  children,
}: Props) {
  const router = useRouter();

  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    async (_prev, formData) => {
      try {
        await action(formData);
        return { ok: true, message: successMessage };
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "บันทึกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง";
        return { ok: false, error: message };
      }
    },
    null,
  );

  useEffect(() => {
    if (!state) return;

    if (state.ok) {
      toast.success(state.message ?? successMessage);
      const timer = window.setTimeout(() => router.refresh(), 400);
      return () => window.clearTimeout(timer);
    }

    toast.error(state.error ?? "บันทึกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
  }, [state, successMessage, router]);

  return (
    <form
      className={className}
      aria-busy={pending}
      onSubmit={(event) => {
        event.preventDefault();
        formAction(new FormData(event.currentTarget));
      }}
    >
      {children}

      {state?.ok && successHref ? (
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 sm:col-span-2">
          <span className="flex-1">{state.message ?? successMessage}</span>
          <Link
            href={successHref}
            className={cn(buttonVariants({ size: "sm" }))}
          >
            {successLinkLabel}
          </Link>
        </div>
      ) : null}
    </form>
  );
}
