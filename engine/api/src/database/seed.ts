import 'dotenv/config';
import * as bcrypt from 'bcryptjs';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import {
  creatorProfiles,
  creatorSettings,
  giftStickers,
  revenueShares,
  users,
} from './schema';

async function seed() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL required');

  const client = postgres(url, { prepare: false });
  const db = drizzle(client, { schema });

  console.log('🌱 Seeding Engine database...');

  const creatorHash = await bcrypt.hash('creator123', 12);
  const visitorHash = await bcrypt.hash('visitor123', 12);

  const [creator] = await db
    .insert(users)
    .values({
      email: 'creator@foxy.app',
      passwordHash: creatorHash,
      role: 'creator',
      consentAt: new Date(),
      kycStatus: 'verified',
    })
    .onConflictDoNothing()
    .returning();

  if (creator) {
    await db.insert(creatorProfiles).values({
      userId: creator.id,
      displayName: 'FOXY Creator',
      username: 'foxy',
      bio: 'Official FOXY Creator Platform demo',
      category: 'Entertainment',
    });
    await db.insert(creatorSettings).values({ userId: creator.id });
  }

  await db
    .insert(users)
    .values({
      email: 'visitor@foxy.app',
      passwordHash: visitorHash,
      role: 'visitor',
      consentAt: new Date(),
    })
    .onConflictDoNothing();

  const stickers = [
    { name: 'Rose', price: 10 },
    { name: 'Coffee', price: 20 },
    { name: 'Cake', price: 50 },
    { name: 'Crown', price: 100 },
    { name: 'Diamond', price: 500 },
  ];

  for (const s of stickers) {
    await db.insert(giftStickers).values(s).onConflictDoNothing();
  }

  const features = ['vote', 'gift', 'chat', 'call', 'live', 'subscription', 'unlock'];
  for (const feature of features) {
    await db
      .insert(revenueShares)
      .values({ feature, platformPct: 30, creatorPct: 70 })
      .onConflictDoNothing();
  }

  console.log('✅ Engine seed complete');
  console.log('   Creator: creator@foxy.app / creator123');
  console.log('   Visitor: visitor@foxy.app / visitor123');

  await client.end();
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
