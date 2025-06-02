import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "timeago.js";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaHeart, FaRegCommentDots, FaRegHeart } from "react-icons/fa";
import { GiShare } from "react-icons/gi";
import CommunityPostModal from "./CommunityPostModal";

const CommunityDetailsPage = () => {
  const { id } = useParams();
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isMember, setIsMember] = useState(false);

  // members list and their data
  const [showListModal, setShowListModal] = useState(false);
  const [listType, setListType] = useState("Members");
  const [listData, setListData] = useState([]);

  //comment section
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commentText, setCommentText] = useState("");

  const [showPostForm, setShowPostForm] = useState(false);

  const userId = localStorage.getItem("id");

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm();

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`/community-posts/${id}`);
      setPosts(res.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const res = await axios.get("/communities");
        const selected = res.data.find((c) => c._id === id);
        setCommunity(selected);
        setIsMember(selected?.members?.some((m) => m._id === userId));
      } catch (error) {
        console.error("Error fetching community:", error);
      }
    };

    fetchCommunity();
    fetchPosts();
  }, [id, userId]);

  const loggedInUserRole = localStorage.getItem("role");
  const navigate = useNavigate();

  const handleProfileClick = (profileId, role, expertId) => {
    if (profileId === userId) {
      if (role === "expert") {
        navigate("/expert/profile");
      } else {
        navigate("/main/profile");
      }
    } else if (role === "expert" && expertId) {
      if (loggedInUserRole === "expert") {
        navigate(`/expert/experts/${expertId}`);
      } else {
        navigate(`/main/experts/${expertId}`);
      }
    } else {
      if (loggedInUserRole === "expert") {
        navigate(`/expert/feeds/${profileId}`);
      } else {
        navigate(`/main/feeds/${profileId}`);
      }
    }
  };

  //handle like in community posts
  const handleLike = async (postId) => {
    try {
      await axios.put(`/community-posts/${postId}/like`, { userId });
      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId
            ? {
                ...post,
                likes: post.likes.includes(userId)
                  ? post.likes.filter((id) => id !== userId)
                  : [...post.likes, userId],
              }
            : post
        )
      );
    } catch (err) {
      console.error("Like failed:", err);
    }
  };

  //  Open Comment Section
  const openModal = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
    setCommentText("");
    fetchPosts();
  };

  //handle comment in commnity post
  const handleAddComment = async (postId, text) => {
    try {
      const res = await axios.post(`/community-posts/${postId}/comment`, {
        userId: localStorage.getItem("id"),
        text,
      });
      const updatedPost = res.data;
      setSelectedPost(updatedPost);
      setCommentText("");
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
      const res = await axios.delete(
        `/community-posts/${postId}/comment/${commentId}`
      );
      const updatedPost = res.data;
      setSelectedPost(updatedPost);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("content", data.content);
    formData.append("author", userId);
    formData.append("communityId", id);
    if (data.image[0]) formData.append("image", data.image[0]);

    try {
      const res = await axios.post("/community-posts/create", formData);
      setPosts((prev) => [res.data, ...prev]);
      reset();
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`/community-posts/${postId}/${userId}`);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (err) {
      console.error("Failed to delete post:", err);
    }
  };

  if (!community) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-2 sm:p-4 md:p-6 max-w-4xl mx-auto">
      <img
        src={community.image}
        alt={community.name}
        className="w-full h-40 sm:h-64 object-cover rounded mb-4"
      />
      <h1 className="text-2xl sm:text-3xl font-bold mb-2">{community.name}</h1>
      <p className="text-gray-700 mb-2">{community.description}</p>
      <p className="text-sm text-gray-500 mb-4">
        👥 {community.members.length}{" "}
        {community.members.length === 1 ? "member" : "members"}
      </p>
      <div className="flex flex-col sm:flex-row sm:items-center mb-3 gap-2">
        <h2 className="text-lg font-semibold">Members:</h2>
        <button
          onClick={() => {
            setListType("Members");
            setListData(community.members || []);
            setShowListModal(true);
          }}
          className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 sm:ml-3"
        >
          See Members
        </button>
      </div>

      {isMember && (
        <div className="mb-6">
          <button
            onClick={() => setShowPostForm((prev) => !prev)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200 w-full sm:w-auto"
          >
            {showPostForm ? "Cancel" : "Create Post"}
          </button>

          {showPostForm && (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="bg-white shadow-md p-4 sm:p-6 rounded mt-4 space-y-4"
            >
              <textarea
                {...register("content", { required: true })}
                placeholder="What's on your mind?"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                rows={4}
              />
              <input
                type="file"
                accept="image/*"
                {...register("image")}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-500 w-full text-white font-semibold py-2 rounded hover:bg-blue-600 transition duration-200"
              >
                {isSubmitting ? "Posting..." : "Post"}
              </button>
            </form>
          )}
        </div>
      )}
      {/* members list */}
      {showListModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-2">
          {/* Prevent background scroll when modal is open */}
          {(() => {
            document.body.style.overflow = "hidden";
            return null;
          })()}
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-xs sm:max-w-md max-h-[80vh] p-4 sm:p-6 overflow-hidden">
            <div className="flex flex-col h-full">
              <h2 className="text-xl sm:text-2xl font-semibold text-center border-b pb-3 capitalize">
                {listType}
              </h2>

              <div
                className={`flex-1 overflow-y-auto mt-4 space-y-3 ${
                  listData.length > 6
                    ? "scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
                    : ""
                }`}
              >
                {listData.length > 0 ? (
                  listData.map((person) => (
                    <div
                      key={person._id}
                      className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg transition cursor-pointer"
                      onClick={() =>
                        handleProfileClick(
                          person?._id,
                          person?.role,
                          person?.expertProfile,
                          loggedInUserRole
                        )
                      }
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={
                            person.profilePic ||
                            "https://via.placeholder.com/50"
                          }
                          alt="Profile"
                          className="w-10 h-10 rounded-full object-cover border"
                        />
                        <p className="font-medium text-sm">
                          {person.fullName || person.username}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center mt-8">
                    No {listType} yet.
                  </p>
                )}
              </div>

              <button
                onClick={() => {
                  setShowListModal(false);
                  document.body.style.overflow = "";
                }}
                className="mt-4 w-full py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* community posts */}
      <div>
        <h2 className="text-lg sm:text-xl font-semibold mb-4">
          Community Posts
        </h2>
        <div className="flex flex-col items-center">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post?._id}
                className="bg-white w-full max-w-xl shadow-md rounded-lg overflow-hidden mb-6"
              >
                {/* Post Header */}
                <div className="p-4 flex items-center space-x-4">
                  <img
                    onClick={() =>
                      handleProfileClick(
                        post?.author?._id,
                        post?.author?.role,
                        post?.author?.expertProfile,
                        loggedInUserRole
                      )
                    }
                    src={
                      post?.author?.profilePic ||
                      "https://via.placeholder.com/50"
                    }
                    alt="User"
                    className="w-10 h-10 rounded-full object-cover cursor-pointer"
                  />
                  <div>
                    <p
                      onClick={() =>
                        handleProfileClick(
                          post?.author?._id,
                          post?.author?.role,
                          post?.author?.expertProfile,
                          loggedInUserRole
                        )
                      }
                      className="font-bold cursor-pointer"
                    >
                      {post?.author?.username}
                    </p>
                    <p className="text-sm text-gray-500">
                      {format(post?.createdAt)}
                    </p>
                  </div>
                  {post?.author?._id === userId && (
                    <button
                      className="ml-auto text-red-500 hover:text-red-700 text-sm"
                      onClick={() => handleDeletePost(post._id)}
                    >
                      Delete
                    </button>
                  )}
                </div>

                {/* Post Image */}
                {post?.image && (
                  <img
                    src={post?.image}
                    alt="Post"
                    className="w-full h-auto max-h-80 sm:max-h-[400px] md:max-h-[550px] object-contain bg-gray-100"
                  />
                )}

                {/* Post Content */}
                <div className="p-4">
                  <p>{post?.content}</p>
                </div>

                {/* Post Actions (Like, Comment, Share) */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex space-x-2">
                    <button onClick={() => handleLike(post._id)}>
                      {post?.likes.includes(userId) ? (
                        <FaHeart className="text-red-500 text-2xl" />
                      ) : (
                        <FaRegHeart className="text-2xl" />
                      )}
                    </button>
                    <p className="mr-5 text-gray-600">
                      {post?.likes?.length === 0 ? "" : post?.likes?.length}
                    </p>
                    <button onClick={() => openModal(post)}>
                      <FaRegCommentDots className="text-2xl" />
                    </button>
                    <p className="mr-5 text-gray-600">
                      {post?.comments?.length === 0
                        ? ""
                        : post?.comments?.length}
                    </p>
                  </div>
                  <button onClick={() => handleShare(post._id)}>
                    <GiShare className="text-2xl" />
                  </button>
                </div>
                {/* Comments Section (Only Opens When Clicked) */}
                {/* Comment Modal */}
                {selectedPost && (
                  <CommunityPostModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    post={selectedPost}
                    commentText={commentText}
                    setCommentText={setCommentText}
                    handleAddComment={handleAddComment}
                    handleDeleteComment={handleDeleteComment}
                    userId={localStorage.getItem("id")}
                  />
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No posts yet in this community.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityDetailsPage;
