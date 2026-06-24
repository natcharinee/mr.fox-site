import { eq } from "drizzle-orm";
import { db } from "@/db";
import { news } from "@/db/schema";
import { fetchInfoMrfoxReviews } from "@/lib/info-mrfox-news";

export async function syncInfoMrfoxNewsToDatabase() {
  const reviews = await fetchInfoMrfoxReviews();
  let created = 0;
  let updated = 0;

  for (const review of reviews) {
    const [existing] = await db
      .select({ id: news.id })
      .from(news)
      .where(eq(news.slug, review.slug))
      .limit(1);

    const row = {
      title: review.title,
      excerpt: review.excerpt,
      content: review.excerpt,
      source: review.source,
      thumbnailUrl: review.thumbnailUrl,
      publishedAt: review.publishedAt,
    };

    if (existing) {
      await db.update(news).set(row).where(eq(news.id, existing.id));
      updated += 1;
    } else {
      await db.insert(news).values({ slug: review.slug, ...row });
      created += 1;
    }
  }

  return { total: reviews.length, created, updated };
}
