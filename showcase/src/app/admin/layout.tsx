import { AdminShell } from "@/components/admin/admin-shell";
import { getSession } from "@/lib/auth";

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
