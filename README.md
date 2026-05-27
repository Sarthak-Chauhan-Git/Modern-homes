# Modern Homes

Premium sanitary ware e-commerce platform built with Next.js 14, Supabase, and Cloudinary.

## Setup

1. Copy `.env.example` to `.env.local` and fill in credentials.
2. Run SQL in Supabase SQL Editor:
   - `supabase/migrations/001_init.sql`
   - `supabase/migrations/002_fix_profiles_policy_recursion.sql`
   - `supabase/migrations/003_fix_profile_write_policies.sql`
   - `supabase/migrations/004_sync_profile_metadata_on_signup.sql`
   - `supabase/migrations/005_fix_signup_trigger.sql`
   - `supabase/seed.sql`
3. Promote admin after registering:

```sql
update profiles set role = 'admin' where email = 'your@email.com';
```

4. Install and run:

```bash
pnpm install
pnpm dev
```

## Deploy (Vercel)

- Connect GitHub repo `Taksh-Studio/Modern-homes`
- Set all env vars from `.env.example`
- Add Supabase redirect URL: `https://your-domain.com/api/auth/callback`

## Stack

Next.js 14 · TypeScript · Tailwind · Supabase · Cloudinary · Zustand · Framer Motion
