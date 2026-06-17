# Mr.FOX Creator Platform Engine API

NestJS backend for Creator/Visitor apps — Wallet, Vote, Gift, Chat, Live, Calls.

## Stack

- NestJS 11 · PostgreSQL · Drizzle ORM · Redis · JWT

## Quick Start

```bash
# From repo root
docker compose up -d postgres redis

# Create engine database (first time)
docker exec -it mrfox-postgres psql -U mrfox -c "CREATE DATABASE mrfox_engine;"

cd engine/api
cp .env.example .env
npm install
npm run db:push
npm run db:seed
npm run start:dev
```

API: http://localhost:4000/api/v1/health

## Demo Accounts

| Email | Password | Role |
|-------|----------|------|
| creator@foxy.app | creator123 | Creator |
| visitor@foxy.app | visitor123 | Visitor |

## API Modules

| Module | Endpoints |
|--------|-----------|
| Auth | POST /auth/register, /auth/login |
| Profiles | GET /profiles/:username, PUT /profiles/me |
| Posts | GET /posts/feed, POST /posts |
| Follows | POST /follows/:creatorId |
| Wallet | GET /wallet/balance, POST /wallet/topup |
| Votes | POST /votes/posts/:postId |
| Gifts | GET /gifts/stickers, POST /gifts/send |
| Subscriptions | POST /subscriptions |
| Unlocks | POST /unlocks/posts/:postId |
| Chats | POST /chats/:creatorId/messages |
| Live | POST /live/rooms, /live/rooms/:id/join |
| Calls | POST /calls |
| Rankings | GET /rankings/:period (Redis) |
| Fan Clubs | POST /fan-clubs/join |
| Moderation | POST /moderation/reports |
| Notifications | GET /notifications |

## Real-time

- **Live:** SFU token generation (LiveKit integration point)
- **Calls:** WebRTC signaling URL + TURN config
- **Chat:** REST MVP (WebSocket gateway = V2)
