-- Migration: Increase file_type column length to support long mimetypes
-- Date: 2026-03-15
-- Reason: Word document mimetypes (application/vnd.openxmlformats-officedocument.wordprocessingml.document)
--         are 74 characters long, exceeding the current VARCHAR(50) limit

ALTER TABLE resources 
ALTER COLUMN file_type TYPE VARCHAR(255);
