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
