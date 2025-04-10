import React from "react";
import { MdDelete } from "react-icons/md";
import Modal from "react-modal";

Modal.setAppElement("#root");

const CommentModal = ({
  isOpen,
  closeModal,
  comments = [],
  commentText,
  setCommentText,
  handleComment,
  handleDeleteComment,
  postId,
  userId,
  post,
  postImage, // Optional: Pass postImage if needed
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      className="flex items-center justify-center h-screen outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50"
    >
      <div className="w-full max-w-3xl h-[70vh] bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row transition-all duration-300">
        {/* Left - Optional Image */}
        <div className="md:w-1/2 w-full bg-gray-100 flex items-center justify-center p-2">
          {postImage ? (
            <img
              src={postImage}
              alt="Post"
              className="rounded-lg h-[500px] w-[500px] object-contain"
            />
          ) : (
            <p className="text-gray-400 text-sm">No image provided</p>
          )}
        </div>

        {/* Right - Comments and Input */}
        <div className="md:w-1/2 w-full flex flex-col p-4">
          {/* Header and Close */}
          <div className="flex justify-between items-center mb-2">
            <p className="font-semibold text-gray-800 text-2xl">
              {post.author?.username || "Unknown"}
            </p>
            <button
              onClick={closeModal}
              className="text-gray-500 hover:text-black text-xl"
            >
              ✕
            </button>
          </div>

          {/* Post content */}
          <div className="text-sm text-gray-700 mb-4">{post.caption}</div>

          {/* Comment list */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-5 border-t border-b py-4 custom-scrollbar">
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <div
                  key={index}
                  className="flex justify-between items-start text-lg w-full"
                >
                  <div className="flex w-full">
                    <img
                      src={comment.author?.profilePic || "/default-profile.png"}
                      alt="Profile"
                      className="w-6 h-6 rounded-full object-cover mr-2 mt-1"
                    />
                    <div className="flex flex-col max-w-[90%] overflow-hidden">
                      <span className="font-medium">
                        {comment.author?.username || "Unknown"}:
                      </span>{" "}
                      <span
                        className="text-sm ml-2 break-words whitespace-pre-wrap"
                        style={{
                          wordBreak: "break-word",
                          overflowWrap: "anywhere",
                        }}
                      >
                        {comment.text}
                      </span>
                    </div>
                  </div>
                  {comment.author?._id === userId && (
                    <button
                      onClick={() => handleDeleteComment(postId, comment._id)}
                      className="text-red-400 hover:text-red-600 ml-2"
                    >
                      <MdDelete className="text-2xl cursor-pointer" />
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No comments yet.</p>
            )}
          </div>

          {/* Comment Input */}
          <div className="flex items-center mt-4">
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            />
            <button
              onClick={() => handleComment(postId)}
              className="ml-2 text-blue-500 font-semibold hover:text-blue-700 text-sm"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CommentModal;
