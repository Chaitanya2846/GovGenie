import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to generate a unique filename
const generateUniqueFilename = (originalname) => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 10);
  const extension = originalname.split(".").pop();
  return `govgenie_${timestamp}_${randomString}.${extension}`;
};

// Configure Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => ({
    folder: "govgenie_files",
    resource_type: "auto",
    public_id: generateUniqueFilename(file.originalname), // Unique filename
  }),
});

// Initialize Multer with Cloudinary storage
const uploads = multer({ storage });

export default uploads;
export { cloudinary };
