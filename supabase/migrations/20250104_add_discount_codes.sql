-- Migration: Add Discount Codes functionality
-- Created: 2025-01-04
-- Description: Creates tables and columns for discount code management

-- ============================================
-- 1. Create discount_codes table
-- ============================================
CREATE TABLE IF NOT EXISTS discount_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed', 'free_months', 'free_forever')),
    discount_value NUMERIC NOT NULL DEFAULT 0,
    applicable_tiers TEXT[] DEFAULT NULL, -- NULL means all tiers, e.g., ARRAY['starter', 'pro']
    max_uses INTEGER DEFAULT NULL, -- NULL means unlimited
    current_uses INTEGER NOT NULL DEFAULT 0,
    valid_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    valid_until TIMESTAMPTZ DEFAULT NULL, -- NULL means never expires
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for efficient code lookup
CREATE INDEX IF NOT EXISTS idx_discount_codes_code ON discount_codes(LOWER(code));
CREATE INDEX IF NOT EXISTS idx_discount_codes_active ON discount_codes(is_active) WHERE is_active = TRUE;

-- ============================================
-- 2. Create user_discount_codes table (junction table)
-- ============================================
CREATE TABLE IF NOT EXISTS user_discount_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    discount_code_id UUID NOT NULL REFERENCES discount_codes(id) ON DELETE CASCADE,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT NULL, -- When the discount effect expires
    is_consumed BOOLEAN NOT NULL DEFAULT FALSE, -- For one-time use codes
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, discount_code_id)
);

-- Index for user lookups
CREATE INDEX IF NOT EXISTS idx_user_discount_codes_user ON user_discount_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_discount_codes_code ON user_discount_codes(discount_code_id);

-- ============================================
-- 3. Add discount-related columns to users table
-- ============================================
DO $$
BEGIN
    -- Add discount_code_applied column if not exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'users' AND column_name = 'discount_code_applied'
    ) THEN
        ALTER TABLE users ADD COLUMN discount_code_applied VARCHAR(50) DEFAULT NULL;
    END IF;

    -- Add trial_ends_at column if not exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'users' AND column_name = 'trial_ends_at'
    ) THEN
        ALTER TABLE users ADD COLUMN trial_ends_at TIMESTAMPTZ DEFAULT NULL;
    END IF;

    -- Add is_lifetime_access column if not exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'users' AND column_name = 'is_lifetime_access'
    ) THEN
        ALTER TABLE users ADD COLUMN is_lifetime_access BOOLEAN DEFAULT FALSE;
    END IF;
END
$$;

-- ============================================
-- 4. Create trigger for updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_discount_codes_updated_at ON discount_codes;
CREATE TRIGGER update_discount_codes_updated_at
    BEFORE UPDATE ON discount_codes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 5. Row Level Security (RLS) policies
-- ============================================
ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_discount_codes ENABLE ROW LEVEL SECURITY;

-- Discount codes: only admins can manage, everyone can read active codes
CREATE POLICY "discount_codes_select_active" ON discount_codes
    FOR SELECT USING (is_active = TRUE);

-- User discount codes: users can only see their own
CREATE POLICY "user_discount_codes_select_own" ON user_discount_codes
    FOR SELECT USING (auth.uid() = user_id);

-- Allow service role full access (for API routes)
CREATE POLICY "discount_codes_service_role" ON discount_codes
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "user_discount_codes_service_role" ON user_discount_codes
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================
-- 6. Sample discount codes (optional - remove in production)
-- ============================================
-- Uncomment to add sample codes for testing:
/*
INSERT INTO discount_codes (code, description, discount_type, discount_value, max_uses, valid_until)
VALUES
    ('WELCOME10', '10% off for new users', 'percentage', 10, 100, NOW() + INTERVAL '3 months'),
    ('FREEMONTH', 'One month free trial', 'free_months', 1, 50, NOW() + INTERVAL '1 month'),
    ('LAUNCH20', '20% launch discount', 'percentage', 20, 200, NOW() + INTERVAL '2 months'),
    ('BETA', 'Beta tester - 3 months free', 'free_months', 3, 25, NOW() + INTERVAL '1 month')
ON CONFLICT (code) DO NOTHING;
*/

-- ============================================
-- Migration complete
-- ============================================
COMMENT ON TABLE discount_codes IS 'Stores discount/promo codes for subscription offers';
COMMENT ON TABLE user_discount_codes IS 'Tracks which users have applied which discount codes';
