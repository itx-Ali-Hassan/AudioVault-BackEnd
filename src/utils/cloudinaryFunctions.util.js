const cloudinary = require('../db/cloudinary')

const uploadToCloudinary = (buffer, resource_type = 'image') => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: 'AudioVault', resource_type },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            });
        stream.end(buffer);
    });
}

const destroyFromCloudinary = async (publicId, resource_type = 'image') => {
    await cloudinary.uploader.destroy(publicId, { resource_type })
}

module.exports = { uploadToCloudinary, destroyFromCloudinary }