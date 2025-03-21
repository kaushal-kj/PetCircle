const cloundinary = require("cloudinary").v2;

const uploadFileToCloudinary = async (file) => {
  cloundinary.config({
    cloud_name: "dzooigczp",
    api_key: "813375819857439",
    api_secret: "VsJ1t_E4iJB7y4TP88ZWXBwkhgk",
  });

  const cloundinaryResponse = await cloundinary.uploader.upload(file.path);
  return cloundinaryResponse;
};
module.exports = {
  uploadFileToCloudinary,
};

// const cloudinary = require("cloudinary").v2;
// const streamifier = require("streamifier"); // Required for buffer uploads

// // Configure Cloudinary (Move outside the function to configure globally)
// cloudinary.config({
//   cloud_name: "dzooigczp",
//   api_key: "813375819857439",
//   api_secret: "VsJ1t_E4iJB7y4TP88ZWXBwkhgk",
// });

// // Function to Upload File to Cloudinary (Supports Buffer)
// const uploadFileToCloudinary = async (fileBuffer) => {
//   return new Promise((resolve, reject) => {
//     const uploadStream = cloudinary.uploader.upload_stream(
//       { resource_type: "auto" },
//       (error, result) => {
//         if (error) reject(error);
//         else resolve(result);
//       }
//     );

//     streamifier.createReadStream(fileBuffer).pipe(uploadStream);
//   });
// };

// module.exports = {
//   uploadFileToCloudinary,
// };
