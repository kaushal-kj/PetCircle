const mongoose = require("mongoose");

const petSchema = new mongoose.Schema({
  name: { type: String, required: true },
  breed: { type: String, required: true },
  age: { type: Number, required: true },
  weight: { type: Number },
  medicalHistory: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  photos: [{ type: String }],
  milestones: [{ type: String }],
});

module.exports = mongoose.model("Pet", petSchema);
