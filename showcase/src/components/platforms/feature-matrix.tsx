import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const STATUS_LABEL: Record<string, string> = {
  core: "CORE",
  optional: "OPTIONAL",
  custom: "CUSTOM",
  no: "NO",
};

const STATUS_VARIANT: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  core: "default",
  optional: "secondary",
  custom: "outline",
  no: "destructive",
};

export function FeatureMatrix({
  rows,
}: {
  rows: {
    featureName: string;
    featureSlug: string;
    group: string;
    status: string;
  }[];
}) {
  const showcaseRows = rows.filter((r) => r.group === "B" || r.status !== "no");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Features Matrix</CardTitle>
        <CardDescription>
          สร้างอัตโนมัติจาก junction table — ตาม Website Spec §5
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 pr-4 font-semibold">Feature</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {showcaseRows.map((row) => (
                <tr key={row.featureSlug} className="border-b border-border/50">
                  <td className="py-2.5 pr-4">{row.featureName}</td>
                  <td className="py-2.5">
                    <Badge variant={STATUS_VARIANT[row.status] ?? "outline"}>
                      {STATUS_LABEL[row.status] ?? row.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
