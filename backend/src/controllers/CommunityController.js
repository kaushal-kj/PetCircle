const CommunityModel = require("../models/CommunityModel");
const Community = require("../models/CommunityModel");

// Create Community
const createCommunity = async (req, res) => {
  try {
    const community = new Community(req.body);
    await community.save();
    res
      .status(201)
      .json({ message: "Community created successfully", data: community });
  } catch (error) {
    res.status(500).json({ message: "Error creating community", error });
  }
};

const getAllCommunities = async (req, res) => {
  try {
    const communities = await CommunityModel.find().populate(
      "members",
      "username email"
    ); // Populate members
    res.status(200).json({
      message: "Communities fetched successfully",
      data: communities,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching communities", error });
  }
};

const getCommunityById = async (req, res) => {
  try {
    const community = await CommunityModel.findById(req.params.id).populate(
      "members",
      "username email"
    ); // Populate members
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }
    res.status(200).json({
      message: "Community fetched successfully",
      data: community,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching community", error });
  }
};
module.exports = { createCommunity, getAllCommunities, getCommunityById };
