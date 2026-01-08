-- Migration: Extend users_profile table for comprehensive profile management
-- Created: 2026-01-08

-- Add new columns to users_profile table
ALTER TABLE users_profile
ADD COLUMN IF NOT EXISTS phone_number text,
ADD COLUMN IF NOT EXISTS bio text,
ADD COLUMN IF NOT EXISTS theme_preference text DEFAULT 'system' CHECK (theme_preference IN ('light', 'dark', 'system')),
ADD COLUMN IF NOT EXISTS notification_email boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS notification_push boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS language text DEFAULT 'en',
ADD COLUMN IF NOT EXISTS timezone text DEFAULT 'UTC';

-- Add comment for documentation
COMMENT ON COLUMN users_profile.phone_number IS 'User phone number for contact';
COMMENT ON COLUMN users_profile.bio IS 'User biography or about section';
COMMENT ON COLUMN users_profile.theme_preference IS 'UI theme preference: light, dark, or system';
COMMENT ON COLUMN users_profile.notification_email IS 'Enable/disable email notifications';
COMMENT ON COLUMN users_profile.notification_push IS 'Enable/disable push notifications';
COMMENT ON COLUMN users_profile.language IS 'User preferred language code';
COMMENT ON COLUMN users_profile.timezone IS 'User timezone for scheduling';
