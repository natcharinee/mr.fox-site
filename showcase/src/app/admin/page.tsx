import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAdminDashboardStats } from "@/lib/admin/queries";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const stats = await getAdminDashboardStats();

  const cards = [
    { label: "Applications", value: stats.apps, href: "/admin/applications" },
    { label: "Platform Types", value: stats.platforms, href: "/admin/platforms" },
    { label: "Features", value: stats.features, href: "/admin/features" },
    { label: "News", value: stats.news, href: "/admin/news" },
    { label: "Downloads", value: stats.downloads, href: "/admin/analytics" },
    { label: "Users", value: stats.users, href: "/admin/users" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-muted-foreground">ภาพรวมเนื้อหาและกิจกรรมล่าสุด</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link key={card.label} href={card.href}>
            <Card className="transition-shadow hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{card.value}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Applications (Downloads)</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {stats.topApps.map((app) => (
                <li key={app.slug} className="flex justify-between">
                  <span>{app.name}</span>
                  <span className="text-muted-foreground">{app.downloadCount}</span>
                </li>
              ))}
              {stats.topApps.length === 0 && (
                <li className="text-muted-foreground">ยังไม่มีข้อมูล</li>
              )}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Audit Log ล่าสุด</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {stats.recentAudit.map((log, i) => (
                <li key={i} className="flex justify-between gap-2">
                  <span className="truncate">
                    {log.action} {log.entity}
                    {log.details ? ` — ${log.details}` : ""}
                  </span>
                  <span className="shrink-0 text-muted-foreground text-xs">
                    {log.createdAt
                      ? new Date(log.createdAt).toLocaleDateString("th-TH")
                      : ""}
                  </span>
                </li>
              ))}
              {stats.recentAudit.length === 0 && (
                <li className="text-muted-foreground">ยังไม่มีกิจกรรม</li>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
