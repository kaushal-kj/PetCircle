const cloundinary = require("cloudinary").v2;
const path = require("path");

cloundinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const uploadFileToCloudinary = async (file) => {
  const isPDF =
    file.mimetype === "application/pdf" ||
    path.extname(file.originalname).toLowerCase() === ".pdf";

  const resourceType = isPDF ? "raw" : "image";

  const cloundinaryResponse = await cloundinary.uploader.upload(file.path, {
    resource_type: resourceType, // 'image' for images, 'raw' for PDFs, etc
  });
  return cloundinaryResponse;
};
module.exports = {
  uploadFileToCloudinary,
};
