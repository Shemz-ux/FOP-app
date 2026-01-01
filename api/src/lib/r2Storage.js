import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';

// Import mock storage for testing
import * as mockR2 from './mockR2Storage.js';

// Check if we're in test environment or using placeholder credentials
const isTestEnvironment = process.env.NODE_ENV === 'test' || 
    process.env.R2_ACCESS_KEY_ID === 'YOUR_R2_ACCESS_KEY_ID' ||
    !process.env.R2_ACCESS_KEY_ID;

// Cloudflare R2 Configuration
const R2_CONFIG = {
    region: 'auto', // Cloudflare R2 uses 'auto' region
    endpoint: process.env.R2_ENDPOINT || 'https://YOUR_ACCOUNT_ID.r2.cloudflarestorage.com',
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || 'YOUR_R2_ACCESS_KEY_ID',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || 'YOUR_R2_SECRET_ACCESS_KEY'
    },
    forcePathStyle: true // Required for R2
};

const BUCKET_NAME = process.env.R2_BUCKET_NAME || 'fop-resources';

// Initialize R2 client
const r2Client = new S3Client(R2_CONFIG);

// Generate unique storage key for file
const generateStorageKey = (originalFileName, category) => {
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(8).toString('hex');
    const fileExtension = originalFileName.split('.').pop();
    return `${category}/${timestamp}-${randomString}.${fileExtension}`;
};

// Upload file to R2
const uploadFile = async (fileBuffer, fileName, contentType, category = 'general') => {
    // Use mock storage in test environment or with placeholder credentials
    if (isTestEnvironment) {
        return await mockR2.uploadFile(fileBuffer, fileName, contentType, category);
    }
    
    try {
        const storageKey = generateStorageKey(fileName, category);
        
        const uploadParams = {
            Bucket: BUCKET_NAME,
            Key: storageKey,
            Body: fileBuffer,
            ContentType: contentType,
            Metadata: {
                'original-name': fileName,
                'upload-date': new Date().toISOString(),
                'category': category
            }
        };

        const command = new PutObjectCommand(uploadParams);
        await r2Client.send(command);

        // Generate public URL (if bucket is configured for public access)
        const publicUrl = `${R2_CONFIG.endpoint}/${BUCKET_NAME}/${storageKey}`;

        return {
            storageKey,
            publicUrl,
            success: true
        };
    } catch (error) {
        console.error('R2 Upload Error:', error);
        throw new Error(`Failed to upload file to R2: ${error.message}`);
    }
};

// Generate presigned download URL
const generateDownloadUrl = async (storageKey, expiresIn = 3600, fileName = null) => {
    // Use mock storage in test environment
    if (isTestEnvironment) {
        return await mockR2.generateDownloadUrl(storageKey, expiresIn);
    }
    
    try {
        const command = new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: storageKey,
            // Force download with proper filename
            ResponseContentDisposition: fileName ? 
                `attachment; filename="${fileName}"` : 
                'attachment'
        });

        const signedUrl = await getSignedUrl(r2Client, command, { expiresIn });
        return signedUrl;
    } catch (error) {
        console.error('R2 Download URL Error:', error);
        throw new Error(`Failed to generate download URL: ${error.message}`);
    }
};

// Get file metadata
const getFileMetadata = async (storageKey) => {
    // Use mock storage in test environment
    if (isTestEnvironment) {
        return await mockR2.getFileMetadata(storageKey);
    }
    
    try {
        const command = new HeadObjectCommand({
            Bucket: BUCKET_NAME,
            Key: storageKey
        });

        const response = await r2Client.send(command);
        return {
            contentType: response.ContentType,
            contentLength: response.ContentLength,
            lastModified: response.LastModified,
            metadata: response.Metadata
        };
    } catch (error) {
        console.error('R2 Metadata Error:', error);
        throw new Error(`Failed to get file metadata: ${error.message}`);
    }
};

// Delete file from R2
const deleteFile = async (storageKey) => {
    // Use mock storage in test environment
    if (isTestEnvironment) {
        return await mockR2.deleteFile(storageKey);
    }
    
    try {
        const command = new DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: storageKey
        });

        await r2Client.send(command);
        return { success: true };
    } catch (error) {
        console.error('R2 Delete Error:', error);
        throw new Error(`Failed to delete file from R2: ${error.message}`);
    }
};

// Check if file exists
const fileExists = async (storageKey) => {
    // Use mock storage in test environment
    if (isTestEnvironment) {
        return await mockR2.fileExists(storageKey);
    }
    
    try {
        await getFileMetadata(storageKey);
        return true;
    } catch (error) {
        return false;
    }
};

// Get file stream for download
const getFileStream = async (storageKey) => {
    // Use mock storage in test environment
    if (isTestEnvironment) {
        return await mockR2.getFileStream(storageKey);
    }
    
    try {
        const command = new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: storageKey
        });

        const response = await r2Client.send(command);
        return response.Body;
    } catch (error) {
        console.error('R2 Stream Error:', error);
        throw new Error(`Failed to get file stream: ${error.message}`);
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
    validateFileSize,
    r2Client,
    BUCKET_NAME
};
