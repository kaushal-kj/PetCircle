const express = require("express");
const router = express.Router();
const postController = require("../controllers/CommunityPostController");

router.post(
  "/community-posts/create",
  postController.upload,
  postController.createCommunityPost
);

router.get("/community-posts/:communityId", postController.getCommunityPosts);

router.delete(
  "/community-posts/:postId/:userId",
  postController.deleteCommunityPost
);

router.put("/community-posts/:postId/like", postController.toggleLike);
router.post("/community-posts/:postId/comment", postController.addComment);
router.delete(
  "/community-posts/:postId/comment/:commentId",
  postController.deleteComment
);

module.exports = router;
