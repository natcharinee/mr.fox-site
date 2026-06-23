import Link from "next/link";
import { notFound } from "next/navigation";
import { NewsStatusBadge } from "@/components/admin/news-status-badge";
import { AdminSaveForm } from "@/components/admin/admin-save-form";
import { updateNews } from "@/lib/admin/actions";
import { getNewsById } from "@/lib/admin/queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

function formatDateInput(value: Date | null) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

export default async function AdminNewsEditPage({ params }: Props) {
  const { id } = await params;
  const item = await getNewsById(Number(id));
  if (!item) notFound();

  const update = updateNews.bind(null, item.id);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-2xl font-bold">แก้ไขข่าว</h2>
          <NewsStatusBadge publishedAt={item.publishedAt} />
        </div>
        <p className="text-muted-foreground">{item.slug}</p>
        {!item.publishedAt && (
          <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
            ข่าวนี้เป็น Draft — ยังไม่แสดงบนหน้าเว็บ public จนกว่าจะใส่วันที่เผยแพร่
          </p>
        )}
      </div>

      <AdminSaveForm action={update} successMessage="อัปเดตข่าวสำเร็จแล้ว" className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="title">หัวข้อ</Label>
          <Input id="title" name="title" defaultValue={item.title} required className="mt-1" />
        </div>
        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" name="slug" defaultValue={item.slug} required className="mt-1" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="excerpt">Excerpt</Label>
          <Input id="excerpt" name="excerpt" defaultValue={item.excerpt ?? ""} className="mt-1" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="content">เนื้อหา</Label>
          <Textarea
            id="content"
            name="content"
            defaultValue={item.content}
            required
            rows={6}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
          <Input
            id="thumbnailUrl"
            name="thumbnailUrl"
            defaultValue={item.thumbnailUrl ?? ""}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="publishedAt">วันที่เผยแพร่</Label>
          <Input
            id="publishedAt"
            name="publishedAt"
            type="date"
            defaultValue={formatDateInput(item.publishedAt)}
            className="mt-1"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            เว้นว่าง = Draft (ไม่แสดงบนเว็บไซต์)
          </p>
        </div>
        <div className="flex gap-2 sm:col-span-2">
          <Button type="submit">บันทึก</Button>
          <Button variant="outline" nativeButton={false} render={<Link href="/admin/news" />}>
            ยกเลิก
          </Button>
        </div>
      </AdminSaveForm>
    </div>
  );
}
