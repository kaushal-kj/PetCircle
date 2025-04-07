const express = require("express");
const router = express.Router();
const communityController = require("../controllers/CommunityController");

router.post(
  "/communities/create",
  communityController.upload,
  communityController.createCommunity
);

router.get("/communities", communityController.getAllCommunities);

router.get("/communities/user/:userId", communityController.getUserCommunities);

router.post(
  "/communities/join/:communityId/:userId",
  communityController.joinCommunity
);

router.post(
  "/communities/leave/:communityId/:userId",
  communityController.leaveCommunity
);

router.delete(
  "/communities/:communityId/:userId",
  communityController.deleteCommunity
);

module.exports = router;
