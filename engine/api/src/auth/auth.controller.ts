import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { SignJWT } from 'jose';
import * as bcrypt from 'bcryptjs';
import { Public } from '../common/decorators';
import { DatabaseService } from '../database/database.service';
import {
  creatorProfiles,
  creatorSettings,
  users,
} from '../database/schema';
import { WalletService } from '../wallet/wallet.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly database: DatabaseService,
    private readonly walletService: WalletService,
  ) {}

  @Public()
  @Post('register')
  async register(
    @Body()
    body: {
      email: string;
      password: string;
      role?: 'creator' | 'visitor';
      displayName?: string;
      username?: string;
      consent?: boolean;
    },
  ) {
    if (!body.consent) {
      throw new UnauthorizedException('PDPA consent required');
    }

    const passwordHash = await bcrypt.hash(body.password, 12);
    const role = body.role ?? 'visitor';

    const [user] = await this.database.db
      .insert(users)
      .values({
        email: body.email,
        passwordHash,
        role,
        consentAt: new Date(),
      })
      .returning();

    if (role === 'creator' && body.displayName && body.username) {
      await this.database.db.insert(creatorProfiles).values({
        userId: user.id,
        displayName: body.displayName,
        username: body.username,
      });
      await this.database.db.insert(creatorSettings).values({
        userId: user.id,
      });
    }

    await this.walletService.ensureWallet(user.id);
    const tokens = await this.signTokens(user.id, user.email, user.role);
    return { user: { id: user.id, email: user.email, role: user.role }, ...tokens };
  }

  @Public()
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const [user] = await this.database.db
      .select()
      .from(users)
      .where(eq(users.email, body.email))
      .limit(1);

    if (!user || !(await bcrypt.compare(body.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.signTokens(user.id, user.email, user.role);
    return {
      user: { id: user.id, email: user.email, role: user.role },
      ...tokens,
    };
  }

  private async signTokens(userId: number, email: string, role: string) {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET is not set');
    const key = new TextEncoder().encode(secret);

    const accessToken = await new SignJWT({ email, role })
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject(String(userId))
      .setIssuedAt()
      .setExpirationTime('8h')
      .sign(key);

    const refreshToken = await new SignJWT({ type: 'refresh' })
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject(String(userId))
      .setIssuedAt()
      .setExpirationTime('30d')
      .sign(key);

    return { accessToken, refreshToken };
  }
}
