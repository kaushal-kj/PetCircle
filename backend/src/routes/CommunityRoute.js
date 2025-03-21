const express = require("express");
const router = express.Router();
const {
  createCommunity,
  getAllCommunities,
  getCommunityById,
} = require("../controllers/CommunityController");

router.post("/community", createCommunity);
router.get("/communities", getAllCommunities);
router.get("/community/:id", getCommunityById);

module.exports = router;
