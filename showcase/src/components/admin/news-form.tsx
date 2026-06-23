import { AdminSaveForm } from "@/components/admin/admin-save-form";
import { createNews } from "@/lib/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function NewsForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">เพิ่มข่าวใหม่</CardTitle>
      </CardHeader>
      <CardContent>
        <AdminSaveForm action={createNews} successMessage="บันทึกข่าวสำเร็จแล้ว" className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="title">หัวข้อ</Label>
            <Input id="title" name="title" required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" name="slug" required className="mt-1" />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Input id="excerpt" name="excerpt" className="mt-1" />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="content">เนื้อหา</Label>
            <Textarea id="content" name="content" required rows={4} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
            <Input id="thumbnailUrl" name="thumbnailUrl" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="publishedAt">วันที่เผยแพร่</Label>
            <Input id="publishedAt" name="publishedAt" type="date" className="mt-1" />
            <p className="mt-1 text-xs text-muted-foreground">
              เว้นว่าง = Draft (ไม่แสดงบนเว็บไซต์)
            </p>
          </div>
          <div className="sm:col-span-2">
            <Button type="submit">บันทึกข่าว</Button>
          </div>
        </AdminSaveForm>
      </CardContent>
    </Card>
  );
}
