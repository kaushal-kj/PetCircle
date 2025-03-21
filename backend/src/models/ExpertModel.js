const mongoose = require("mongoose");

const expertSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  bio: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Expert", expertSchema);
