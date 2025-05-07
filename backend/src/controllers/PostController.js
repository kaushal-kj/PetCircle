const PostModel = require("../models/PostModel");
const Post = require("../models/PostModel");

const multer = require("multer");
const cloudinaryUtil = require("../utils/CloudinaryUtil");
const ExpertModel = require("../models/ExpertModel");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads"); // Store uploaded files in the "uploads" directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});

const upload = multer({ storage: storage }).single("image");

// Create Post
const createPost = async (req, res) => {
  upload(req, res, async (err) => {
    if (err)
      return res.status(500).json({ message: "Multer Error: " + err.message });

    try {
      const { caption, author } = req.body;
      if (!author)
        return res.status(400).json({ message: "Author is required" });

      const cloudinaryResponse = await cloudinaryUtil.uploadFileToCloudinary(
        req.file
      );
      const imageUrl = cloudinaryResponse.secure_url;

      const newPost = new PostModel({ caption, photos: [imageUrl], author });
      await newPost.save();

      res
        .status(201)
        .json({ message: "Post created successfully", data: newPost });
    } catch (error) {
      res.status(500).json({ message: "Error creating post", error });
    }
  });
};

//get all posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .populate("author", "username email profilePic role expertProfile")
      .populate("expert")
      .populate("pet", "name breed")
      .populate({
        path: "comments.author", // Populate comment authors
        select: "username profilePic",
      }); // Populate author and pet details
    res.status(200).json({
      message: "Posts fetched successfully",
      data: posts,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error });
  }
};

//get post by id
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

//get user posts
const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ author: userId }).populate(
      "author",
      "username profilePic"
    );
    res
      .status(200)
      .json({ message: "User posts fetched successfully", data: posts });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user posts", error });
  }
};

//get expert posts
const getPostsByExpert = async (req, res) => {
  try {
    const { expertId } = req.params;

    //  Fetch posts where author is the expertId
    const posts = await PostModel.find({ author: expertId }).sort({
      createdAt: -1,
    });

    res
      .status(200)
      .json({ message: "Posts fetched successfully", data: posts });
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error });
  }
};

//delete post
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPost = await PostModel.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting post", error });
  }
};

//  Like or Unlike a Post
const toggleLikePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body; // User who is liking the post

    const post = await PostModel.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const likeIndex = post.likes.indexOf(userId);
    if (likeIndex === -1) {
      post.likes.push(userId); // Like the post
    } else {
      post.likes.splice(likeIndex, 1); // Unlike the post
    }

    await post.save();
    res.status(200).json({ message: "Like updated", data: post });
  } catch (error) {
    res.status(500).json({ message: "Error updating like", error });
  }
};

//  Add a Comment
const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId, text } = req.body;

    if (!text)
      return res.status(400).json({ message: "Comment cannot be empty" });

    const post = await PostModel.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({ text, author: userId });
    await post.save();

    res.status(201).json({ message: "Comment added", data: post });
  } catch (error) {
    res.status(500).json({ message: "Error adding comment", error });
  }
};

//delete comment
const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const post = await PostModel.findById(postId);

    if (!post) return res.status(404).json({ message: "Post not found" });

    // Remove the comment
    post.comments = post.comments.filter(
      (comment) => comment._id.toString() !== commentId
    );
    await post.save();

    res
      .status(200)
      .json({ message: "Comment deleted successfully", data: post });
  } catch (error) {
    res.status(500).json({ message: "Error deleting comment", error });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  getUserPosts,
  getPostsByExpert,
  deletePost,
  toggleLikePost,
  addComment,
  deleteComment,
};
