import { AdminSaveForm } from "@/components/admin/admin-save-form";
import { AdminPosterUploadField } from "@/components/admin/admin-poster-upload-field";
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
            <Label htmlFor="source">แหล่งที่มา</Label>
            <Input
              id="source"
              name="source"
              placeholder="เช่น Mr.FOX PR, TechCrunch, https://..."
              className="mt-1"
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="content">เนื้อหา</Label>
            <Textarea id="content" name="content" required rows={4} className="mt-1" />
          </div>
          <AdminPosterUploadField
            name="thumbnailUrl"
            label="รูป Thumbnail"
            hint="อัปโหลดรูปปกข่าว — แนะนำขนาด 1200×630 px"
            previewClassName="h-24 w-40"
          />
          <div>
            <Label htmlFor="publishedAt">วันที่เผยแพร่</Label>
            <Input id="publishedAt" name="publishedAt" type="date" className="mt-1" />
            <p className="mt-1 text-xs text-muted-foreground">
              เว้นว่าง = Draft · วันในอนาคต = รอเผยแพร่ (00:00 น. ตามเวลาไทย)
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
