"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = {
  action: (formData: FormData) => Promise<void>;
  successMessage?: string;
  className?: string;
  children: ReactNode;
};

export function AdminSaveForm({
  action,
  successMessage = "บันทึกสำเร็จแล้ว",
  className,
  children,
}: Props) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setPending(true);

    try {
      await action(formData);
      toast.success(successMessage);
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "บันทึกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง";
      toast.error(message);
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={(event) => void handleSubmit(event)}
      className={className}
      aria-busy={pending}
    >
      {children}
    </form>
  );
}
