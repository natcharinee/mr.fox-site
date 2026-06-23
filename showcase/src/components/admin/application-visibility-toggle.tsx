"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { LayoutGrid, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  setApplicationFeatured,
  setApplicationPublished,
} from "@/lib/admin/actions";

type VisibilityField = "published" | "featured";

const FIELD_CONFIG: Record<
  VisibilityField,
  {
    setValue: (id: number, enabled: boolean) => Promise<void>;
    onLabel: string;
    offLabel: string;
    onToast: (name: string) => string;
    offToast: (name: string) => string;
    ariaOn: (name: string) => string;
    ariaOff: (name: string) => string;
    Icon: typeof Star;
  }
> = {
  published: {
    setValue: setApplicationPublished,
    onLabel: "อยู่ใน Applications",
    offLabel: "Applications",
    onToast: (name) => `แสดง "${name}" ในหน้า Applications แล้ว`,
    offToast: (name) => `ซ่อน "${name}" จากหน้า Applications แล้ว`,
    ariaOn: (name) => `ซ่อน ${name} จากหน้า Applications`,
    ariaOff: (name) => `แสดง ${name} ในหน้า Applications`,
    Icon: LayoutGrid,
  },
  featured: {
    setValue: setApplicationFeatured,
    onLabel: "อยู่หน้าแรก",
    offLabel: "หน้าแรก",
    onToast: (name) => `เพิ่ม "${name}" ในหน้าแรกแล้ว`,
    offToast: (name) => `เอา "${name}" ออกจากหน้าแรกแล้ว`,
    ariaOn: (name) => `เอา ${name} ออกจากหน้าแรก`,
    ariaOff: (name) => `แสดง ${name} บนหน้าแรก`,
    Icon: Star,
  },
};

type ApplicationVisibilityToggleProps = {
  applicationId: number;
  applicationName: string;
  enabled: boolean;
  field: VisibilityField;
  disabled?: boolean;
};

export function ApplicationVisibilityToggle({
  applicationId,
  applicationName,
  enabled,
  field,
  disabled = false,
}: ApplicationVisibilityToggleProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const config = FIELD_CONFIG[field];
  const Icon = config.Icon;

  const handleToggle = () => {
    const nextEnabled = !enabled;

    startTransition(async () => {
      try {
        await config.setValue(applicationId, nextEnabled);
        toast.success(
          nextEnabled
            ? config.onToast(applicationName)
            : config.offToast(applicationName),
        );
        router.refresh();
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "อัปเดตไม่สำเร็จ กรุณาลองใหม่อีกครั้ง";
        toast.error(message);
      }
    });
  };

  return (
    <Button
      type="button"
      size="sm"
      variant={enabled ? "default" : "outline"}
      disabled={pending || disabled}
      onClick={handleToggle}
      className={cn(
        "gap-1.5",
        enabled &&
          "border-[var(--fox-gold)] bg-[var(--fox-gold)] text-[var(--fox-charcoal)] hover:bg-[var(--fox-gold-dark)] hover:text-[var(--fox-charcoal)]",
      )}
      aria-pressed={enabled}
      aria-label={enabled ? config.ariaOn(applicationName) : config.ariaOff(applicationName)}
    >
      <Icon className={cn("size-3.5", enabled && "fill-current")} aria-hidden />
      {enabled ? config.onLabel : config.offLabel}
    </Button>
  );
}
