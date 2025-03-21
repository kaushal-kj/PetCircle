const PostModel = require("../models/PostModel");
const Post = require("../models/PostModel");

// Create Post
const createPost = async (req, res) => {
  try {
    const post = new Post(req.body);
    await post.save();
    res.status(201).json({ message: "Post created successfully", data: post });
  } catch (error) {
    res.status(500).json({ message: "Error creating post", error });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .populate("author", "username email")
      .populate("pet", "name breed"); // Populate author and pet details
    res.status(200).json({
      message: "Posts fetched successfully",
      data: posts,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error });
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id)
      .populate("author", "username email")
      .populate("pet", "name breed"); // Populate author and pet details
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({
      message: "Post fetched successfully",
      data: post,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching post", error });
  }
};

module.exports = { createPost, getAllPosts, getPostById };
