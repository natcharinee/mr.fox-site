import Link from "next/link";
import { NewsStatusBadge } from "@/components/admin/news-status-badge";
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
import {
  formatNewsPublishDateInput,
  getNewsPublishStatus,
} from "@/lib/news-publish";
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
              <TableHead>Status</TableHead>
              <TableHead>Published</TableHead>
              <TableHead className="w-44">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => {
              const publishStatus = getNewsPublishStatus(item.publishedAt);

              return (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell className="text-muted-foreground">{item.slug}</TableCell>
                <TableCell>
                  <NewsStatusBadge
                    status={publishStatus}
                    publishedAt={item.publishedAt}
                  />
                </TableCell>
                <TableCell>
                  {item.publishedAt
                    ? formatNewsPublishDateInput(item.publishedAt)
                    : "—"}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" nativeButton={false} render={<Link href={`/admin/news/${item.id}`} />}>
                      แก้ไข
                    </Button>
                    {publishStatus === "published" ? (
                      <Button size="sm" variant="outline" nativeButton={false} render={<Link href={`/news/${item.slug}`} />}>
                        ดู
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled
                        title="ข่าวยังไม่แสดงบนเว็บไซต์ (Draft หรือยังไม่ถึงวันเผยแพร่)"
                      >
                        ดู
                      </Button>
                    )}
                    <form action={deleteNews.bind(null, item.id)}>
                      <Button size="sm" variant="destructive" type="submit">
                        ลบ
                      </Button>
                    </form>
                  </div>
                </TableCell>
              </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
