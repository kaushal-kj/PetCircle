const mongoose = require("mongoose");

const adoptionSchema = new mongoose.Schema(
  {
    pet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pet",
      required: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    contactInfo: { type: String, required: true },
    message: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Adoption", adoptionSchema);
