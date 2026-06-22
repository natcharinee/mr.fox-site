import { publicTheme } from "@/components/layout/public-theme";
import { cn } from "@/lib/utils";

export function PageShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn(publicTheme.shell, className)}>{children}</div>;
}
