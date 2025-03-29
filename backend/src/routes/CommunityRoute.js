const express = require("express");
const router = express.Router();
const {
  createCommunity,
  getAllCommunities,
  getCommunityById,
  joinCommunity,
  leaveCommunity,
} = require("../controllers/CommunityController");

router.post("/community", createCommunity);
router.get("/communities", getAllCommunities);
router.get("/community/:id", getCommunityById);
router.put("/community/:id/join", joinCommunity);
router.put("/community/:id/leave", leaveCommunity);

module.exports = router;
