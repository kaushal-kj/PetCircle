const CommunityPost = require("../models/CommunityPostModel");
const Community = require("../models/CommunityModel");
const cloudinaryUtil = require("../utils/CloudinaryUtil");
const fs = require("fs");
const multer = require("multer");
const path = require("path");

// ---- Multer Setup ----
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
exports.upload = multer({ storage }).fields([{ name: "image", maxCount: 1 }]);

// ---- Create Community Post ----
const createCommunityPost = async (req, res) => {
  const { content, author, communityId } = req.body;

  try {
    const community = await Community.findById(communityId);
    if (!community)
      return res.status(404).json({ message: "Community not found" });

    const isMember = community.members.includes(author);
    if (!isMember)
      return res.status(403).json({ message: "Only members can post" });

    let imageUrl = "";
    if (req.files?.image) {
      const result = await cloudinaryUtil.uploadFileToCloudinary(
        req.files.image[0]
      );
      imageUrl = result.secure_url;
      fs.unlinkSync(req.files.image[0].path);
    }

    const newPost = new CommunityPost({
      content,
      image: imageUrl,
      author,
      community: communityId,
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ message: "Failed to create post", error: err });
  }
};

// ---- Get All Posts in a Community ----
const getCommunityPosts = async (req, res) => {
  const { communityId } = req.params;

  try {
    const posts = await CommunityPost.find({ community: communityId })
      .populate("author", "username profilePic role expertProfile")
      .populate("comments.author", "username profilePic") // populate comment authors
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching posts", error: err });
  }
};

// ---- Delete Community Post ----
const deleteCommunityPost = async (req, res) => {
  const { postId, userId } = req.params;

  try {
    const post = await CommunityPost.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== userId)
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this post" });

    await post.deleteOne();
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting post", error: err });
  }
};

// ----- toggle like -----
const toggleLike = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;

  try {
    const post = await CommunityPost.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const likeIndex = post.likes.indexOf(userId);
    let liked;

    if (likeIndex === -1) {
      post.likes.push(userId); // Like
      liked = true;
    } else {
      post.likes.splice(likeIndex, 1); // Unlike
      liked = false;
    }

    await post.save();
    res.status(200).json({ message: liked ? "Liked" : "Unliked", liked, post });
  } catch (err) {
    res.status(500).json({ message: "Error toggling like", error: err });
  }
};

// ----- add comment -----
const addComment = async (req, res) => {
  const { postId } = req.params;
  const { text, userId } = req.body;

  try {
    const post = await CommunityPost.findById(postId);
    post.comments.push({ text, author: userId });
    await post.save();

    const updatedPost = await CommunityPost.findById(postId)
      .populate("author", "username")
      .populate("comments.author", "username profilePic");

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ----- delete comment -----
const deleteComment = async (req, res) => {
  const { postId, commentId } = req.params;

  try {
    const post = await CommunityPost.findById(postId);

    if (!post) return res.status(404).json({ error: "Post not found" });

    post.comments = post.comments.filter(
      (comment) => comment._id.toString() !== commentId
    );

    await post.save();

    //  Fetch updated post with populated authors
    const updatedPost = await CommunityPost.findById(postId)
      .populate("author", "username")
      .populate("comments.author", "username profilePic");

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  upload: exports.upload,
  createCommunityPost,
  getCommunityPosts,
  deleteCommunityPost,
  toggleLike,
  addComment,
  deleteComment,
};
