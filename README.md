# QB Elite Web (PWA)

Next.js 14 Progressive Web App. Replaces the App Store funnel for user
acquisition so new subscribers pay via Stripe directly (no Apple/Google
commission).

Runs in parallel with the Flutter app on the App Store — existing IAP
subscribers stay on Apple.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind 3 + shadcn/ui (Radix primitives)
- Supabase Auth + Postgres + RLS (shared backend with the Flutter app)
- TanStack Query v5 for client-side data
- Stripe Checkout + Customer Portal (added in Sprint 4)
- Deployed to Vercel at https://app.quarterbackelite.app

## Local dev

```bash
npm install
cp .env.local.example .env.local   # fill in Supabase + Stripe keys
npm run dev
```

`.env.local` keys: see `.env.local.example`.

## Project layout

```
app/
  (marketing)/      public, SSR
  (auth)/           login, register, forgot, reset-password
  (app)/            authenticated shell, middleware-gated
  api/stripe/       checkout + portal route handlers (Sprint 4)
  auth/callback/    OAuth + email-verify exchange
components/
  app/              tab-bar, top-bar, app-only chrome
  ui/               shadcn primitives (ported from Admin-Panel)
  providers.tsx     TanStack Query + Toaster
features/           per-feature query hooks + components
lib/
  supabase/         browser, server, middleware clients (@supabase/ssr)
  tier.ts           tier comparator + display name helper
types/db.ts         Supabase types
middleware.ts       session refresh + auth gate
```

## Deploy

GitHub `main` → Vercel auto-deploy. PR previews enabled.

## Backend

This repo does NOT contain the database schema. Source of truth lives in
`qb_elite_source/supabase/migrations/`. All RLS policies, RPCs, and
Edge Functions (`sync-mailchimp`) work unchanged. Sprint 4 adds 3
nullable columns to `profiles` for Stripe linkage.

## Sprint roadmap

See the planning doc for the full 5-sprint plan.
