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
import { deleteNews } from "@/lib/admin/actions";
import { getAllNewsAdmin } from "@/lib/admin/queries";
import { NewsForm } from "@/components/admin/news-form";

export const dynamic = "force-dynamic";

export default async function AdminNewsPage() {
  const items = await getAllNewsAdmin();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">News Management</h2>
        <p className="text-muted-foreground">จัดการข่าวสารและบทความ</p>
      </div>

      <NewsForm />

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Published</TableHead>
              <TableHead className="w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell className="text-muted-foreground">{item.slug}</TableCell>
                <TableCell>
                  {item.publishedAt
                    ? new Date(item.publishedAt).toLocaleDateString("th-TH")
                    : "—"}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" nativeButton={false} render={<Link href={`/news/${item.slug}`} />}>
                      ดู
                    </Button>
                    <form action={deleteNews.bind(null, item.id)}>
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
