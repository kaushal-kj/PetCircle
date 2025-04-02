const express = require("express");
const {
  createCommunity,
  getAllCommunities,
  getCommunityById,
  joinCommunity,
  leaveCommunity,
  deleteCommunity,
} = require("../controllers/CommunityController");

const router = express.Router();

// Create a new community
router.post("/community/create", createCommunity);

// Get all communities
router.get("/community/getall", getAllCommunities);

// Get a specific community by ID
router.get("/community/:id", getCommunityById);

// Join a community
router.post("/community/join", joinCommunity);

// Leave a community
router.post("/community/leave", leaveCommunity);

// Delete a community (Only the creator can delete it)
router.delete("/community/delete", deleteCommunity);

module.exports = router;
