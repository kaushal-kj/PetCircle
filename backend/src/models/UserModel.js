const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "petOwner", "expert"],
      default: "petOwner",
    },
    pets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pet" }],
    profilePic: { type: String, default: "https://via.placeholder.com/150" },
    bio: { type: String, default: "" },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // 🔹 Fields for "Expert" Role
    expertise: { type: String },
    expertiseCertificate: { type: String, default: "" }, // Cloudinary file URL
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
