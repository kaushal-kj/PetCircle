// controllers/AdminController.js
const UserModel = require("../models/UserModel");
const ExpertModel = require("../models/ExpertModel");
const PostModel = require("../models/PostModel");
const AdoptionModel = require("../models/AdoptionModel");
const CommunityModel = require("../models/CommunityModel");

// ========== USERS ==========
const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find().select("-password");
    res.status(200).json({ message: "Users fetched", data: users });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch users", error: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    await UserModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete user", error: err.message });
  }
};

// ========== EXPERTS ==========
const getAllExperts = async (req, res) => {
  try {
    const experts = await ExpertModel.find().populate(
      "user",
      "fullName username email role"
    );
    res.status(200).json({ message: "Experts fetched", data: experts });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch experts", error: err.message });
  }
};

const deleteExpert = async (req, res) => {
  try {
    await ExpertModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Expert deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete expert", error: err.message });
  }
};

// ========== POSTS ==========
const getAllPosts = async (req, res) => {
  try {
    const posts = await PostModel.find().populate("author", "username role");
    res.status(200).json({ message: "Posts fetched", data: posts });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch posts", error: err.message });
  }
};

const deletePost = async (req, res) => {
  try {
    await PostModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete post", error: err.message });
  }
};

// ========== ADOPTIONS ==========
const getAllAdoptions = async (req, res) => {
  try {
    const adoptions = await AdoptionModel.find().populate("pet postedBy");
    res.status(200).json({ message: "Adoptions fetched", data: adoptions });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch adoptions", error: err.message });
  }
};

const deleteAdoption = async (req, res) => {
  try {
    await AdoptionModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Adoption deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete adoption", error: err.message });
  }
};

// ========== COMMUNITIES ==========
const getAllCommunities = async (req, res) => {
  try {
    const communities = await CommunityModel.find().populate(
      "createdBy members",
      "username"
    );
    res.status(200).json({ message: "Communities fetched", data: communities });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch communities", error: err.message });
  }
};

const deleteCommunity = async (req, res) => {
  try {
    await CommunityModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Community deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete community", error: err.message });
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
  getAllExperts,
  deleteExpert,
  getAllPosts,
  deletePost,
  getAllAdoptions,
  deleteAdoption,
  getAllCommunities,
  deleteCommunity,
};
