import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { platformTypes } from "@/db/schema";
import { AdminSaveForm } from "@/components/admin/admin-save-form";
import { AdminPosterUploadField } from "@/components/admin/admin-poster-upload-field";
import { ApplicationFormVisibilityFields } from "@/components/admin/application-form-visibility-fields";
import { updateApplication } from "@/lib/admin/actions";
import { getApplicationById } from "@/lib/admin/queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function AdminApplicationEditPage({ params }: Props) {
  const { id } = await params;
  const [item, types] = await Promise.all([
    getApplicationById(Number(id)),
    db.select({ id: platformTypes.id, name: platformTypes.name }).from(platformTypes),
  ]);

  if (!item) notFound();

  const update = updateApplication.bind(null, item.id);
  const iosUrl = item.links.find((link) => link.type === "ios")?.url ?? "";
  const androidUrl = item.links.find((link) => link.type === "android")?.url ?? "";
  const apkUrl =
    item.links.find((link) => link.type === "apk")?.url ??
    (iosUrl || androidUrl ? `https://download.mrfox.app/${item.slug}.apk` : "");

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold">แก้ไขแอป</h2>
        <p className="text-muted-foreground">{item.slug}</p>
      </div>

      <AdminSaveForm
        action={update}
        successMessage="อัปเดตแอปสำเร็จแล้ว"
        className="grid gap-4 sm:grid-cols-2"
      >
        <div>
          <Label htmlFor="name">ชื่อแอป</Label>
          <Input id="name" name="name" defaultValue={item.name} required className="mt-1" />
        </div>
        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" name="slug" defaultValue={item.slug} required className="mt-1" />
        </div>
        <div>
          <Label htmlFor="platformTypeId">Platform Type</Label>
          <select
            id="platformTypeId"
            name="platformTypeId"
            required
            defaultValue={item.platformTypeId}
            className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            {types.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
        <ApplicationFormVisibilityFields
          defaultPublished={item.published}
          defaultFeatured={item.featured}
        />
        <div className="sm:col-span-2">
          <Label htmlFor="description">คำอธิบาย</Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={item.description ?? ""}
            rows={3}
            className="mt-1"
          />
        </div>
        <div className="sm:col-span-2 space-y-4">
          <AdminPosterUploadField
            defaultValue={item.posterUrl ?? ""}
            defaultFocus={item.posterFocus ?? undefined}
            usage="แสดงบนหน้าแรก · ส่วน Featured Applications"
          />
          <AdminPosterUploadField
            name="featuredPosterUrl"
            focusName="featuredPosterFocus"
            label="รูป Featured (หน้า Applications)"
            usage="แสดงบนหน้า Applications · รายการและรายละเอียดแอป"
            hint="อัปโหลดรูปสำหรับหน้า Applications — แนะนำแนวนอนอย่างน้อย 1200×600 px"
            defaultValue={item.featuredPosterUrl ?? ""}
            defaultFocus={item.featuredPosterFocus ?? undefined}
            previewClassName="h-32 w-full max-w-sm"
          />
        </div>
        <div>
          <Label htmlFor="iosUrl">iOS URL</Label>
          <Input id="iosUrl" name="iosUrl" defaultValue={iosUrl} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="androidUrl">Android URL</Label>
          <Input id="androidUrl" name="androidUrl" defaultValue={androidUrl} className="mt-1" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="apkUrl">APK URL</Label>
          <Input
            id="apkUrl"
            name="apkUrl"
            defaultValue={apkUrl}
            placeholder={`https://download.mrfox.app/${item.slug}.apk`}
            className="mt-1"
          />
        </div>
        <div className="flex gap-2 sm:col-span-2">
          <Button type="submit">บันทึก</Button>
          <Button variant="outline" nativeButton={false} render={<Link href="/admin/applications" />}>
            ยกเลิก
          </Button>
        </div>
      </AdminSaveForm>
    </div>
  );
}
