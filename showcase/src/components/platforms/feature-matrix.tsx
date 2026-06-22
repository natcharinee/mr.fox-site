import { getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { themedCard } from "@/components/layout/public-theme";

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

export async function FeatureMatrix({
  rows,
}: {
  rows: {
    featureName: string;
    featureSlug: string;
    group: string;
    status: string;
  }[];
}) {
  const t = await getTranslations("platforms");
  const showcaseRows = rows.filter((r) => r.group === "B" || r.status !== "no");

  return (
    <Card className={themedCard()}>
      <CardHeader>
        <CardTitle className="text-[var(--fox-charcoal)]">{t("featuresMatrix")}</CardTitle>
        <CardDescription>{t("featuresMatrixDesc")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#f0e4c3] text-left">
                <th className="pb-3 pr-4 font-semibold text-[var(--fox-charcoal)]">Feature</th>
                <th className="pb-3 font-semibold text-[var(--fox-charcoal)]">Status</th>
              </tr>
            </thead>
            <tbody>
              {showcaseRows.map((row) => (
                <tr key={row.featureSlug} className="border-b border-[#f0e4c3]/60">
                  <td className="py-2.5 pr-4 text-[var(--fox-charcoal)]">{row.featureName}</td>
                  <td className="py-2.5">
                    <Badge
                      variant={STATUS_VARIANT[row.status] ?? "outline"}
                      className={
                        row.status === "core"
                          ? "bg-[var(--fox-gold)] text-[var(--fox-charcoal)] hover:bg-[var(--fox-gold)]"
                          : undefined
                      }
                    >
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
