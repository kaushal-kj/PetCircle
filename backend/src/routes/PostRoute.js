const express = require("express");
const router = express.Router();
const {
  createPost,
  getAllPosts,
  getPostById,
} = require("../controllers/PostController");

router.post("/post", createPost);
router.get("/posts", getAllPosts);
router.get("/post/:id", getPostById);

module.exports = router;
