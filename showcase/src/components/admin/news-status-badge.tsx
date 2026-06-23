import { Badge } from "@/components/ui/badge";

type Props = {
  publishedAt: Date | null;
};

export function NewsStatusBadge({ publishedAt }: Props) {
  if (!publishedAt) {
    return (
      <Badge
        variant="secondary"
        className="border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300"
      >
        Draft · ยังไม่เผยแพร่
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="border-emerald-500/30 text-emerald-700 dark:text-emerald-400"
    >
      เผยแพร่แล้ว
    </Badge>
  );
}
