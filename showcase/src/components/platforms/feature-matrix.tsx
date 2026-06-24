import { getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { publicTheme, themedCard } from "@/components/layout/public-theme";
import type { Locale } from "@/i18n/routing";
import { localizeFeatureMatrixRow } from "@/lib/content-i18n";

const STATUS_VARIANT: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  core: "default",
  optional: "secondary",
  custom: "outline",
  no: "destructive",
};

const STATUS_KEY: Record<string, string> = {
  core: "statusCore",
  optional: "statusOptional",
  custom: "statusCustom",
  no: "statusNo",
};

export async function FeatureMatrix({
  locale,
  rows,
}: {
  locale: Locale;
  rows: {
    featureName: string;
    featureSlug: string;
    group: string;
    status: string;
  }[];
}) {
  const t = await getTranslations("platforms");
  const localizedRows = rows.map((row) => localizeFeatureMatrixRow(locale, row));
  const showcaseRows = localizedRows.filter((r) => r.group === "B" || r.status !== "no");

  return (
    <Card className={themedCard()}>
      <CardHeader>
        <CardTitle className={publicTheme.cardTitle}>{t("featuresMatrix")}</CardTitle>
        <CardDescription className={publicTheme.cardDescription}>
          {t("featuresMatrixDesc")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left">
                <th className={`pb-3 pr-4 font-semibold ${publicTheme.cardTitle}`}>
                  {t("matrixFeature")}
                </th>
                <th className={`pb-3 font-semibold ${publicTheme.cardTitle}`}>
                  {t("matrixStatus")}
                </th>
              </tr>
            </thead>
            <tbody>
              {showcaseRows.map((row) => (
                <tr key={row.featureSlug} className="border-b border-white/5">
                  <td className={`py-2.5 pr-4 ${publicTheme.cardTitle}`}>{row.featureName}</td>
                  <td className="py-2.5">
                    <Badge
                      variant={STATUS_VARIANT[row.status] ?? "outline"}
                      className={
                        row.status === "core" ? publicTheme.badgeGold : publicTheme.badgeOutline
                      }
                    >
                      {STATUS_KEY[row.status] ? t(STATUS_KEY[row.status]) : row.status}
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
