const ContestModel = require("../models/ContestModel");
const Contest = require("../models/ContestModel");

// Create Contest
const createContest = async (req, res) => {
  try {
    const contest = new Contest(req.body);
    await contest.save();
    res
      .status(201)
      .json({ message: "Contest created successfully", data: contest });
  } catch (error) {
    res.status(500).json({ message: "Error creating contest", error });
  }
};

const getAllContests = async (req, res) => {
  try {
    const contests = await ContestModel.find()
      .populate("participants", "name breed")
      .populate("winners", "name breed"); // Populate participants and winners
    res.status(200).json({
      message: "Contests fetched successfully",
      data: contests,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching contests", error });
  }
};

const getContestById = async (req, res) => {
  try {
    const contest = await ContestModel.findById(req.params.id)
      .populate("participants", "name breed")
      .populate("winners", "name breed"); // Populate participants and winners
    if (!contest) {
      return res.status(404).json({ message: "Contest not found" });
    }
    res.status(200).json({
      message: "Contest fetched successfully",
      data: contest,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching contest", error });
  }
};

module.exports = { createContest, getAllContests, getContestById };
