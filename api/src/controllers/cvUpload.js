import {
    uploadFile,
    deleteFile,
    generateDownloadUrl
} from '../lib/r2Storage.js';

// Validate CV file type
const validateCVFileType = (file) => {
    const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(file.mimetype)) {
        throw {
            status: 400,
            msg: 'Invalid file type. Only PDF, DOC, and DOCX files are allowed.',
            errors: ['file_type']
        };
    }
};

// Validate CV file size (max 5MB)
const validateCVFileSize = (file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    
    if (file.size > maxSize) {
        throw {
            status: 400,
            msg: 'File size exceeds 5MB limit.',
            errors: ['file_size']
        };
    }
};

// Format file size for display
const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

// Upload CV to R2
export const uploadCV = async (req, res) => {
    try {
        console.log('📤 CV upload request received');
        console.log('File:', req.file ? `${req.file.originalname} (${req.file.size} bytes)` : 'No file');

        if (!req.file) {
            return res.status(400).json({
                msg: 'No file uploaded',
                errors: ['file_required']
            });
        }

        // Validate file type and size
        validateCVFileType(req.file);
        validateCVFileSize(req.file);

        // Get old CV storage key if replacing
        const { replace_storage_key } = req.body;

        // Delete old CV from R2 if replacing
        if (replace_storage_key) {
            try {
                await deleteFile(replace_storage_key);
                console.log('✅ Old CV deleted:', replace_storage_key);
            } catch (error) {
                console.warn('⚠️ Failed to delete old CV:', error);
                // Continue with upload even if deletion fails
            }
        }

        console.log('☁️ Uploading CV to R2...');
        const uploadResult = await uploadFile(
            req.file.buffer,
            req.file.originalname,
            req.file.mimetype,
            'cvs'
        );
        console.log('✅ Upload successful:', uploadResult.storageKey);

        res.status(201).json({
            msg: 'CV uploaded successfully',
            cv_file_name: req.file.originalname,
            cv_file_size: formatFileSize(req.file.size),
            cv_storage_key: uploadResult.storageKey,
            cv_storage_url: uploadResult.publicUrl,
            cv_uploaded_at: new Date().toISOString()
        });
    } catch (error) {
        console.error('❌ CV upload error:', {
            message: error.message,
            msg: error.msg,
            errors: error.errors,
            status: error.status,
            stack: error.stack
        });
        res.status(error.status || 500).json({
            msg: error.msg || 'Failed to upload CV',
            errors: error.errors || [],
            details: error.message
        });
    }
};

// Delete CV from R2
export const deleteCV = async (req, res) => {
    try {
        const { storage_key } = req.body;

        if (!storage_key) {
            return res.status(400).json({
                msg: 'Storage key is required',
                errors: ['storage_key_required']
            });
        }

        await deleteFile(storage_key);

        res.status(200).json({
            msg: 'CV deleted successfully',
            storage_key
        });
    } catch (error) {
        console.error('❌ CV deletion error:', error);
        res.status(error.status || 500).json({
            msg: error.msg || 'Failed to delete CV',
            errors: error.errors || [],
            details: error.message
        });
    }
};

// Generate download URL for CV
export const getCVDownloadUrl = async (req, res) => {
    try {
        const { storage_key, file_name, disposition } = req.query;

        if (!storage_key) {
            return res.status(400).json({
                msg: 'Storage key is required',
                errors: ['storage_key_required']
            });
        }

        // Generate presigned URL valid for 1 hour
        // disposition can be 'inline' (view) or 'attachment' (download)
        const downloadUrl = await generateDownloadUrl(storage_key, 3600, file_name, disposition || 'attachment');

        res.status(200).json({
            msg: 'Download URL generated successfully',
            download_url: downloadUrl,
            expires_in: 3600
        });
    } catch (error) {
        console.error('❌ CV download URL error:', error);
        res.status(error.status || 500).json({
            msg: error.msg || 'Failed to generate download URL',
            errors: error.errors || [],
            details: error.message
        });
    }
};
