"use client";

import { useState } from "react";
import { LayoutGrid, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FormToggleProps = {
  enabled: boolean;
  onToggle: () => void;
  onLabel: string;
  offLabel: string;
  Icon: typeof Star;
  disabled?: boolean;
  ariaLabel: string;
};

function FormToggleButton({
  enabled,
  onToggle,
  onLabel,
  offLabel,
  Icon,
  disabled,
  ariaLabel,
}: FormToggleProps) {
  return (
    <Button
      type="button"
      size="sm"
      variant={enabled ? "default" : "outline"}
      disabled={disabled}
      onClick={onToggle}
      className={cn(
        "gap-1.5",
        enabled &&
          "border-[var(--fox-gold)] bg-[var(--fox-gold)] text-[var(--fox-charcoal)] hover:bg-[var(--fox-gold-dark)] hover:text-[var(--fox-charcoal)]",
      )}
      aria-pressed={enabled}
      aria-label={ariaLabel}
    >
      <Icon className={cn("size-3.5", enabled && "fill-current")} aria-hidden />
      {enabled ? onLabel : offLabel}
    </Button>
  );
}

type ApplicationFormVisibilityFieldsProps = {
  defaultPublished?: boolean;
  defaultFeatured?: boolean;
};

export function ApplicationFormVisibilityFields({
  defaultPublished = true,
  defaultFeatured = false,
}: ApplicationFormVisibilityFieldsProps) {
  const [published, setPublished] = useState(defaultPublished);
  const [featured, setFeatured] = useState(defaultFeatured);

  function togglePublished() {
    const next = !published;
    setPublished(next);
    if (!next) {
      setFeatured(false);
    }
  }

  return (
    <div className="flex flex-wrap gap-3 sm:col-span-2">
      <input type="hidden" name="published" value={published ? "on" : ""} />
      <input type="hidden" name="featured" value={featured ? "on" : ""} />

      <FormToggleButton
        enabled={published}
        onToggle={togglePublished}
        onLabel="อยู่ใน Applications"
        offLabel="Applications"
        Icon={LayoutGrid}
        ariaLabel={
          published
            ? "ปิดการแสดงในหน้า Applications"
            : "เปิดการแสดงในหน้า Applications"
        }
      />
      <FormToggleButton
        enabled={featured}
        onToggle={() => setFeatured((value) => !value)}
        onLabel="อยู่หน้าแรก"
        offLabel="หน้าแรก"
        Icon={Star}
        disabled={!published}
        ariaLabel={
          featured
            ? "ปิดการแสดงบนหน้าแรก"
            : "เปิดการแสดงบนหน้าแรก"
        }
      />
    </div>
  );
}
