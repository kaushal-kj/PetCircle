import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const FullPostView = () => {
  const { state: post } = useLocation();
  const navigate = useNavigate();

  if (!post) return <p className="text-center text-gray-500">Post not found</p>;

  //  Handle Delete Post
  const handleDelete = async () => {
    try {
      await axios.delete(`/post/${post._id}`);
      navigate(-1); // Go back after deletion
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 ">
        <h2 className="text-2xl font-bold mb-2">{post.caption}</h2>
        <img
          src={post.photos[0]}
          alt="Post"
          className="w-full h-[500px] rounded-md mb-4"
        />
        <div className="flex justify-between">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Close
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Delete Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default FullPostView;
