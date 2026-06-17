import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAnalyticsData } from "@/lib/admin/queries";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  const data = await getAnalyticsData();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Analytics</h2>
        <p className="text-muted-foreground">
          Downloads · Popular Apps · CMS Activity
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Downloads by Link Type</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {data.downloadsByType.map((row) => (
                <li key={row.type} className="flex justify-between">
                  <span className="uppercase">{row.type}</span>
                  <span className="font-medium">{row.count}</span>
                </li>
              ))}
              {data.downloadsByType.length === 0 && (
                <li className="text-muted-foreground">ยังไม่มีข้อมูล</li>
              )}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Apps by Download Events</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {data.downloadsByApp.map((row) => (
                <li key={row.name} className="flex justify-between">
                  <span>{row.name}</span>
                  <span className="font-medium">{row.count}</span>
                </li>
              ))}
              {data.downloadsByApp.length === 0 && (
                <li className="text-muted-foreground">ยังไม่มีข้อมูล</li>
              )}
            </ul>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">CMS Activity (Audit Log by Day)</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {data.auditByDay.map((row) => (
                <li key={String(row.day)} className="flex justify-between">
                  <span>
                    {row.day
                      ? new Date(row.day).toLocaleDateString("th-TH")
                      : "—"}
                  </span>
                  <span className="font-medium">{row.count} actions</span>
                </li>
              ))}
              {data.auditByDay.length === 0 && (
                <li className="text-muted-foreground">ยังไม่มีกิจกรรม</li>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
