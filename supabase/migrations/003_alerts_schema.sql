-- PriceGhost Alerts Schema Updates
-- Run this in your Supabase SQL Editor

-- Add new columns to alerts table for storing price drop details
ALTER TABLE alerts 
ADD COLUMN IF NOT EXISTS message TEXT,
ADD COLUMN IF NOT EXISTS old_price DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS new_price DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT false;

-- Create index for is_read to quickly filter unread alerts
CREATE INDEX IF NOT EXISTS idx_alerts_is_read ON alerts(is_read);

-- Create index for created_at to sort alerts
CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON alerts(created_at);
