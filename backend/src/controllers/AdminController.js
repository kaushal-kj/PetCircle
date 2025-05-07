// controllers/AdminController.js
const UserModel = require("../models/UserModel");
const ExpertModel = require("../models/ExpertModel");
const PostModel = require("../models/PostModel");
const AdoptionModel = require("../models/AdoptionModel");
const CommunityModel = require("../models/CommunityModel");

const User = require("../models/UserModel");
const Expert = require("../models/ExpertModel");
const Post = require("../models/PostModel");
const Pet = require("../models/PetModel");
const Adoption = require("../models/AdoptionModel");
const Community = require("../models/CommunityModel");
const PetModel = require("../models/PetModel");

// ========== USERS ==========
const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find({ role: { $ne: "admin" } }).select(
      "-password"
    );
    res.status(200).json({ message: "Users fetched", data: users });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch users", error: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // 1. Delete all pets owned by the user
    await PetModel.deleteMany({ owner: userId });

    // 2. Delete all posts created by the user
    await PostModel.deleteMany({ author: userId });

    // 3. Delete all adoption posts by the user
    await AdoptionModel.deleteMany({ postedBy: userId });

    // 4. Remove the user from followers/following of other users
    await UserModel.updateMany(
      { followers: userId },
      { $pull: { followers: userId } }
    );
    await UserModel.updateMany(
      { following: userId },
      { $pull: { following: userId } }
    );

    // 5. Remove user from communities (if joined)
    await CommunityModel.updateMany({}, { $pull: { members: userId } });

    // 6. Delete communities created by user
    await CommunityModel.deleteMany({ creator: userId });

    // 7. If user is expert, delete expert profile
    const user = await UserModel.findById(userId);
    if (user?.role === "expert") {
      await ExpertModel.deleteOne({ user: userId });
    }

    // 8. Finally delete the user
    await UserModel.findByIdAndDelete(userId);

    res
      .status(200)
      .json({ message: "User and related data deleted successfully" });
  } catch (err) {
    console.error("Delete User Error:", err);
    res
      .status(500)
      .json({ message: "Failed to delete user", error: err.message });
  }
};

// ========== EXPERTS ========
const getAllExperts = async (req, res) => {
  try {
    const experts = await Expert.find().populate("user", "username email");
    res.status(200).json(experts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching experts" });
  }
};

const approveExpert = async (req, res) => {
  const { id } = req.params;

  try {
    const expert = await Expert.findById(id);
    if (!expert) {
      return res.status(404).json({ message: "Expert not found" });
    }

    expert.isVerified = true;
    await expert.save();

    // Optionally update user role to "expert" (if needed)
    const user = await User.findById(expert.user);
    user.role = "expert";
    await user.save();

    res.status(200).json({ message: "Expert approved successfully", expert });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error approving expert" });
  }
};

const rejectExpert = async (req, res) => {
  const { id } = req.params;

  try {
    const expert = await Expert.findById(id);
    if (!expert) {
      return res.status(404).json({ message: "Expert not found" });
    }

    expert.isVerified = false;
    await expert.save();

    res.status(200).json({ message: "Expert rejected successfully", expert });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error rejecting expert" });
  }
};

const deleteExpert = async (req, res) => {
  const { id } = req.params;

  try {
    const expert = await Expert.findById(id);
    if (!expert) {
      return res.status(404).json({ message: "Expert not found" });
    }

    // Optionally, delete the expert's posts as well
    await Expert.deleteOne({ _id: id });

    res.status(200).json({ message: "Expert deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting expert" });
  }
};

// ========== POSTS ==========
const getAllPosts = async (req, res) => {
  try {
    const posts = await PostModel.find().populate(
      "author",
      "username role profilePic email"
    );
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
    const communities = await CommunityModel.find()
      .populate("creator", "username")
      .populate("members", "username profilePic role expertProfile");
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

const getAdminOverview = async (req, res) => {
  try {
    const [
      totalUsers,
      totalExperts,
      totalPosts,
      totalPets,
      totalAdoptions,
      totalCommunities,
    ] = await Promise.all([
      User.countDocuments({ role: "petOwner" }),
      User.countDocuments({ role: "expert" }),
      Post.countDocuments(),
      Pet.countDocuments(),
      Adoption.countDocuments(),
      Community.countDocuments(),
    ]);

    res.status(200).json({
      totalUsers,
      totalExperts,
      totalPosts,
      totalPets,
      totalAdoptions,
      totalCommunities,
    });
  } catch (err) {
    console.error("Error fetching admin overview:", err);
    res.status(500).json({ message: "Failed to fetch admin overview" });
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
  getAllPosts,
  deletePost,
  getAllAdoptions,
  deleteAdoption,
  getAllCommunities,
  deleteCommunity,
  getAdminOverview,
  getAllExperts,
  approveExpert,
  rejectExpert,
  deleteExpert,
};
