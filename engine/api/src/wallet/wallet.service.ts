import { Injectable, BadRequestException } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';
import { DatabaseService } from '../database/database.service';
import {
  revenueShares,
  walletTransactions,
  wallets,
} from '../database/schema';

@Injectable()
export class WalletService {
  constructor(private readonly database: DatabaseService) {}

  async ensureWallet(userId: number) {
    const [existing] = await this.database.db
      .select()
      .from(wallets)
      .where(eq(wallets.userId, userId))
      .limit(1);
    if (existing) return existing;
    const [created] = await this.database.db
      .insert(wallets)
      .values({ userId })
      .returning();
    return created;
  }

  async getBalance(userId: number) {
    const wallet = await this.ensureWallet(userId);
    return wallet.balance;
  }

  async topup(userId: number, amount: number, idempotencyKey?: string) {
    if (amount <= 0) throw new BadRequestException('Invalid amount');
    const wallet = await this.ensureWallet(userId);
    await this.database.db
      .update(wallets)
      .set({
        balance: sql`${wallets.balance} + ${amount}`,
        updatedAt: new Date(),
      })
      .where(eq(wallets.id, wallet.id));
    await this.database.db.insert(walletTransactions).values({
      walletId: wallet.id,
      type: 'topup',
      amount,
      idempotencyKey: idempotencyKey ?? null,
    });
    return this.getBalance(userId);
  }

  async deduct(userId: number, amount: number, reference: string) {
    const wallet = await this.ensureWallet(userId);
    if (wallet.balance < amount) {
      throw new BadRequestException('Insufficient balance');
    }
    await this.database.db
      .update(wallets)
      .set({
        balance: sql`${wallets.balance} - ${amount}`,
        updatedAt: new Date(),
      })
      .where(eq(wallets.id, wallet.id));
    await this.database.db.insert(walletTransactions).values({
      walletId: wallet.id,
      type: 'spend',
      amount: -amount,
      reference,
    });
  }

  async credit(userId: number, amount: number, reference: string) {
    const wallet = await this.ensureWallet(userId);
    await this.database.db
      .update(wallets)
      .set({
        balance: sql`${wallets.balance} + ${amount}`,
        updatedAt: new Date(),
      })
      .where(eq(wallets.id, wallet.id));
    await this.database.db.insert(walletTransactions).values({
      walletId: wallet.id,
      type: 'earn',
      amount,
      reference,
    });
  }

  async splitPayment(
    feature: string,
    creatorId: number,
    visitorId: number,
    amount: number,
    reference: string,
  ) {
    const [share] = await this.database.db
      .select()
      .from(revenueShares)
      .where(eq(revenueShares.feature, feature))
      .limit(1);

    const creatorPct = share?.creatorPct ?? 70;
    const creatorAmount = Math.floor((amount * creatorPct) / 100);
    const platformAmount = amount - creatorAmount;

    await this.deduct(visitorId, amount, reference);
    await this.credit(creatorId, creatorAmount, reference);

    return { creatorAmount, platformAmount, creatorPct };
  }

  async getTransactions(userId: number, limit = 50) {
    const wallet = await this.ensureWallet(userId);
    return this.database.db
      .select()
      .from(walletTransactions)
      .where(eq(walletTransactions.walletId, wallet.id))
      .orderBy(sql`${walletTransactions.createdAt} DESC`)
      .limit(limit);
  }
}
