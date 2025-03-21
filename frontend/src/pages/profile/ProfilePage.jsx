import React, { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import axios from "axios";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const userId = localStorage.getItem("id"); // Get user ID from local storage
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      axios
        .get(`/user/${userId}`)
        .then((response) => setUser(response.data.data))
        .catch((error) => console.error("Error fetching user:", error));
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
            src={user.profilePic || "https://via.placeholder.com/150"} // Default profile image
            alt="Profile"
            className="w-24 h-24 rounded-full border"
          />
          <div>
            <h1 className="text-2xl font-bold">{user.fullName}</h1>
            <p className="text-gray-600">@{user.username}</p>
            <p className="text-gray-500">{user.bio || "No bio available"}</p>
            <div className="flex space-x-4 mt-2">
              <span className="font-bold">{user.posts?.length || 0}</span>{" "}
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
          onClick={() => navigate("edit")} // This correctly navigates to /main/profile/edit
          className="bg-gray-200 text-black px-4 py-1 rounded-md hover:bg-gray-300"
        >
          Edit Profile
        </button>
      </div>

      {/* Ensure Child Routes Like Edit Profile Are Rendered */}
      <Outlet />
    </div>
  );
};

export default ProfilePage;
