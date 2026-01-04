-- Linked Accounts Migration
-- Creates table for storing linked platform accounts (Betfair, IBKR, Kraken)

-- 1. Create linked_accounts table
CREATE TABLE IF NOT EXISTS public.linked_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('betfair', 'ibkr', 'kraken')),
  platform_user_id TEXT,
  access_token TEXT, -- encrypted
  refresh_token TEXT, -- encrypted
  api_key TEXT, -- encrypted
  api_secret TEXT, -- encrypted
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  last_sync_at TIMESTAMPTZ,
  sync_error TEXT, -- Store last sync error message
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, platform)
);

-- 2. Enable RLS on linked_accounts
ALTER TABLE public.linked_accounts ENABLE ROW LEVEL SECURITY;

-- 3. Users can only read their own linked accounts
CREATE POLICY "Users can read own linked accounts"
  ON public.linked_accounts
  FOR SELECT
  USING (auth.uid() = user_id);

-- 4. Users can insert their own linked accounts
CREATE POLICY "Users can insert own linked accounts"
  ON public.linked_accounts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 5. Users can update their own linked accounts
CREATE POLICY "Users can update own linked accounts"
  ON public.linked_accounts
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 6. Users can delete their own linked accounts
CREATE POLICY "Users can delete own linked accounts"
  ON public.linked_accounts
  FOR DELETE
  USING (auth.uid() = user_id);

-- 7. Create trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_linked_accounts_updated_at ON public.linked_accounts;
CREATE TRIGGER update_linked_accounts_updated_at
  BEFORE UPDATE ON public.linked_accounts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 8. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_linked_accounts_user_id ON public.linked_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_linked_accounts_platform ON public.linked_accounts(platform);
CREATE INDEX IF NOT EXISTS idx_linked_accounts_is_active ON public.linked_accounts(is_active);

-- 9. Grant permissions
GRANT ALL ON public.linked_accounts TO authenticated;

-- 10. Create oauth_states table for CSRF protection during OAuth flow
CREATE TABLE IF NOT EXISTS public.oauth_states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  state TEXT NOT NULL UNIQUE,
  platform TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS on oauth_states
ALTER TABLE public.oauth_states ENABLE ROW LEVEL SECURITY;

-- Users can only access their own OAuth states
CREATE POLICY "Users can manage own oauth states"
  ON public.oauth_states
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create index for state lookup
CREATE INDEX IF NOT EXISTS idx_oauth_states_state ON public.oauth_states(state);

-- Grant permissions
GRANT ALL ON public.oauth_states TO authenticated;

-- Done!
-- Note: Credentials are encrypted at the application level before storage
