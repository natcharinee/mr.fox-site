"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  FileText,
  Image,
  LayoutDashboard,
  Layers,
  LogOut,
  Megaphone,
  Smartphone,
  Sparkles,
  Users,
} from "lucide-react";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/brand/brand-logo";
import type { SessionPayload } from "@/lib/auth";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/platforms", label: "Platforms", icon: Layers },
  { href: "/admin/applications", label: "Applications", icon: Smartphone },
  { href: "/admin/features", label: "Features", icon: Sparkles },
  { href: "/admin/news", label: "News", icon: FileText },
  { href: "/admin/banners", label: "Banners", icon: Megaphone },
  { href: "/admin/media", label: "Media", icon: Image },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/users", label: "Users", icon: Users, adminOnly: true },
];

export function AdminShell({
  session,
  children,
}: {
  session: SessionPayload;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const items = NAV.filter(
    (item) => !item.adminOnly || session.role === "admin",
  );

  return (
    <div className="flex min-h-screen">
      <Toaster position="top-center" richColors closeButton className="!z-[9999]" />
      <aside className="hidden w-60 shrink-0 border-r bg-muted/20 md:flex md:flex-col">
        <div className="flex h-16 items-center border-b px-4">
          <BrandLogo iconClassName="size-8" wordmarkClassName="h-6" />
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {items.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t p-3">
          <p className="truncate px-3 text-xs text-muted-foreground">
            {session.name} · {session.role}
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 w-full justify-start"
            onClick={() => void logout()}
          >
            <LogOut className="mr-2 size-4" />
            ออกจากระบบ
          </Button>
          <Link
            href="/"
            className="mt-1 block px-3 text-xs text-primary hover:underline"
          >
            ← กลับเว็บไซต์
          </Link>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b px-4 md:px-8">
          <div className="md:hidden">
            <BrandLogo showWordmark={false} iconClassName="size-8" />
          </div>
          <p className="hidden text-sm text-muted-foreground md:block">
            CMS / Back Office
          </p>
        </header>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
