import Link from "next/link";
import { db } from "@/db";
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
import { createApplication, deleteApplication } from "@/lib/admin/actions";
import { getAllApplicationsAdmin } from "@/lib/admin/queries";

export const dynamic = "force-dynamic";

export default async function AdminApplicationsPage() {
  const [items, types] = await Promise.all([
    getAllApplicationsAdmin(),
    db.select({ id: platformTypes.id, name: platformTypes.name }).from(platformTypes),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Application Management</h2>
        <p className="text-muted-foreground">CRUD แอปพลิเคชันและลิงก์ดาวน์โหลด</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">เพิ่มแอปใหม่</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createApplication} className="grid gap-4 sm:grid-cols-2">
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
            <div className="flex items-end gap-2 pb-1">
              <input type="checkbox" id="featured" name="featured" className="size-4" />
              <Label htmlFor="featured">Featured</Label>
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="description">คำอธิบาย</Label>
              <Textarea id="description" name="description" rows={2} className="mt-1" />
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
          </form>
        </CardContent>
      </Card>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>Downloads</TableHead>
              <TableHead className="w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  {item.name}
                  {item.featured && " ⭐"}
                </TableCell>
                <TableCell>{item.platformTypeName}</TableCell>
                <TableCell>{item.downloadCount}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
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
