import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: {
    absolute: "CMS / Back Office Mr.FOX",
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return session ? (
    <AdminShell session={session}>{children}</AdminShell>
  ) : (
    <>{children}</>
  );
}
