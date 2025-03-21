const AdoptionModel = require("../models/AdoptionModel");
const Adoption = require("../models/AdoptionModel");

// Create Adoption Request
const createAdoptionRequest = async (req, res) => {
  try {
    const adoption = new Adoption(req.body);
    await adoption.save();
    res.status(201).json({
      message: "Adoption request created successfully",
      data: adoption,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating adoption request", error });
  }
};

const getAllAdoptions = async (req, res) => {
  try {
    const adoptions = await AdoptionModel.find()
      .populate("pet", "name breed")
      .populate("requester", "username email"); // Populate pet and requester details
    res.status(200).json({
      message: "Adoption requests fetched successfully",
      data: adoptions,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching adoption requests", error });
  }
};

const getAdoptionById = async (req, res) => {
  try {
    const adoption = await AdoptionModel.findById(req.params.id)
      .populate("pet", "name breed")
      .populate("requester", "username email"); // Populate pet and requester details
    if (!adoption) {
      return res.status(404).json({ message: "Adoption request not found" });
    }
    res.status(200).json({
      message: "Adoption request fetched successfully",
      data: adoption,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching adoption request", error });
  }
};
module.exports = { createAdoptionRequest, getAllAdoptions, getAdoptionById };
