-- Add password reset token columns to jobseekers table
ALTER TABLE jobseekers
ADD COLUMN IF NOT EXISTS password_reset_token_hash VARCHAR(255),
ADD COLUMN IF NOT EXISTS password_reset_expires_at TIMESTAMP;

-- Add password reset token columns to societies table
ALTER TABLE societies
ADD COLUMN IF NOT EXISTS password_reset_token_hash VARCHAR(255),
ADD COLUMN IF NOT EXISTS password_reset_expires_at TIMESTAMP;

-- Add password reset token columns to admin_users table
ALTER TABLE admin_users
ADD COLUMN IF NOT EXISTS password_reset_token_hash VARCHAR(255),
ADD COLUMN IF NOT EXISTS password_reset_expires_at TIMESTAMP;

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_jobseekers_reset_token ON jobseekers(password_reset_token_hash);
CREATE INDEX IF NOT EXISTS idx_societies_reset_token ON societies(password_reset_token_hash);
CREATE INDEX IF NOT EXISTS idx_admin_users_reset_token ON admin_users(password_reset_token_hash);
