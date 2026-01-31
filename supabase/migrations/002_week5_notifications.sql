-- PriceGhost Week 5 Schema Updates
-- Run this in your Supabase SQL Editor

-- Add new columns to user_preferences for enhanced notification settings
ALTER TABLE user_preferences 
ADD COLUMN IF NOT EXISTS weekly_digest_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS weekly_digest_day TEXT DEFAULT 'monday' CHECK (weekly_digest_day IN ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')),
ADD COLUMN IF NOT EXISTS quiet_hours_start INTEGER DEFAULT NULL,
ADD COLUMN IF NOT EXISTS quiet_hours_end INTEGER DEFAULT NULL,
ADD COLUMN IF NOT EXISTS check_frequency TEXT DEFAULT '6h',
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD',
ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'UTC',
ADD COLUMN IF NOT EXISTS last_digest_sent TIMESTAMPTZ DEFAULT NULL;

-- Update notification_frequency check constraint
ALTER TABLE user_preferences 
DROP CONSTRAINT IF EXISTS user_preferences_notification_frequency_check;

ALTER TABLE user_preferences 
ADD CONSTRAINT user_preferences_notification_frequency_check 
CHECK (notification_frequency IN ('instant', 'daily', 'weekly', 'none'));

-- Create email_logs table to track sent emails
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email_type TEXT NOT NULL CHECK (email_type IN ('price_drop', 'target_reached', 'weekly_digest', 'welcome')),
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  subject TEXT,
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'bounced'))
);

-- Index for email_logs
CREATE INDEX IF NOT EXISTS idx_email_logs_user_id ON email_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at ON email_logs(sent_at);
CREATE INDEX IF NOT EXISTS idx_email_logs_email_type ON email_logs(email_type);

-- RLS for email_logs
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own email logs" ON email_logs
  FOR SELECT USING (auth.uid() = user_id);

-- Add recorded_at column alias for price_history if not exists
-- (using checked_at as the timestamp column)
