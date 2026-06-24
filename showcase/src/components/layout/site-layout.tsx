import { Header } from "./header";
import { Footer } from "./footer";
import { publicTheme } from "./public-theme";
import { cn } from "@/lib/utils";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={cn(publicTheme.shell, "flex min-h-full flex-col")}>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
