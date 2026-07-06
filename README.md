# Devex — Domain-specific IT talent marketplace

Full-stack Next.js + Supabase. Deploy to Vercel in one click.

## Architecture
- **Frontend**: React (Next.js App Router)
- **Backend**: Next.js API Routes (Supabase never called from browser)
- **Database**: Supabase PostgreSQL (already configured)
- **Auth**: JWT sessions in httpOnly cookies — no localStorage

## Local dev
```bash
npm install
npm run dev
# Visit http://localhost:3000
```

## Deploy to Vercel
1. Push this repo to GitHub
2. vercel.com → New Project → import repo
3. Add env vars:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://nrqrdcgynmzymydhgwug.supabase.co`
   - `SUPABASE_ANON_KEY` = the anon key in `.env.local`
   - `SESSION_SECRET` = any random 32+ char string
4. Click Deploy
