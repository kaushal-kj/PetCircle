const Community = require("../models/CommunityModel");
const cloudinaryUtil = require("../utils/CloudinaryUtil");

const multer = require("multer");

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads"); // Store uploaded files in "uploads"
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});

const upload = multer({ storage: storage }).single("image");

// Create a new community
const createCommunity = async (req, res) => {
  upload(req, res, async (err) => {
    if (err)
      return res.status(500).json({ message: "Multer Error: " + err.message });

    try {
      const { name, description, type, createdBy } = req.body;

      if (!name || !type || !createdBy) {
        return res
          .status(400)
          .json({ message: "Name, Type, and CreatedBy are required fields" });
      }

      let imageUrl = "";
      if (req.file) {
        const cloudinaryResponse = await cloudinaryUtil.uploadFileToCloudinary(
          req.file
        );
        imageUrl = cloudinaryResponse.secure_url;
      }

      const newCommunity = new Community({
        name,
        description,
        type, // Ensure this field is included
        createdBy,
        image: imageUrl,
        members: [createdBy],
      });

      await newCommunity.save();
      res.status(201).json({
        message: "Community created successfully",
        community: newCommunity,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error creating community", error: error.message });
    }
  });
};

// Get all communities
const getAllCommunities = async (req, res) => {
  try {
    const communities = await Community.find()
      .populate("createdBy", "name")
      .populate("members", "name");
    console.log("Fetched Communities:", communities); // Debug log
    res.status(200).json(communities);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching communities", error: error.message });
  }
};

// Get a specific community by ID
const getCommunityById = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id)
      .populate("createdBy", "name")
      .populate("members", "name");
    if (!community)
      return res.status(404).json({ message: "Community not found" });
    res.status(200).json(community);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching community", error: error.message });
  }
};

// Join a community
const joinCommunity = async (req, res) => {
  try {
    const { userId, communityId } = req.body;
    const community = await Community.findById(communityId);

    if (!community)
      return res.status(404).json({ message: "Community not found" });

    if (!community.members.includes(userId)) {
      community.members.push(userId);
      await community.save();
      res.status(200).json({ message: "Joined community successfully" });
    } else {
      res.status(400).json({ message: "User already a member" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error joining community", error: error.message });
  }
};

// Leave a community
const leaveCommunity = async (req, res) => {
  try {
    const { userId, communityId } = req.body;
    const community = await Community.findById(communityId);

    if (!community)
      return res.status(404).json({ message: "Community not found" });

    community.members = community.members.filter(
      (member) => member.toString() !== userId
    );
    await community.save();
    res.status(200).json({ message: "Left community successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error leaving community", error: error.message });
  }
};

// Delete a community (Only the creator can delete it)
const deleteCommunity = async (req, res) => {
  try {
    const { communityId, userId } = req.body;
    const community = await Community.findById(communityId);

    if (!community)
      return res.status(404).json({ message: "Community not found" });

    if (community.createdBy.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Only the creator can delete this community" });
    }

    await Community.findByIdAndDelete(communityId);
    res.status(200).json({ message: "Community deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting community", error: error.message });
  }
};

module.exports = {
  createCommunity,
  getAllCommunities,
  getCommunityById,
  joinCommunity,
  leaveCommunity,
  deleteCommunity,
};
