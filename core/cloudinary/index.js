import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUploadFolder } from '../configs.js';


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: cloudinaryUploadFolder,
        allowedFormats: ["jpeg", "png", "jpg"]
    },
    transformation: [
        {
            width: 800,
            height: 600,
            crop: "limit",
            quality: "auto:low",
            fetch_format: "auto",
            dpr: "auto"
        }
    ]

});

export {
    cloudinary,
    storage,
}
