import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "timeago.js";
import { FaHeart, FaRegHeart, FaRegCommentDots, FaShare } from "react-icons/fa";
import { GiShare } from "react-icons/gi";
import { Link, useNavigate } from "react-router-dom";
import CommentModal from "./CommentModal";

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

  //  Toggle Like
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

  //  Open Comment Section
  const openComments = (postId) => {
    setOpenCommentPost(openCommentPost === postId ? null : postId); // Toggle comment section
  };

  //  Add Comment (Backend)
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
      // setOpenCommentPost(null); // Close comment box after submitting
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  //  Share Post
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

  const loggedInUserRole = localStorage.getItem("role"); // Get logged-in user's role
  const navigate = useNavigate();

  const handleProfileClick = (profileId, role, expertId) => {
    if (profileId === userId) {
      // Navigate to the logged-in user's profile based on their role
      if (role === "expert") {
        navigate("/expert/profile");
      } else {
        navigate("/main/profile");
      }
    } else if (role === "expert" && expertId) {
      // If clicking an expert's profile, navigate correctly based on the logged-in user's role
      if (loggedInUserRole === "expert") {
        navigate(`/expert/experts/${expertId}`); // Expert viewing another expert
      } else {
        navigate(`/main/experts/${expertId}`); // Pet owner viewing an expert
      }
    } else {
      // If clicking on a pet owner, navigate based on the logged-in user's role
      if (loggedInUserRole === "expert") {
        navigate(`/expert/feeds/${profileId}`);
      } else {
        navigate(`/main/feeds/${profileId}`);
      }
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto px-2 sm:px-4 md:px-6 py-4 md:py-6">
    <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center">Feeds</h1>

    <div className="space-y-6 sm:space-y-8">
      {posts.length > 0 ? (
        posts.map((post) => (
          <div
            key={post._id}
            className="bg-white shadow-md rounded-lg overflow-hidden"
          >
            {/* Post Header */}
            <div
              className="p-3 sm:p-4 flex items-center space-x-3 sm:space-x-4 cursor-pointer"
              onClick={() =>
                handleProfileClick(
                  post.author?._id,
                  post.author?.role,
                  post.author?.expertProfile,
                  loggedInUserRole
                )
              }
            >
              <img
                src={
                  post.author?.profilePic || "https://via.placeholder.com/50"
                }
                alt="User"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full"
              />
              <div>
                <p className="font-bold">{post.author?.username}</p>
                <p className="text-xs sm:text-sm text-gray-500">
                  {format(post.createdAt)}
                </p>
              </div>
            </div>

            {/* Post Image */}
            <img
              src={
                post.photos.length > 0
                  ? post.photos[0]
                  : "https://via.placeholder.com/300"
              }
              alt="Post"
              className="w-full h-52 sm:h-80 md:h-[400px] lg:h-[550px] object-cover"
            />

            {/* Post Actions */}
            <div className="p-3 sm:p-4 flex items-center justify-between">
              <div className="flex space-x-2">
                <button onClick={() => toggleLike(post._id)}>
                  {post.likes.includes(userId) ? (
                    <FaHeart className="text-red-500 text-xl sm:text-2xl" />
                  ) : (
                    <FaRegHeart className="text-xl sm:text-2xl" />
                  )}
                </button>
                <p className="mr-3 sm:mr-5 text-gray-600 text-sm">
                  {post.likes.length === 0 ? "" : post.likes.length}
                </p>
                <button onClick={() => openComments(post._id)}>
                  <FaRegCommentDots className="text-xl sm:text-2xl" />
                </button>
                <p className="mr-3 sm:mr-5 text-gray-600 text-sm">
                  {post.comments.length === 0 ? "" : post.comments.length}
                </p>
              </div>
              <button onClick={() => handleShare(post._id)}>
                <GiShare className="text-xl sm:text-2xl" />
              </button>
            </div>

            {/* Caption */}
            <div className="p-3 sm:p-4">
              <p className="text-sm sm:text-base">
                <span className="font-bold">{post.author?.username}</span>{" "}
                {post.caption}
              </p>
            </div>

            {/* Comments Section */}
            {openCommentPost === post._id && (
              <CommentModal
                isOpen={true}
                closeModal={() => setOpenCommentPost(null)}
                comments={post.comments}
                commentText={commentText}
                setCommentText={setCommentText}
                handleComment={handleComment}
                handleDeleteComment={handleDeleteComment}
                postId={post._id}
                userId={userId}
                postImage={post.photos}
                post={post}
              />
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
