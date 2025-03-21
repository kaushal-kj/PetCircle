const mongoose = require("mongoose");

const communitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ["dog", "cat", "bird", "exotic"],
    required: true,
  },
  location: { type: String },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

module.exports = mongoose.model("Community", communitySchema);
