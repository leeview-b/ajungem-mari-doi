# Authentication Troubleshooting Guide

## Common Issue: Authentication Not Working

If you're experiencing issues with user signup or login, follow these steps:

### 1. Disable Email Confirmation (For Development)

By default, Supabase requires email confirmation. To disable this for development:

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Providers** → **Email**
3. Under "Email Settings":
   - **Uncheck** "Confirm email"
   - Click **Save**

### 2. Verify Database Migration

Ensure the database migration has been executed:

1. Go to Supabase Dashboard → **SQL Editor**
2. Create a new query
3. Copy and paste the entire content from `supabase/migrations/001_initial_schema.sql`
4. Click **Run** to execute the migration

This will create:
- ✅ `profiles` table
- ✅ `events` table
- ✅ `visit_reports` table
- ✅ `messages` table
- ✅ All RLS policies
- ✅ Trigger to auto-create profile on signup

### 3. Verify Tables Were Created

Check if tables exist:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

You should see: `profiles`, `events`, `visit_reports`, `messages`

### 4. Test Profile Creation Trigger

After signing up a user, check if profile was created:

```sql
SELECT * FROM profiles;
```

If profiles are not being created automatically, the trigger might not be working. Re-run the trigger creation:

```sql
-- Drop existing trigger and function (if any)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Recreate function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
```

### 5. Check RLS Policies

Verify that Row Level Security policies are working:

```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- View all policies
SELECT * FROM pg_policies WHERE schemaname = 'public';
```

### 6. Test Authentication Flow

**Sign Up:**
1. Go to `/signup`
2. Fill in: Full Name, Email, Password
3. Click "Înregistrează-te"
4. Should redirect to `/dashboard`

**Login:**
1. Go to `/login`
2. Enter Email and Password
3. Click "Autentifică-te"
4. Should redirect to `/dashboard`

### 7. Check Browser Console

Open browser DevTools (F12) and check:
- **Console** for JavaScript errors
- **Network** tab to see API calls to Supabase
- Look for auth-related errors

### 8. Verify Environment Variables

Ensure `.env.local` has correct values:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**Note:** The anon key should start with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`, not `sb_publishable_...`

### 9. Get the Correct Anon Key

The `sb_publishable_` key is NOT the correct anon key. Get the right one:

1. Go to Supabase Dashboard
2. Click **Settings** (⚙️) → **API**
3. Under "Project API keys", find **"anon public"** (NOT the publishable key)
4. Copy the long JWT token that starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`
5. Update `.env.local` with this key

### 10. Common Error Messages

| Error | Solution |
|-------|----------|
| "Invalid login credentials" | User doesn't exist or wrong password |
| "Email not confirmed" | Disable email confirmation (see step 1) |
| "User already registered" | Email already exists, try logging in |
| "AuthApiError: Invalid API key" | Wrong anon key, check step 9 |
| No redirect after signup | Check browser console for errors |

### 11. Manual User Creation (Testing)

If automatic signup isn't working, create a test user manually:

1. Go to Supabase Dashboard → **Authentication** → **Users**
2. Click **Add user**
3. Enter email and password
4. Click **Create user**
5. Manually insert profile:

```sql
INSERT INTO profiles (id, email, full_name, role)
VALUES (
  'user-uuid-from-auth-users',
  'test@example.com',
  'Test User',
  'volunteer'
);
```

### Still Having Issues?

Check the Supabase logs:
1. Go to **Logs** → **Auth Logs** in Supabase Dashboard
2. Look for failed authentication attempts
3. Check error messages for clues

---

## Production Checklist

Before deploying to production:

- [ ] Enable email confirmation
- [ ] Configure email templates
- [ ] Set up proper email provider (SendGrid, AWS SES, etc.)
- [ ] Add password reset functionality
- [ ] Configure site URL in Supabase settings
- [ ] Set up proper redirect URLs
