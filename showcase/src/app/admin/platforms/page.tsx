import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllPlatformsAdmin } from "@/lib/admin/queries";

export const dynamic = "force-dynamic";

export default async function AdminPlatformsPage() {
  const items = await getAllPlatformsAdmin();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Platform Management</h2>
        <p className="text-muted-foreground">
          แก้ไข Platform Types — Features Matrix มาจาก junction table
        </p>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Concept</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="text-muted-foreground">{item.slug}</TableCell>
                <TableCell className="max-w-xs truncate">{item.concept}</TableCell>
                <TableCell>
                  <Button size="sm" variant="outline" nativeButton={false} render={<Link href={`/admin/platforms/${item.id}`} />}>
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
