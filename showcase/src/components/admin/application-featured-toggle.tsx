"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { setApplicationFeatured } from "@/lib/admin/actions";

type ApplicationFeaturedToggleProps = {
  applicationId: number;
  applicationName: string;
  featured: boolean;
};

export function ApplicationFeaturedToggle({
  applicationId,
  applicationName,
  featured,
}: ApplicationFeaturedToggleProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const handleToggle = () => {
    const nextFeatured = !featured;

    startTransition(async () => {
      try {
        await setApplicationFeatured(applicationId, nextFeatured);
        toast.success(
          nextFeatured
            ? `เพิ่ม "${applicationName}" ในหน้าแรกแล้ว`
            : `เอา "${applicationName}" ออกจากหน้าแรกแล้ว`,
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
      variant={featured ? "default" : "outline"}
      disabled={pending}
      onClick={handleToggle}
      className={cn(
        "gap-1.5",
        featured &&
          "border-[var(--fox-gold)] bg-[var(--fox-gold)] text-[var(--fox-charcoal)] hover:bg-[var(--fox-gold-dark)] hover:text-[var(--fox-charcoal)]",
      )}
      aria-pressed={featured}
      aria-label={
        featured
          ? `เอา ${applicationName} ออกจากหน้าแรก`
          : `แสดง ${applicationName} บนหน้าแรก`
      }
    >
      <Star className={cn("size-3.5", featured && "fill-current")} aria-hidden />
      {featured ? "โชว์อยู่" : "โชว์หน้าบ้าน"}
    </Button>
  );
}
