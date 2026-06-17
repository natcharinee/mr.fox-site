import { notFound } from "next/navigation";
import { updateFeature } from "@/lib/admin/actions";
import { getFeatureById } from "@/lib/admin/queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function AdminFeatureEditPage({ params }: Props) {
  const { id } = await params;
  const feature = await getFeatureById(Number(id));
  if (!feature) notFound();

  const update = updateFeature.bind(null, feature.id);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold">แก้ไข Feature</h2>
        <p className="text-muted-foreground">{feature.slug} · Group {feature.group}</p>
      </div>

      <form action={update} className="space-y-4">
        <div>
          <Label htmlFor="name">ชื่อ</Label>
          <Input id="name" name="name" defaultValue={feature.name} required className="mt-1" />
        </div>
        <div>
          <Label htmlFor="description">คำอธิบาย</Label>
          <Textarea id="description" name="description" defaultValue={feature.description ?? ""} rows={3} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="workflow">Workflow</Label>
          <Textarea id="workflow" name="workflow" defaultValue={feature.workflow ?? ""} rows={3} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="revenueModel">Revenue Model</Label>
          <Input id="revenueModel" name="revenueModel" defaultValue={feature.revenueModel ?? ""} className="mt-1" />
        </div>
        <Button type="submit">บันทึก</Button>
      </form>
    </div>
  );
}
