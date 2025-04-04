import React from "react";
import { MdDelete } from "react-icons/md";
import Modal from "react-modal";

Modal.setAppElement("#root"); // Make sure this matches your app root

const CommentModal = ({
  isOpen,
  closeModal,
  comments,
  commentText,
  setCommentText,
  handleComment,
  handleDeleteComment,
  postId,
  userId,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      className="bg-white p-6 rounded-lg shadow-lg w-96 mx-auto mt-20"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <h2 className="text-lg font-bold mb-4">Comments</h2>

      <div className="max-h-60 overflow-y-auto">
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <div
              key={index}
              className="flex justify-between items-center py-2 border-b"
            >
              <p>
                <span className="font-bold">
                  {comment.author?.username || "Unknown"}
                </span>{" "}
                {comment.text}
              </p>
              {comment.author?._id === userId && (
                <button
                  onClick={() => handleDeleteComment(postId, comment._id)}
                  className="text-red-500 text-sm"
                >
                  <MdDelete className="text-red-500 text-2xl" />
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No comments yet.</p>
        )}
      </div>

      {/* Comment Input */}
      <div className="mt-4 flex items-center border-t pt-2">
        <input
          type="text"
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="w-full px-4 py-2 border rounded focus:outline-none"
        />
        <button
          onClick={() => handleComment(postId)}
          className="ml-2 text-blue-500 font-bold"
        >
          Post
        </button>
      </div>

      <button
        onClick={closeModal}
        className="mt-4 w-full bg-gray-200 text-black py-2 rounded hover:bg-gray-300"
      >
        Close
      </button>
    </Modal>
  );
};

export default CommentModal;
