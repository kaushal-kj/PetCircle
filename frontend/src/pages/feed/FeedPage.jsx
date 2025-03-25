import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaHeart, FaRegHeart, FaRegCommentDots, FaShare } from "react-icons/fa";
import { GiShare } from "react-icons/gi";

const FeedPage = () => {
  const [posts, setPosts] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [openCommentPost, setOpenCommentPost] = useState(null); // Track which post's comment section is open
  const userId = localStorage.getItem("id");

  useEffect(() => {
    axios
      .get("/posts")
      .then((response) => {
        const sortedPosts = response.data.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        ); // Sort by latest
        setPosts(sortedPosts);
      })
      .catch((error) => console.error("Error fetching posts:", error));
  }, []);

  // ✅ Toggle Like (Fixing Bug)
  const toggleLike = async (postId) => {
    try {
      const response = await axios.put(`/post/${postId}/like`, { userId });
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, likes: response.data.data.likes }
            : post
        )
      );
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  // ✅ Open Comment Section
  const openComments = (postId) => {
    setOpenCommentPost(openCommentPost === postId ? null : postId); // Toggle comment section
  };

  // ✅ Add Comment (Backend)
  const handleComment = async (postId) => {
    if (!commentText) return;
    const userId = localStorage.getItem("id"); // Get logged-in user ID
    const username = localStorage.getItem("username"); // Store username in localStorage at login
    const profilePic = localStorage.getItem("profilePic"); // Optional

    try {
      const response = await axios.post(`/post/${postId}/comment`, {
        userId,
        text: commentText,
      });
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                comments: [
                  ...post.comments,
                  {
                    _id: response.data.data.comments.slice(-1)[0]._id, // Get new comment ID
                    text: commentText,
                    author: { _id: userId, username, profilePic }, // Manually set author details
                  },
                ],
              }
            : post
        )
      );
      setCommentText(""); // Clear input
      setOpenCommentPost(null); // Close comment box after submitting
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  // ✅ Share Post
  const handleShare = (postId) => {
    navigator.clipboard.writeText(`${window.location.origin}/post/${postId}`);
    alert("Post link copied to clipboard!");
  };

  //handle delete comment
  const handleDeleteComment = async (postId, commentId) => {
    try {
      await axios.delete(`/post/${postId}/comment/${commentId}`);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                comments: post.comments.filter(
                  (comment) => comment._id !== commentId
                ),
              }
            : post
        )
      );
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">📸 Feeds</h1>

      <div className="space-y-8">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post._id}
              className="bg-white shadow-md rounded-lg overflow-hidden"
            >
              {/* ✅ Post Header (Fixing Bug) */}
              <div className="p-4 flex items-center space-x-4">
                <img
                  src={
                    post.author?.profilePic || "https://via.placeholder.com/50"
                  }
                  alt="User"
                  className="w-10 h-10 rounded-full"
                />
                <p className="font-bold">{post.author?.username}</p>
              </div>

              {/* Post Image */}
              <img
                src={
                  post.photos.length > 0
                    ? post.photos[0]
                    : "https://via.placeholder.com/300"
                }
                alt="Post"
                className="w-full h-[550px] object-cover"
              />

              {/* Post Actions (Like, Comment, Share) */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex space-x-4">
                  <button onClick={() => toggleLike(post._id)}>
                    {post.likes.includes(userId) ? (
                      <FaHeart className="text-red-500 text-2xl" />
                    ) : (
                      <FaRegHeart className="text-2xl" />
                    )}
                  </button>
                  <button onClick={() => openComments(post._id)}>
                    <FaRegCommentDots className="text-2xl" />
                  </button>
                </div>
                <button onClick={() => handleShare(post._id)}>
                  <GiShare className="text-2xl" />
                </button>
              </div>

              {/* Like Count */}
              <p className="px-4 text-gray-600">{post.likes.length} Likes</p>

              {/* Caption */}
              <div className="p-4">
                <p>
                  <span className="font-bold">{post.author?.username}</span>{" "}
                  {post.caption}
                </p>
              </div>

              {/* Comments Section (Only Opens When Clicked) */}
              {openCommentPost === post._id && (
                <div className="p-4 border-t">
                  {post.comments.length > 0 && (
                    <div className="mb-2">
                      {post.comments.map((comment, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center text-gray-600"
                        >
                          <p>
                            <span className="font-bold">
                              {comment.author?.username || "Unknown User"}
                            </span>
                            : {comment.text}
                          </p>
                          {comment.author?._id === userId && ( // Show delete button only for the comment owner
                            <button
                              onClick={() =>
                                handleDeleteComment(post._id, comment._id)
                              }
                              className="text-red-500 text-sm ml-2"
                            >
                              ❌
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="w-full px-4 py-2 border rounded mt-2"
                  />
                  <button
                    onClick={() => handleComment(post._id)}
                    className="bg-blue-500 text-white px-4 py-1 rounded mt-2"
                  >
                    Post Comment
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No posts available.</p>
        )}
      </div>
    </div>
  );
};

export default FeedPage;
