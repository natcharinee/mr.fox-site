import { cn } from "@/lib/utils";
import { pageInner, pageShell } from "@/components/layout/public-theme";

type PageWidthProps = {
  children: React.ReactNode;
  className?: string;
  shellClassName?: string;
  as?: "div" | "section";
};

/** Shared page column — same left/right edges as header, footer, and sections. */
export function PageWidth({
  children,
  className,
  shellClassName,
  as: Comp = "div",
}: PageWidthProps) {
  return (
    <Comp className={cn(pageShell, shellClassName)}>
      <div className={cn(pageInner, className)}>{children}</div>
    </Comp>
  );
}
