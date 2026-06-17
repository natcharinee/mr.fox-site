import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['creator', 'visitor', 'admin']);
export const kycStatusEnum = pgEnum('kyc_status', [
  'none',
  'pending',
  'verified',
  'rejected',
]);
export const postTypeEnum = pgEnum('post_type', [
  'photo',
  'video',
  'text',
  'album',
]);
export const walletTxTypeEnum = pgEnum('wallet_tx_type', [
  'topup',
  'spend',
  'earn',
  'withdraw',
]);
export const callTypeEnum = pgEnum('call_type', ['voice', 'video']);
export const callStatusEnum = pgEnum('call_status', [
  'pending',
  'active',
  'completed',
  'cancelled',
]);
export const liveRoomTypeEnum = pgEnum('live_room_type', [
  'free',
  'paid',
  'password',
  'paid_password',
]);
export const fanClubTierEnum = pgEnum('fan_club_tier', [
  'bronze',
  'silver',
  'gold',
  'platinum',
  'diamond',
]);
export const rankingPeriodEnum = pgEnum('ranking_period', [
  'daily',
  'weekly',
  'monthly',
  'all_time',
]);

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  role: userRoleEnum('role').notNull().default('visitor'),
  email: text('email').notNull().unique(),
  phone: text('phone'),
  passwordHash: text('password_hash').notNull(),
  kycStatus: kycStatusEnum('kyc_status').notNull().default('none'),
  consentAt: timestamp('consent_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const creatorProfiles = pgTable('creator_profiles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' })
    .unique(),
  displayName: text('display_name').notNull(),
  username: text('username').notNull().unique(),
  bio: text('bio'),
  category: text('category'),
  location: text('location'),
  profileImageUrl: text('profile_image_url'),
  coverImageUrl: text('cover_image_url'),
  socialLinks: text('social_links'),
});

