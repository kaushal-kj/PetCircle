const Community = require("../models/CommunityModel");
const cloudinaryUtil = require("../utils/CloudinaryUtil");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ---------- Multer Config ----------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

exports.upload = multer({ storage }).fields([{ name: "image", maxCount: 1 }]);

// ---------- Create Community ----------
const createCommunity = async (req, res) => {
  try {
    const { name, description, creator } = req.body;
    let imageUrl = "";

    if (req.files?.image) {
      const result = await cloudinaryUtil.uploadFileToCloudinary(
        req.files.image[0]
      );
      imageUrl = result.secure_url;
      fs.unlinkSync(req.files.image[0].path); // optional file cleanup
    }

    const newCommunity = new Community({
      name,
      description,
      image: imageUrl,
      creator,
      members: [creator],
    });

    await newCommunity.save();
    res.status(201).json(newCommunity);
  } catch (err) {
    console.error("Create Community Error:", err);
    res.status(500).json({ message: "Error creating community", error: err });
  }
};

// ---------- Get All Communities ----------
const getAllCommunities = async (req, res) => {
  try {
    const communities = await Community.find()
      .populate("creator", "username")
      .populate("members", "username profilePic role expertProfile");
    res.status(200).json(communities);
  } catch (err) {
    res.status(500).json({ message: "Error fetching communities", error: err });
  }
};

// ---------- Get Communities Joined by a User ----------
const getUserCommunities = async (req, res) => {
  const { userId } = req.params;
  try {
    const communities = await Community.find({ members: userId })
      .populate("creator", "username")
      .populate("members", "username profilePic");
    res.status(200).json(communities);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching user communities", error: err });
  }
};

// ---------- Join a Community ----------
const joinCommunity = async (req, res) => {
  const { communityId, userId } = req.params;

  try {
    const community = await Community.findById(communityId);
    if (!community)
      return res.status(404).json({ message: "Community not found" });

    if (!community.members.includes(userId)) {
      community.members.push(userId);
      await community.save();
    }

    res.status(200).json({ message: "Joined community", community });
  } catch (err) {
    res.status(500).json({ message: "Error joining community", error: err });
  }
};

// ---------- Leave a Community ----------

const leaveCommunity = async (req, res) => {
  const { communityId, userId } = req.params;

  try {
    const community = await Community.findById(communityId);
    if (!community)
      return res.status(404).json({ message: "Community not found" });

    if (community.creator.toString() === userId)
      return res
        .status(403)
        .json({ message: "Creator cannot leave their own community" });

    community.members = community.members.filter(
      (memberId) => memberId.toString() !== userId
    );

    await community.save();
    res.status(200).json({ message: "Left community", community });
  } catch (err) {
    res.status(500).json({ message: "Error leaving community", error: err });
  }
};

// ---------- Delete Community ----------
const deleteCommunity = async (req, res) => {
  const { communityId, userId } = req.params;

  try {
    const community = await Community.findById(communityId);
    if (!community)
      return res.status(404).json({ message: "Community not found" });

    if (community.creator.toString() !== userId)
      return res
        .status(403)
        .json({ message: "Only the creator can delete this community" });

    await community.deleteOne();
    res.status(200).json({ message: "Community deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting community", error: err });
  }
};

module.exports = {
  upload: exports.upload,
  createCommunity,
  getAllCommunities,
  getUserCommunities,
  joinCommunity,
  leaveCommunity,
  deleteCommunity,
};
