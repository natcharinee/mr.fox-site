import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { createBanner, deleteBanner } from "@/lib/admin/actions";
import { getAllBanners } from "@/lib/admin/queries";

export const dynamic = "force-dynamic";

export default async function AdminBannersPage() {
  const items = await getAllBanners();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Banner Management</h2>
        <p className="text-muted-foreground">จัดการแบนเนอร์หน้าแรกและแคมเปญ</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">เพิ่ม Banner</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminSaveForm action={createBanner} successMessage="บันทึก Banner สำเร็จแล้ว" className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="title">หัวข้อ</Label>
              <Input id="title" name="title" required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input id="subtitle" name="subtitle" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input id="imageUrl" name="imageUrl" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="linkUrl">Link URL</Label>
              <Input id="linkUrl" name="linkUrl" className="mt-1" />
            </div>
            <div className="flex items-end gap-2 pb-1">
              <input type="checkbox" id="active" name="active" defaultChecked className="size-4" />
              <Label htmlFor="active">Active</Label>
            </div>
            <div className="sm:col-span-2">
              <Button type="submit">บันทึก Banner</Button>
            </div>
          </AdminSaveForm>
        </CardContent>
      </Card>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Subtitle</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell>{item.subtitle}</TableCell>
                <TableCell>{item.active ? "✓" : "—"}</TableCell>
                <TableCell>
                  <form action={deleteBanner.bind(null, item.id)}>
                    <Button size="sm" variant="destructive" type="submit">
                      ลบ
                    </Button>
                  </form>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
