import { Badge } from "@/components/ui/badge";
import {
  formatNewsPublishDateInput,
  getNewsPublishStatus,
} from "@/lib/news-publish";

type Props = {
  publishedAt: Date | null;
};

export function NewsStatusBadge({ publishedAt }: Props) {
  const status = getNewsPublishStatus(publishedAt);

  if (status === "draft") {
    return (
      <Badge
        variant="secondary"
        className="border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300"
      >
        Draft · ยังไม่เผยแพร่
      </Badge>
    );
  }

  if (status === "scheduled") {
    const dateLabel = publishedAt
      ? formatNewsPublishDateInput(publishedAt)
      : "";
    return (
      <Badge
        variant="secondary"
        className="border-sky-500/30 bg-sky-500/10 text-sky-800 dark:text-sky-300"
      >
        รอเผยแพร่ · {dateLabel}
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
