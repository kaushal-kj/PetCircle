const mongoose = require("mongoose");

const expertSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  bio: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  certificate: { type: String }, // Cloudinary URL for certificate upload
  isVerified: { type: Boolean, default: false }, // Admin verification
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
