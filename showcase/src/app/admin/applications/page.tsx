import Link from "next/link";
import { db } from "@/db";
import { AppMedia } from "@/components/apps/app-media";
import { platformTypes } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AdminSaveForm } from "@/components/admin/admin-save-form";
import { AdminPosterUploadField } from "@/components/admin/admin-poster-upload-field";
import { ApplicationFormVisibilityFields } from "@/components/admin/application-form-visibility-fields";
import { ApplicationVisibilityToggle } from "@/components/admin/application-visibility-toggle";
import { createApplication, deleteApplication } from "@/lib/admin/actions";
import { getAllApplicationsAdmin } from "@/lib/admin/queries";

export const dynamic = "force-dynamic";

export default async function AdminApplicationsPage() {
  const [items, types] = await Promise.all([
    getAllApplicationsAdmin(),
    db.select({ id: platformTypes.id, name: platformTypes.name }).from(platformTypes),
  ]);

  const publishedCount = items.filter((item) => item.published).length;
  const featuredCount = items.filter((item) => item.featured).length;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Application Management</h2>
        <p className="text-muted-foreground">
          ปุ่ม <span className="font-medium text-foreground">Applications</span> ควบคุมรายการในเมนู
          Applications ({publishedCount} แอป) · ปุ่ม{" "}
          <span className="font-medium text-foreground">หน้าแรก</span> ควบคุมส่วน Featured
          Applications บนหน้าแรก ({featuredCount} แอป) · รูป Poster สำหรับหน้าแรก · รูป Featured สำหรับหน้า Applications
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">เพิ่มแอปใหม่</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminSaveForm action={createApplication} successMessage="บันทึกแอปสำเร็จแล้ว" className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">ชื่อแอป</Label>
              <Input id="name" name="name" required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" name="slug" required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="platformTypeId">Platform Type</Label>
              <select
                id="platformTypeId"
                name="platformTypeId"
                required
                className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                {types.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
            <ApplicationFormVisibilityFields />
            <div className="sm:col-span-2">
              <Label htmlFor="description">คำอธิบาย</Label>
              <Textarea id="description" name="description" rows={2} className="mt-1" />
            </div>
            <div className="sm:col-span-2 space-y-4">
              <AdminPosterUploadField usage="แสดงบนหน้าแรก · ส่วน Featured Applications" />
              <AdminPosterUploadField
                name="featuredPosterUrl"
                focusName="featuredPosterFocus"
                label="รูป Featured (หน้า Applications)"
                usage="แสดงบนหน้า Applications · รายการและรายละเอียดแอป"
                hint="อัปโหลดรูปสำหรับหน้า Applications — แนะนำแนวนอนอย่างน้อย 1200×600 px"
                previewClassName="h-32 w-full max-w-sm"
              />
            </div>
            <div>
              <Label htmlFor="iosUrl">iOS URL</Label>
              <Input id="iosUrl" name="iosUrl" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="androidUrl">Android URL</Label>
              <Input id="androidUrl" name="androidUrl" className="mt-1" />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit">บันทึกแอป</Button>
            </div>
          </AdminSaveForm>
        </CardContent>
      </Card>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-14">รูป</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>Downloads</TableHead>
              <TableHead title="เปิด/ปิดการแสดงในเมนู Applications">
                Applications
              </TableHead>
              <TableHead title="เปิด/ปิดการแสดงในส่วน Featured Applications บนหน้าแรก">
                หน้าแรก
              </TableHead>
              <TableHead className="w-52">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <AppMedia
                    posterUrl={item.featuredPosterUrl ?? item.posterUrl}
                    posterFocus={item.featuredPosterFocus ?? item.posterFocus}
                    name={item.name}
                    className="h-12 w-9 rounded-md"
                    imageClassName="p-1"
                  />
                </TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.platformTypeName}</TableCell>
                <TableCell>{item.downloadCount}</TableCell>
                <TableCell>
                  <ApplicationVisibilityToggle
                    applicationId={item.id}
                    applicationName={item.name}
                    enabled={item.published}
                    field="published"
                  />
                </TableCell>
                <TableCell>
                  <ApplicationVisibilityToggle
                    applicationId={item.id}
                    applicationName={item.name}
                    enabled={item.featured}
                    field="featured"
                    disabled={!item.published}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" nativeButton={false} render={<Link href={`/admin/applications/${item.id}`} />}>
                      แก้ไข
                    </Button>
                    <Button size="sm" variant="outline" nativeButton={false} render={<Link href={`/apps/${item.slug}`} />}>
                      ดู
                    </Button>
                    <form action={deleteApplication.bind(null, item.id)}>
                      <Button size="sm" variant="destructive" type="submit">
                        ลบ
                      </Button>
                    </form>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
