const mongoose = require("mongoose");

const expertSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  expertise: { type: String, required: true },
  bio: { type: String },
  expertiseCertificate: { type: String, default: "" }, // Cloudinary URL for certificate upload
  isVerified: { type: Boolean, default: false }, // Admin verification
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
});

module.exports = mongoose.model("Expert", expertSchema);
