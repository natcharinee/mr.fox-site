import { notFound } from "next/navigation";
import { updatePlatform } from "@/lib/admin/actions";
import { getPlatformById } from "@/lib/admin/queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function AdminPlatformEditPage({ params }: Props) {
  const { id } = await params;
  const platform = await getPlatformById(Number(id));
  if (!platform) notFound();

  const update = updatePlatform.bind(null, platform.id);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold">แก้ไข Platform</h2>
        <p className="text-muted-foreground">{platform.slug}</p>
      </div>

      <form action={update} className="space-y-4">
        <div>
          <Label htmlFor="name">ชื่อ</Label>
          <Input id="name" name="name" defaultValue={platform.name} required className="mt-1" />
        </div>
        <div>
          <Label htmlFor="concept">Concept</Label>
          <Input id="concept" name="concept" defaultValue={platform.concept ?? ""} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="shortDescription">คำอธิบายสั้น</Label>
          <Textarea id="shortDescription" name="shortDescription" defaultValue={platform.shortDescription ?? ""} rows={2} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="creatorModel">Creator Model</Label>
          <Textarea id="creatorModel" name="creatorModel" defaultValue={platform.creatorModel ?? ""} rows={2} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="visitorModel">Visitor Model</Label>
          <Textarea id="visitorModel" name="visitorModel" defaultValue={platform.visitorModel ?? ""} rows={2} className="mt-1" />
        </div>
        <Button type="submit">บันทึก</Button>
      </form>
    </div>
  );
}
