import cloudinary from '../config/cloudinary.js';
import { Readable } from 'stream';

const FOLDER_MAP = {
    event_image: 'event-images',
    company_logo: 'company-logos',
    organiser_logo: 'organiser-logos',
    other: 'misc'
};

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/webm'];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

export const validateMediaFile = (file, mediaPurpose) => {
    const errors = [];
    
    if (!file) {
        errors.push('No file provided');
        return { valid: false, errors };
    }

    const isImage = ALLOWED_IMAGE_TYPES.includes(file.mimetype);
    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.mimetype);

    if (!isImage && !isVideo) {
        errors.push(`Invalid file type. Allowed types: ${[...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES].join(', ')}`);
    }

    if (isImage && file.size > MAX_IMAGE_SIZE) {
        errors.push(`Image size exceeds maximum of ${MAX_IMAGE_SIZE / (1024 * 1024)}MB`);
    }

    if (isVideo && file.size > MAX_VIDEO_SIZE) {
        errors.push(`Video size exceeds maximum of ${MAX_VIDEO_SIZE / (1024 * 1024)}MB`);
    }

    if (!FOLDER_MAP[mediaPurpose]) {
        errors.push(`Invalid media purpose: ${mediaPurpose}`);
    }

    return {
        valid: errors.length === 0,
        errors,
        resourceType: isVideo ? 'video' : 'image'
    };
};

const bufferToStream = (buffer) => {
    const readable = new Readable();
    readable._read = () => {};
    readable.push(buffer);
    readable.push(null);
    return readable;
};

export const uploadToCloudinary = (file, mediaPurpose, options = {}) => {
    return new Promise((resolve, reject) => {
        console.log('🔍 Validating file...');
        const validation = validateMediaFile(file, mediaPurpose);
        
        if (!validation.valid) {
            console.error('❌ Validation failed:', validation.errors);
            return reject({
                status: 400,
                msg: 'File validation failed',
                errors: validation.errors
            });
        }

        const folder = FOLDER_MAP[mediaPurpose];
        const resourceType = validation.resourceType;

        console.log('📁 Upload config:', {
            folder,
            resourceType,
            fileSize: file.size,
            mimeType: file.mimetype
        });

        const uploadOptions = {
            folder: folder,
            resource_type: resourceType,
            use_filename: true,
            unique_filename: true,
            overwrite: false,
            ...options
        };

        const uploadStream = cloudinary.uploader.upload_stream(
            uploadOptions,
            (error, result) => {
                if (error) {
                    console.error('❌ Cloudinary upload error:', {
                        message: error.message,
                        http_code: error.http_code,
                        name: error.name,
                        error: error
                    });
                    return reject({
                        status: 500,
                        msg: 'Failed to upload to Cloudinary',
                        error: error.message,
                        cloudinaryError: error.http_code
                    });
                }
                console.log('✅ Cloudinary upload complete:', result.public_id);
                resolve(result);
            }
        );

        console.log('📤 Streaming file to Cloudinary...');
        bufferToStream(file.buffer).pipe(uploadStream);
    });
};

export const extractPublicIdFromUrl = (url) => {
    if (!url) return null;
    
    try {
        const urlParts = url.split('/');
        const uploadIndex = urlParts.indexOf('upload');
        
        if (uploadIndex === -1) return null;
        
        const pathAfterUpload = urlParts.slice(uploadIndex + 2).join('/');
        const publicIdWithExtension = pathAfterUpload;
        const publicId = publicIdWithExtension.substring(0, publicIdWithExtension.lastIndexOf('.'));
        
        return publicId;
    } catch (error) {
        console.error('Error extracting public_id:', error);
        return null;
    }
};

export const deleteFromCloudinary = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error('Cloudinary delete error:', error);
        throw {
            status: 500,
            msg: 'Failed to delete from Cloudinary',
            error: error.message
        };
    }
};
