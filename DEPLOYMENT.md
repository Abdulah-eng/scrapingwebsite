# Deployment Guide

## Quick Start

### 1. Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Go to Settings > API to get your project URL and anon key
3. Go to Settings > Database to get your service role key
4. Run the SQL from `supabase/schema.sql` in the SQL Editor

### 2. Supabase Configuration

The Supabase credentials are already hardcoded:
- **Project URL**: `https://prdigwmezbxiqjqqqxeg.supabase.co`
- **Anon Key**: Already configured

**Note**: You'll need the service role key for data import. This is required to run the import script.

### 3. Import Data

```bash
# Copy the scraped data
npm run setup-data

# Import into Supabase
npm run import-data
```

### 4. Run Locally

```bash
npm run dev
```

## Vercel Deployment

### Option 1: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
```

### Option 2: GitHub Integration

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

## Other Platforms

### Netlify

1. Connect your GitHub repository
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Add environment variables in Netlify dashboard

### Railway

1. Connect your GitHub repository
2. Add environment variables
3. Deploy automatically

## Database Migration

If you need to reset your database:

```sql
-- Drop existing tables
DROP TABLE IF EXISTS contacts CASCADE;
DROP TABLE IF EXISTS colonies CASCADE;

-- Re-run the schema
-- Copy and paste the contents of supabase/schema.sql
```

## Troubleshooting

### Common Issues

1. **Environment variables not working**: Make sure they're in `.env.local` for local development
2. **Database connection failed**: Check your Supabase URL and keys
3. **Import script fails**: Ensure the data file exists and is valid JSON
4. **Build fails**: Check for TypeScript errors with `npm run lint`

### Support

- Check the [Next.js documentation](https://nextjs.org/docs)
- Check the [Supabase documentation](https://supabase.com/docs)
- Check the [Vercel documentation](https://vercel.com/docs)
