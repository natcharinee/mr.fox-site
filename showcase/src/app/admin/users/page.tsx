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
import { Badge } from "@/components/ui/badge";
import { AdminSaveForm } from "@/components/admin/admin-save-form";
import { createUser, deleteUser } from "@/lib/admin/actions";
import { getAllUsers } from "@/lib/admin/queries";
import { requireSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  try {
    await requireSession("admin");
  } catch {
    redirect("/admin");
  }

  const items = await getAllUsers();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">User Management</h2>
        <p className="text-muted-foreground">จัดการ Admin และ Editor (Admin only)</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">เพิ่มผู้ใช้</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminSaveForm action={createUser} successMessage="สร้างผู้ใช้สำเร็จแล้ว" className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">ชื่อ</Label>
              <Input id="name" name="name" required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="email">อีเมล</Label>
              <Input id="email" name="email" type="email" required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="password">รหัสผ่าน</Label>
              <Input id="password" name="password" type="password" required minLength={6} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                name="role"
                className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <Button type="submit">สร้างผู้ใช้</Button>
            </div>
          </AdminSaveForm>
        </CardContent>
      </Card>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>
                  <Badge variant={item.role === "admin" ? "default" : "secondary"}>
                    {item.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <form action={deleteUser.bind(null, item.id)}>
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
