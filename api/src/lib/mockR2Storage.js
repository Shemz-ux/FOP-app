import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// Mock R2 Storage for testing environment
// This simulates R2 operations without requiring actual R2 credentials

const MOCK_STORAGE_DIR = path.join(process.cwd(), 'temp', 'mock-r2');

// Ensure mock storage directory exists
const ensureMockStorageDir = () => {
    if (!fs.existsSync(MOCK_STORAGE_DIR)) {
        fs.mkdirSync(MOCK_STORAGE_DIR, { recursive: true });
    }
};

// Generate unique storage key for file
const generateStorageKey = (originalFileName, category) => {
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(8).toString('hex');
    const fileExtension = originalFileName.split('.').pop();
    return `${category}/${timestamp}-${randomString}.${fileExtension}`;
};

// Mock upload file
const uploadFile = async (fileBuffer, fileName, contentType, category = 'general') => {
    try {
        ensureMockStorageDir();
        
        const storageKey = generateStorageKey(fileName, category);
        const filePath = path.join(MOCK_STORAGE_DIR, storageKey.replace('/', '_'));
        
        // Create directory if it doesn't exist
        const fileDir = path.dirname(filePath);
        if (!fs.existsSync(fileDir)) {
            fs.mkdirSync(fileDir, { recursive: true });
        }
        
        // Write file to mock storage
        fs.writeFileSync(filePath, fileBuffer);
        
        // Generate mock public URL
        const publicUrl = `http://localhost:3000/mock-r2/${storageKey}`;

        return {
            storageKey,
            publicUrl,
            success: true
        };
    } catch (error) {
        console.error('Mock R2 Upload Error:', error);
        throw new Error(`Failed to upload file to mock R2: ${error.message}`);
    }
};

// Mock generate download URL
const generateDownloadUrl = async (storageKey, expiresIn = 3600) => {
    try {
        // Return a mock presigned URL
        const mockUrl = `http://localhost:3000/mock-r2/download/${encodeURIComponent(storageKey)}?expires=${Date.now() + (expiresIn * 1000)}`;
        return mockUrl;
    } catch (error) {
        console.error('Mock R2 Download URL Error:', error);
        throw new Error(`Failed to generate mock download URL: ${error.message}`);
    }
};

// Mock get file metadata
const getFileMetadata = async (storageKey) => {
    try {
        const filePath = path.join(MOCK_STORAGE_DIR, storageKey.replace('/', '_'));
        
        if (!fs.existsSync(filePath)) {
            throw new Error('File not found');
        }
        
        const stats = fs.statSync(filePath);
        
        return {
            contentType: 'application/pdf', // Mock content type
            contentLength: stats.size,
            lastModified: stats.mtime,
            metadata: {
                'original-name': 'mock-file.pdf',
                'upload-date': stats.birthtime.toISOString(),
                'category': 'mock'
            }
        };
    } catch (error) {
        console.error('Mock R2 Metadata Error:', error);
        throw new Error(`Failed to get mock file metadata: ${error.message}`);
    }
};

// Mock delete file
const deleteFile = async (storageKey) => {
    try {
        const filePath = path.join(MOCK_STORAGE_DIR, storageKey.replace('/', '_'));
        
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        
        return { success: true };
    } catch (error) {
        console.error('Mock R2 Delete Error:', error);
        throw new Error(`Failed to delete mock file: ${error.message}`);
    }
};

// Mock check if file exists
const fileExists = async (storageKey) => {
    try {
        const filePath = path.join(MOCK_STORAGE_DIR, storageKey.replace('/', '_'));
        return fs.existsSync(filePath);
    } catch (error) {
        return false;
    }
};

// Mock get file stream
const getFileStream = async (storageKey) => {
    try {
        const filePath = path.join(MOCK_STORAGE_DIR, storageKey.replace('/', '_'));
        
        if (!fs.existsSync(filePath)) {
            throw new Error('File not found');
        }
        
        return fs.createReadStream(filePath);
    } catch (error) {
        console.error('Mock R2 Stream Error:', error);
        throw new Error(`Failed to get mock file stream: ${error.message}`);
    }
};

// Validate file type for resources
const validateFileType = (fileName, allowedTypes = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'txt', 'rtf']) => {
    const fileExtension = fileName.split('.').pop().toLowerCase();
    return allowedTypes.includes(fileExtension);
};

// Validate file size (max 50MB for resources)
const validateFileSize = (fileSize, maxSize = 50 * 1024 * 1024) => {
    return fileSize <= maxSize;
};

export {
    uploadFile,
    generateDownloadUrl,
    getFileMetadata,
    deleteFile,
    fileExists,
    getFileStream,
    generateStorageKey,
    validateFileType,
    validateFileSize
};
