const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    caption: { type: String, required: true },
    photos: [{ type: String }],
    expert: { type: mongoose.Schema.Types.ObjectId, ref: "Expert" },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    pet: { type: mongoose.Schema.Types.ObjectId, ref: "Pet" },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [
      {
        text: { type: String, required: true },
        author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
