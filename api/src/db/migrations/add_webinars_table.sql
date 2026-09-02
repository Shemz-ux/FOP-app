-- Create videos table for video uploads
CREATE TABLE IF NOT EXISTS webinars (
    -- YouTube source
    webinar_id SERIAL PRIMARY KEY,
    youtube_video_id VARCHAR(11) NOT NULL UNIQUE,   
    youtube_url TEXT NOT NULL,

    -- Video metadata
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    thumbnail_url TEXT NOT NULL,
    duration INTEGER NOT NULL,            
    published_at TIMESTAMP,             
    
    -- Engagement metrics
    view_count INT DEFAULT 0,
    like_count INT DEFAULT 0,
    
    -- Tracking
    metadata_synced_at TIMESTAMP,
    uploaded_by INT REFERENCES admin_users(admin_id),
    is_published BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_webinars_category ON webinars(category);
CREATE INDEX IF NOT EXISTS idx_webinars_is_published ON webinars(is_published);
CREATE INDEX IF NOT EXISTS idx_webinars_created_at ON webinars(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_webinars_title ON webinars(title);
CREATE INDEX IF NOT EXISTS idx_webinars_youtube_video_id ON webinars(youtube_video_id);