import React, { useEffect, useState } from "react";
import { useNavigate, Outlet, useParams } from "react-router-dom";
import axios from "axios";

const ViewExpertProfile = () => {
  const { expertId } = useParams();
  const [expert, setExpert] = useState(null);
  const [posts, setPosts] = useState([]);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  // const userId = localStorage.getItem("id"); // Get logged-in expert ID
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (expertId) {
  //     axios
  //       .get(`/expert/${expertId}`)
  //       .then((response) => {
  //         console.log(response.data.data);
  //         setExpert(response.data.data);
  //       })
  //       .catch((error) => console.error("Error fetching expert:", error));

  //     axios
  //       .get(`/posts`)
  //       .then((response) => {
  //         const expertPosts = response.data.data.filter(
  //           (post) => post.author.role === "expert"
  //         );

  //         const sortedPosts = expertPosts.sort(
  //           (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  //         );
  //         setPosts(sortedPosts);
  //       })
  //       .catch((error) => console.error("Error fetching posts:", error));
  //   }
  // }, [expertId]);

  useEffect(() => {
    if (expertId) {
      // Fetch Expert Details
      axios
        .get(`/expert/${expertId}`)
        .then((response) => {
          setExpert(response.data.data); // Store expert data
        })
        .catch((error) => console.error("Error fetching expert:", error));
    }
  }, [expertId]);

  useEffect(() => {
    if (expert && expert.user) {
      axios
        .get(`/posts`)
        .then((response) => {
          // 🔥 Filter posts where author._id matches expert.user._id
          const expertPosts = response.data.data.filter(
            (post) =>
              post.author._id === expert.user._id &&
              post.author.role === "expert"
          );

          // 🔥 Sort posts by newest first
          const sortedPosts = expertPosts.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );

          setPosts(sortedPosts);
        })
        .catch((error) => console.error("Error fetching posts:", error));
    }
  }, [expert]);

  //  Handle Viewing Full Post
  const handleViewPost = (post) => {
    navigate(`${post._id}`, { state: post });
  };

  if (!expert)
    return <p className="text-center text-gray-500">Loading profile...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Profile Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <img
            src={expert?.user?.profilePic || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-24 h-24 rounded-full border"
          />
          <div>
            <h1 className="text-2xl font-bold">{expert?.user?.fullName}</h1>
            <p className="text-gray-600">@{expert?.user?.username}</p>
            <p className="text-gray-500">
              {expert?.user?.bio || "No bio available"}
            </p>

            {/* Show Expertise Field */}
            {expert.expertise && (
              <p className="text-gray-700 font-semibold">
                Expertise: {expert.expertise}
              </p>
            )}

            {/* Certificate Status */}
            {expert?.expertiseCertificate ? (
              <>
                <span className="text-green-600">✅ Certificate Uploaded</span>{" "}
                &nbsp;&nbsp;&nbsp;
                <button
                  onClick={() => setShowCertificateModal(true)}
                  className="bg-green-600 cursor-pointer text-white px-2 py-1 rounded hover:bg-green-700 mt-2"
                >
                  View Certificate
                </button>
              </>
            ) : (
              <p className="text-red-500">❌ Certificate Not Uploaded</p>
            )}

            {/* Followers/Following */}
            <div className="flex space-x-4 mt-2">
              <span className="font-bold">{posts.length}</span>{" "}
              <span>Posts</span>
              <span className="font-bold">
                {expert.followers?.length || 0}
              </span>{" "}
              <span>Followers</span>
              <span className="font-bold">
                {expert.following?.length || 0}
              </span>{" "}
              <span>Following</span>
            </div>
          </div>
        </div>
      </div>

      {/* 🔄 Replace Create Post with Request Consultation */}
      <button
        onClick={() => navigate(`/consultation/request/${expertId}`)}
        className="bg-blue-600 text-white px-4 py-2 rounded mt-6 hover:bg-blue-700"
      >
        Request Consultation
      </button>

      {/*  Modal to View Certificate */}
      {showCertificateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg">
            <h2 className="text-xl font-bold mb-4">Expertise Certificate</h2>
            <img
              src={expert?.expertiseCertificate}
              alt="Certificate"
              className="w-full h-[500px] rounded-md"
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowCertificateModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Posts (Opens Full Post on Click) */}
      <h3 className="mt-6 text-lg font-semibold">Posts</h3>
      <div className="grid grid-cols-3 gap-2 mt-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post._id}
              onClick={() => handleViewPost(post)}
              className="cursor-pointer"
            >
              <img
                src={
                  post.photos.length > 0
                    ? post.photos[0]
                    : "https://via.placeholder.com/200"
                }
                alt="Post"
                className="w-70 h-70 object-cover rounded-md"
              />
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-3 text-center">No posts yet.</p>
        )}
      </div>

      <Outlet />
    </div>
  );
};

export default ViewExpertProfile;
