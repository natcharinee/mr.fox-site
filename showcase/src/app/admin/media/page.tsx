import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MediaUploadForm } from "@/components/admin/media-upload-form";
import { getAllMedia } from "@/lib/admin/queries";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const items = await getAllMedia();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Media Library</h2>
        <p className="text-muted-foreground">
          อัปโหลด poster, logo, screenshot — เก็บใน local (พร้อมขยาย S3)
        </p>
      </div>

      <MediaUploadForm />

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Filename</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>URL</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.filename}</TableCell>
                <TableCell>{item.mimeType}</TableCell>
                <TableCell>{(item.sizeBytes / 1024).toFixed(1)} KB</TableCell>
                <TableCell>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm"
                  >
                    {item.url}
                  </a>
                </TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  ยังไม่มีไฟล์
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
