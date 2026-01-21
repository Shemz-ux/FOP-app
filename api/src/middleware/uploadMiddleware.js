import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        'image/jpeg',
        'image/jpg', 
        'image/png',
        'image/webp',
        'image/gif',
        'video/mp4',
        'video/mpeg',
        'video/quicktime',
        'video/webm'
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`Invalid file type: ${file.mimetype}. Only images and videos are allowed.`), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024
    }
});

export const uploadSingle = upload.single('media');

export const uploadMultiple = upload.array('media', 10);

export const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                msg: 'File size too large. Maximum size is 100MB'
            });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                msg: 'Too many files. Maximum is 10 files'
            });
        }
        return res.status(400).json({
            msg: `Upload error: ${err.message}`
        });
    }
    
    if (err) {
        return res.status(400).json({
            msg: err.message || 'File upload failed'
        });
    }
    
    next();
};
