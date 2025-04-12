const ExpertModel = require("../models/ExpertModel");
const UserModel = require("../models/UserModel");

// Get All Experts
const getAllExperts = async (req, res) => {
  try {
    // const experts = await ExpertModel.find().populate(
    //   "user",
    //   "fullName username email profilePic"
    // );
    const experts = await ExpertModel.find().populate({
      path: "user",
      select: "fullName username email profilePic bio",
      strictPopulate: false, // Ensures population even if some users are missing
    });

    res
      .status(200)
      .json({ message: "Experts fetched successfully", data: experts });
  } catch (error) {
    res.status(500).json({ message: "Error fetching experts", error });
  }
};

// Get Expert by ID
const getExpertById = async (req, res) => {
  try {
    const expert = await ExpertModel.findById(req.params.id)
      .populate(
        "user",
        "fullName username email profilePic bio followers following"
      )
      .populate({
        path: "posts", //  Populating posts related to the expert
        options: { sort: { createdAt: -1 } }, // Sort posts by newest first
      }); // Populate user details
    if (!expert) {
      return res.status(404).json({ message: "Expert not found" });
    }

    res
      .status(200)
      .json({ message: "Expert fetched successfully", data: expert });
  } catch (error) {
    res.status(500).json({ message: "Error fetching expert", error });
  }
};

module.exports = {
  getAllExperts,
  getExpertById,
};
