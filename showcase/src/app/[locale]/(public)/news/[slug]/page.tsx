import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/metadata";
import { getNewsBySlug } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);
  if (!item) return {};
  return buildMetadata({
    title: item.title,
    description: item.excerpt ?? "",
    path: `/news/${slug}`,
  });
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);
  if (!item) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <time className="text-sm text-muted-foreground">
        {item.publishedAt
          ? new Date(item.publishedAt).toLocaleDateString("th-TH", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : ""}
      </time>
      <h1 className="mt-2 text-3xl font-bold">{item.title}</h1>
      <div className="mt-8 prose prose-neutral max-w-none">
        <p className="text-lg leading-relaxed whitespace-pre-wrap">
          {item.content}
        </p>
      </div>
      <div className="mt-10">
        <Link href="/news" className="text-sm text-primary hover:underline">
          ← กลับไป News
        </Link>
      </div>
    </article>
  );
}
