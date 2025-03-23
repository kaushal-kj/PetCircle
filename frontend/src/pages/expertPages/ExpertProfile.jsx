import React, { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import axios from "axios";

const ExpertProfile = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const userId = localStorage.getItem("id");
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      axios
        .get(`/user/${userId}`)
        .then((response) => setUser(response.data.data))
        .catch((error) => console.error("Error fetching user:", error));

      axios
        .get(`/posts/${userId}`)
        .then((response) => {
          const sortedPosts = response.data.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setPosts(sortedPosts);
        })
        .catch((error) => console.error("Error fetching posts:", error));
    }
  }, [userId]);

  if (!user)
    return <p className="text-center text-gray-500">Loading profile...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Profile Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <img
            src={user.profilePic || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-24 h-24 rounded-full border"
          />
          <div>
            <h1 className="text-2xl font-bold">{user.fullName}</h1>
            <p className="text-gray-600">@{user.username}</p>
            <p className="text-gray-500">{user.bio || "No bio available"}</p>

            {/* Show Expertise Field */}
            {user.expertise && (
              <p className="text-gray-700 font-semibold">
                Expertise: {user.expertise}
              </p>
            )}

            {/* Certificate Status */}
            {user.expertiseCertificate ? (
              <p className="text-green-600">✅ Certificate Uploaded</p>
            ) : (
              <p className="text-red-500">❌ Certificate Not Uploaded</p>
            )}

            {/* Followers/Following */}
            <div className="flex space-x-4 mt-2">
              <span className="font-bold">{posts.length}</span>{" "}
              <span>Posts</span>
              <span className="font-bold">
                {user.followers?.length || 0}
              </span>{" "}
              <span>Followers</span>
              <span className="font-bold">
                {user.following?.length || 0}
              </span>{" "}
              <span>Following</span>
            </div>
          </div>
        </div>

        {/* Edit Profile Button */}
        <button
          onClick={() => navigate("edit")}
          className="bg-gray-200 text-black px-4 py-1 rounded-md hover:bg-gray-300"
        >
          Edit Profile
        </button>
      </div>

      {/* Expert Posts */}
      <h3 className="mt-6 text-lg font-semibold">Your Posts</h3>
      <div className="grid grid-cols-3 gap-2 mt-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id} className="cursor-pointer">
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

export default ExpertProfile;
