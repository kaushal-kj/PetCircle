const mongoose = require("mongoose");

const contestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pet" }],
  winners: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pet" }],
});

module.exports = mongoose.model("Contest", contestSchema);
