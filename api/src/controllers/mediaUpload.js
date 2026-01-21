import {
    uploadToCloudinary,
    deleteFromCloudinary,
    extractPublicIdFromUrl
} from '../services/mediaUploadService.js';

export const uploadMedia = async (req, res) => {
    try {
        console.log('📤 Upload request received');
        console.log('File:', req.file ? `${req.file.originalname} (${req.file.size} bytes)` : 'No file');
        console.log('Purpose:', req.body.purpose);
        
        if (!req.file) {
            return res.status(400).json({
                msg: 'No file provided'
            });
        }

        const { purpose, replace_url } = req.body;

        if (!purpose) {
            return res.status(400).json({
                msg: 'Media purpose is required (event_image, company_logo, organiser_logo)'
            });
        }

        const validPurposes = ['event_image', 'company_logo', 'organiser_logo', 'other'];
        if (!validPurposes.includes(purpose)) {
            return res.status(400).json({
                msg: `Invalid purpose. Must be one of: ${validPurposes.join(', ')}`
            });
        }

        if (replace_url) {
            const oldPublicId = extractPublicIdFromUrl(replace_url);
            if (oldPublicId) {
                try {
                    await deleteFromCloudinary(oldPublicId);
                    console.log('✅ Old image deleted:', oldPublicId);
                } catch (error) {
                    console.warn('⚠️ Failed to delete old image:', error);
                }
            }
        }

        console.log('☁️ Uploading to Cloudinary...');
        const cloudinaryResult = await uploadToCloudinary(req.file, purpose);
        console.log('✅ Upload successful:', cloudinaryResult.secure_url);

        res.status(201).json({
            msg: 'Media uploaded successfully',
            url: cloudinaryResult.secure_url,
            public_id: cloudinaryResult.public_id,
            width: cloudinaryResult.width,
            height: cloudinaryResult.height,
            format: cloudinaryResult.format,
            resource_type: cloudinaryResult.resource_type
        });
    } catch (error) {
        console.error('❌ Upload error details:', {
            message: error.message,
            status: error.status,
            msg: error.msg,
            errors: error.errors,
            stack: error.stack
        });
        res.status(error.status || 500).json({
            msg: error.msg || 'Failed to upload media',
            errors: error.errors || [],
            details: error.message
        });
    }
};

export const deleteMedia = async (req, res) => {
    try {
        if (req.user_type !== 'admin') {
            return res.status(403).json({
                msg: 'Only admins can delete media'
            });
        }

        const { public_id, url } = req.body;

        let publicIdToDelete = public_id;

        if (!publicIdToDelete && url) {
            publicIdToDelete = extractPublicIdFromUrl(url);
        }

        if (!publicIdToDelete) {
            return res.status(400).json({
                msg: 'Either public_id or url is required'
            });
        }

        await deleteFromCloudinary(publicIdToDelete);

        res.status(200).json({
            msg: 'Media deleted successfully',
            deleted_public_id: publicIdToDelete
        });
    } catch (error) {
        res.status(error.status || 500).json({
            msg: error.msg || 'Failed to delete media'
        });
    }
};
