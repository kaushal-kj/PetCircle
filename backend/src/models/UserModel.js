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
    profilePic: {
      type: String,
      default:
        "https://res.cloudinary.com/dzooigczp/image/upload/v1745231161/images_1_njlhns.jpg",
    },
    bio: { type: String, default: "" },
    phoneNumber: { type: String },
    dateOfBirth: { type: Date },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    expertProfile: { type: mongoose.Schema.Types.ObjectId, ref: "Expert" },

    joinedCommunities: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Community" },
    ],

    lastSeen: { type: Date },
    isOnline: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