export const creatorSettings = pgTable('creator_settings', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' })
    .unique(),
  chatPrice: integer('chat_price').notNull().default(10),
  voicePrice: integer('voice_price').notNull().default(20),
  videoPrice: integer('video_price').notNull().default(50),
  subPriceMonthly: integer('sub_price_monthly').notNull().default(99),
});

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  creatorId: integer('creator_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  type: postTypeEnum('type').notNull(),
  content: text('content'),
  isLocked: boolean('is_locked').notNull().default(false),
  price: integer('price'),
  isPinned: boolean('is_pinned').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const postMedia = pgTable('post_media', {
  id: serial('id').primaryKey(),
  postId: integer('post_id')
    .notNull()
    .references(() => posts.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  blurUrl: text('blur_url'),
  mediaType: text('media_type').notNull(),
});

export const follows = pgTable(
  'follows',
  {
    id: serial('id').primaryKey(),
    followerId: integer('follower_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    creatorId: integer('creator_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [uniqueIndex('follows_unique').on(t.followerId, t.creatorId)],
);

export const postLikes = pgTable(
  'post_likes',
  {
    id: serial('id').primaryKey(),
    postId: integer('post_id')
      .notNull()
      .references(() => posts.id, { onDelete: 'cascade' }),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
  },
  (t) => [uniqueIndex('likes_unique').on(t.postId, t.userId)],
);

export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  postId: integer('post_id')
    .notNull()
    .references(() => posts.id, { onDelete: 'cascade' }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const wallets = pgTable('wallets', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' })
    .unique(),
  balance: integer('balance').notNull().default(0),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const walletTransactions = pgTable('wallet_transactions', {
  id: serial('id').primaryKey(),
  walletId: integer('wallet_id')
    .notNull()
    .references(() => wallets.id),
  type: walletTxTypeEnum('type').notNull(),
  amount: integer('amount').notNull(),
  reference: text('reference'),
  idempotencyKey: text('idempotency_key').unique(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const revenueShares = pgTable('revenue_shares', {
  id: serial('id').primaryKey(),
  feature: text('feature').notNull(),
  creatorId: integer('creator_id').references(() => users.id),
  platformPct: integer('platform_pct').notNull().default(30),
  creatorPct: integer('creator_pct').notNull().default(70),
});

export const giftStickers = pgTable('gift_stickers', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  price: integer('price').notNull(),
  animationUrl: text('animation_url'),
});

export const votes = pgTable('votes', {
  id: serial('id').primaryKey(),
  visitorId: integer('visitor_id')
    .notNull()
    .references(() => users.id),
  postId: integer('post_id')
    .notNull()
    .references(() => posts.id),
  amount: integer('amount').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const gifts = pgTable('gifts', {
  id: serial('id').primaryKey(),
  visitorId: integer('visitor_id')
    .notNull()
    .references(() => users.id),
  creatorId: integer('creator_id')
    .notNull()
    .references(() => users.id),
  stickerId: integer('sticker_id')
    .notNull()
    .references(() => giftStickers.id),
  amount: integer('amount').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const subscriptions = pgTable('subscriptions', {
  id: serial('id').primaryKey(),
  visitorId: integer('visitor_id')
    .notNull()
    .references(() => users.id),
  creatorId: integer('creator_id')
    .notNull()
    .references(() => users.id),
  period: text('period').notNull(),
  amount: integer('amount').notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const unlocks = pgTable(
  'unlocks',
  {
    id: serial('id').primaryKey(),
    visitorId: integer('visitor_id')
      .notNull()
      .references(() => users.id),
    postId: integer('post_id')
      .notNull()
      .references(() => posts.id),
    amount: integer('amount').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [uniqueIndex('unlocks_unique').on(t.visitorId, t.postId)],
);

export const chats = pgTable('chats', {
  id: serial('id').primaryKey(),
  creatorId: integer('creator_id')
    .notNull()
    .references(() => users.id),
  visitorId: integer('visitor_id')
    .notNull()
    .references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const chatMessages = pgTable('chat_messages', {
  id: serial('id').primaryKey(),
  chatId: integer('chat_id')
    .notNull()
    .references(() => chats.id, { onDelete: 'cascade' }),
  senderId: integer('sender_id')
    .notNull()
    .references(() => users.id),
  content: text('content').notNull(),
  amountPaid: integer('amount_paid').notNull().default(0),
  readAt: timestamp('read_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const liveRooms = pgTable('live_rooms', {
  id: serial('id').primaryKey(),
  creatorId: integer('creator_id')
    .notNull()
    .references(() => users.id),
  title: text('title').notNull(),
  type: liveRoomTypeEnum('type').notNull().default('free'),
  price: integer('price'),
  password: text('password'),
  status: text('status').notNull().default('scheduled'),
  sfuRoomId: text('sfu_room_id'),
  startedAt: timestamp('started_at', { withTimezone: true }),
  endedAt: timestamp('ended_at', { withTimezone: true }),
});

export const liveArchives = pgTable('live_archives', {
  id: serial('id').primaryKey(),
  roomId: integer('room_id')
    .notNull()
    .references(() => liveRooms.id),
  videoUrl: text('video_url').notNull(),
  price: integer('price').notNull().default(0),
});

export const calls = pgTable('calls', {
  id: serial('id').primaryKey(),
  type: callTypeEnum('type').notNull(),
  creatorId: integer('creator_id')
    .notNull()
    .references(() => users.id),
  visitorId: integer('visitor_id')
    .notNull()
    .references(() => users.id),
  pricePerMin: integer('price_per_min').notNull(),
  durationSec: integer('duration_sec').notNull().default(0),
  amount: integer('amount').notNull().default(0),
  status: callStatusEnum('status').notNull().default('pending'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const fanClubs = pgTable(
  'fan_clubs',
  {
    id: serial('id').primaryKey(),
    visitorId: integer('visitor_id')
      .notNull()
      .references(() => users.id),
    creatorId: integer('creator_id')
      .notNull()
      .references(() => users.id),
    tier: fanClubTierEnum('tier').notNull().default('bronze'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [uniqueIndex('fan_club_unique').on(t.visitorId, t.creatorId)],
);

export const rankings = pgTable(
  'rankings',
  {
    id: serial('id').primaryKey(),
    creatorId: integer('creator_id')
      .notNull()
      .references(() => users.id),
    period: rankingPeriodEnum('period').notNull(),
    score: integer('score').notNull().default(0),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [uniqueIndex('ranking_unique').on(t.creatorId, t.period)],
);

export const payouts = pgTable('payouts', {
  id: serial('id').primaryKey(),
  creatorId: integer('creator_id')
    .notNull()
    .references(() => users.id),
  amount: integer('amount').notNull(),
  status: text('status').notNull().default('pending'),
  requestedAt: timestamp('requested_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  payload: text('payload'),
  readAt: timestamp('read_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const reports = pgTable('reports', {
  id: serial('id').primaryKey(),
  reporterId: integer('reporter_id')
    .notNull()
    .references(() => users.id),
  targetType: text('target_type').notNull(),
  targetId: integer('target_id').notNull(),
  reason: text('reason').notNull(),
  status: text('status').notNull().default('open'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const moderationLogs = pgTable('moderation_logs', {
  id: serial('id').primaryKey(),
  adminId: integer('admin_id')
    .notNull()
    .references(() => users.id),
  action: text('action').notNull(),
  targetType: text('target_type').notNull(),
  targetId: integer('target_id').notNull(),
  details: text('details'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});
