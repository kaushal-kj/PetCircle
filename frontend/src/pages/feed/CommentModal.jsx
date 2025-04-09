// import React from "react";
// import { MdDelete } from "react-icons/md";
// import Modal from "react-modal";

// Modal.setAppElement("#root"); // Make sure this matches your app root

// const CommentModal = ({
//   isOpen,
//   closeModal,
//   comments,
//   commentText,
//   setCommentText,
//   handleComment,
//   handleDeleteComment,
//   postId,
//   userId,
// }) => {
//   return (
//     <Modal
//       isOpen={isOpen}
//       onRequestClose={closeModal}
//       className="bg-white p-6 rounded-lg shadow-lg w-96 mx-auto mt-20"
//       overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
//     >
//       <h2 className="text-lg font-bold mb-4">Comments</h2>

//       <div className="max-h-60 overflow-y-auto">
//         {comments.length > 0 ? (
//           comments.map((comment, index) => (
//             <div
//               key={index}
//               className="flex justify-between items-center py-2 border-b"
//             >
//               <p>
//                 <span className="font-bold">
//                   {comment.author?.username || "Unknown"}
//                 </span>{" "}
//                 {comment.text}
//               </p>
//               {comment.author?._id === userId && (
//                 <button
//                   onClick={() => handleDeleteComment(postId, comment._id)}
//                   className="text-red-500 text-sm"
//                 >
//                   <MdDelete className="text-red-500 text-2xl" />
//                 </button>
//               )}
//             </div>
//           ))
//         ) : (
//           <p className="text-gray-500">No comments yet.</p>
//         )}
//       </div>

//       {/* Comment Input */}
//       <div className="mt-4 flex items-center border-t pt-2">
//         <input
//           type="text"
//           placeholder="Add a comment..."
//           value={commentText}
//           onChange={(e) => setCommentText(e.target.value)}
//           className="w-full px-4 py-2 border rounded focus:outline-none"
//         />
//         <button
//           onClick={() => handleComment(postId)}
//           className="ml-2 text-blue-500 font-bold"
//         >
//           Post
//         </button>
//       </div>

//       <button
//         onClick={closeModal}
//         className="mt-4 w-full bg-gray-200 text-black py-2 rounded hover:bg-gray-300"
//       >
//         Close
//       </button>
//     </Modal>
//   );
// };

// export default CommentModal;

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
            <h2 className="font-semibold text-gray-800">Comments</h2>
            <button
              onClick={closeModal}
              className="text-gray-500 hover:text-black text-xl"
            >
              ✕
            </button>
          </div>

          {/* Comment list */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-3 border-t border-b py-3 custom-scrollbar">
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <div
                  key={index}
                  className="flex justify-between items-start text-sm"
                >
                  <p>
                    <span className="font-medium">
                      {comment.author?.username || "Unknown"}:
                    </span>{" "}
                    {comment.text}
                  </p>
                  {comment.author?._id === userId && (
                    <button
                      onClick={() => handleDeleteComment(postId, comment._id)}
                      className="text-red-400 hover:text-red-600 ml-2"
                    >
                      <MdDelete className="text-base" />
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
