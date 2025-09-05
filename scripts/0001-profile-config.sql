--
-- Profile Configurations
-- Tables and functions for managing user profiles
-- This is for storing whether a user is an org user or a person applying to jobs
--

CREATE TABLE IF NOT EXISTS profile_config (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
        is_org BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profile_config_user_id ON profile_config(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE profile_config ENABLE ROW LEVEL SECURITY;

-- Policy: Only allow users to view their own profile
CREATE POLICY "Users can view their own profile"
    ON profile_config
    FOR SELECT USING (auth.uid() = user_id);

-- Policy: Only allow users to update their own profile
CREATE POLICY "Users can update their own profile"
    ON profile_config
    FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Only allow users to insert their own profile
CREATE POLICY "Users can insert their own profile"
    ON profile_config
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Only allow users to delete their own profile
CREATE POLICY "Users can delete their own profile"
    ON profile_config
    FOR DELETE USING (auth.uid() = user_id);




--
-- org configuration for those that are in an org, the first member is the owner and admin
-- should include org name, description, logo_url, website, location, etc
--