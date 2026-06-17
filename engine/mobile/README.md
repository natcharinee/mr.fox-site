# Mr.FOX Engine — Flutter Mobile

Creator/Visitor mobile app for the Engine platform.

## Prerequisites

- [Flutter SDK](https://flutter.dev) 3.2+
- Engine API running at `http://localhost:4000`

## Setup

```bash
# Install Flutter first, then:
cd engine/mobile
flutter pub get
flutter run
```

## Design Tokens

Uses shared tokens from repo root `DESIGN.md` — see `lib/theme/tokens.dart`.

## API Base URL

Configure in app (TODO: env config):

```
http://localhost:4000/api/v1
```

## Features (WBS)

- [x] App scaffold + theme
- [ ] Auth (login/register)
- [ ] Feed + Profile
- [ ] Wallet + Vote + Gift
- [ ] Chat (WebSocket)
- [ ] Live (LiveKit SDK)
