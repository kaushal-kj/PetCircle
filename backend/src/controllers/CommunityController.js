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

const joinCommunity = async (req, res) => {
  try {
    const { userId } = req.body;
    const community = await CommunityModel.findById(req.params.id);

    if (!community)
      return res.status(404).json({ message: "Community not found" });

    // Check if the user is already a member
    if (community.members.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You are already a member of this community" });
    }

    community.members.push(userId);
    await community.save();

    res
      .status(200)
      .json({ message: "Joined community successfully", data: community });
  } catch (error) {
    res.status(500).json({ message: "Error joining community", error });
  }
};

const leaveCommunity = async (req, res) => {
  try {
    const { userId } = req.body;
    const community = await CommunityModel.findById(req.params.id);

    if (!community)
      return res.status(404).json({ message: "Community not found" });

    // Check if the user is actually a member
    if (!community.members.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You are not a member of this community" });
    }

    // Remove user from members list
    community.members = community.members.filter(
      (member) => member.toString() !== userId
    );
    await community.save();

    res
      .status(200)
      .json({ message: "Left community successfully", data: community });
  } catch (error) {
    res.status(500).json({ message: "Error leaving community", error });
  }
};

module.exports = {
  createCommunity,
  getAllCommunities,
  getCommunityById,
  joinCommunity,
  leaveCommunity,
};
