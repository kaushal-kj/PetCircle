const mongoose = require("mongoose");

const communitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ["dog", "cat", "bird", "exotic"],
    required: true,
  },
  description: { type: String },
  image: { type: String }, //  Community image URL
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // Creator of the community
  location: { type: String },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

module.exports = mongoose.model("Community", communitySchema);
