const ExpertModel = require("../models/ExpertModel");
const Expert = require("../models/ExpertModel");

// Create Expert Profile
const createExpert = async (req, res) => {
  try {
    const expert = new Expert(req.body);
    await expert.save();
    res
      .status(201)
      .json({ message: "Expert created successfully", data: expert });
  } catch (error) {
    res.status(500).json({ message: "Error creating expert", error });
  }
};

const getAllExperts = async (req, res) => {
  try {
    const experts = await ExpertModel.find().populate("user", "username email"); // Populate user details
    res.status(200).json({
      message: "Experts fetched successfully",
      data: experts,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching experts", error });
  }
};

const getExpertById = async (req, res) => {
  try {
    const expert = await ExpertModel.findById(req.params.id).populate(
      "user",
      "username email"
    ); // Populate user details
    if (!expert) {
      return res.status(404).json({ message: "Expert not found" });
    }
    res.status(200).json({
      message: "Expert fetched successfully",
      data: expert,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching expert", error });
  }
};

module.exports = { createExpert, getAllExperts, getExpertById };
