const mongoose = require("mongoose");

const expertSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  expertise: { type: String, required: true },
  bio: { type: String },
  expertiseCertificate: { type: String, default: "" }, // Cloudinary URL for certificate upload
  isVerified: { type: Boolean, default: false }, // Admin verification
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  consultations: [
    {
      petOwner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      petDetails: { type: String },
      issue: { type: String, required: true },
      status: {
        type: String,
        enum: ["Pending", "Accepted", "Declined"],
        default: "Pending",
      },
      appointmentDate: { type: Date }, // Optional: If expert accepts
    },
  ],
});

module.exports = mongoose.model("Expert", expertSchema);
