import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllFeaturesAdmin } from "@/lib/admin/queries";

export const dynamic = "force-dynamic";

export default async function AdminFeaturesPage() {
  const items = await getAllFeaturesAdmin();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Feature Management</h2>
        <p className="text-muted-foreground">แก้ไขรายละเอียดฟีเจอร์ใน Feature Library</p>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Group</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">Group {item.group}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{item.slug}</TableCell>
                <TableCell>
                  <Button size="sm" variant="outline" nativeButton={false} render={<Link href={`/admin/features/${item.id}`} />}>
                    แก้ไข
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
