const express = require("express");
const router = express.Router();
const {
  createPost,
  getAllPosts,
  getPostById,
  getUserPosts,
  getPostsByExpert,
  deletePost,
  toggleLikePost,
  addComment,
  deleteComment,
} = require("../controllers/PostController");

router.post("/post", createPost);
router.get("/posts", getAllPosts);
router.get("/post/:id", getPostById);
router.get("/posts/:userId", getUserPosts);
router.get("/posts/expert/:expertId", getPostsByExpert);
router.delete("/post/:id", deletePost); // Delete Post
router.put("/post/:postId/like", toggleLikePost);
router.post("/post/:postId/comment", addComment);
router.delete("/post/:postId/comment/:commentId", deleteComment);

module.exports = router;
