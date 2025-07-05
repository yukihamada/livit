# Supabase Setup Guide

This guide explains how to set up Supabase for the LiveCommerce web application.

## Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Fill in your Supabase credentials:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
   - `SUPABASE_SERVICE_ROLE_KEY`: (Optional) Your Supabase service role key for server-side operations

## Database Schema

The TypeScript types in `/web/types/supabase.ts` define the expected database schema. You'll need to create the following tables in your Supabase project:

### Tables

1. **users** - User profiles
2. **live_streams** - Live streaming sessions
3. **products** - Product catalog
4. **stream_products** - Products featured in streams
5. **chat_messages** - Live chat messages
6. **orders** - Customer orders
7. **order_items** - Items in orders
8. **cart_items** - Shopping cart items
9. **follows** - User following relationships

## Authentication

The application uses Supabase Auth for user authentication. The following auth flows are supported:

- Email/Password sign up and sign in
- OAuth providers (can be configured in Supabase dashboard)
- Magic link authentication

## File Structure

- `/web/lib/supabase.ts` - Browser client initialization
- `/web/lib/supabase-server.ts` - Server-side client for Next.js server components
- `/web/lib/auth-helpers.ts` - Authentication helper functions
- `/web/components/supabase-provider.tsx` - React context provider for Supabase
- `/web/middleware.ts` - Next.js middleware for auth session management
- `/web/types/supabase.ts` - TypeScript types for database schema

## Usage Examples

### Client-side usage:
```typescript
import { useSupabase } from '@/components/supabase-provider'

function MyComponent() {
  const { supabase, user } = useSupabase()
  
  // Use supabase client
  const { data } = await supabase
    .from('products')
    .select('*')
}
```

### Server-side usage:
```typescript
import { createServerSupabaseClient } from '@/lib/supabase-server'

export default async function Page() {
  const supabase = await createServerSupabaseClient()
  const { data: products } = await supabase
    .from('products')
    .select('*')
  
  return <div>{/* render products */}</div>
}
```

### Authentication:
```typescript
import { signIn, signUp, signOut } from '@/lib/auth-helpers'

// Sign in
await signIn(email, password)

// Sign up
await signUp(email, password, username)

// Sign out
await signOut()
```

## Next Steps

1. Create a Supabase project at https://supabase.com
2. Set up the database schema according to the types defined
3. Configure authentication providers in the Supabase dashboard
4. Add Row Level Security (RLS) policies to your tables
5. Install dependencies: `yarn install` or `npm install`