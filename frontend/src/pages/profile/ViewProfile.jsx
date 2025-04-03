import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ViewProfile = () => {
  const { id } = useParams(); // Get the profile user's ID from URL
  const [user, setUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const loggedInUserId = localStorage.getItem("id"); // Current logged-in user
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (id) {
      // Fetch profile data
      axios
        .get(`/user/${id}`)
        .then((response) => {
          setUser(response.data.data);

          // Check if logged-in user follows this profile
          if (response.data.data.followers.includes(loggedInUserId)) {
            setIsFollowing(true);
          }
        })
        .catch((error) => console.error("Error fetching user:", error));
    }
  }, [id]);
  useEffect(() => {
    if (user) {
      axios
        .get(`/posts`)
        .then((response) => {
          // 🔥 Filter posts where author._id matches expert.user._id
          const userPosts = response.data.data.filter(
            (post) =>
              post.author._id === user._id && post.author.role === "petOwner"
          );

          // 🔥 Sort posts by newest first
          const sortedPosts = userPosts.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );

          setPosts(sortedPosts);
        })
        .catch((error) => console.error("Error fetching posts:", error));
    }
  }, [user]);

  // Handle Follow/Unfollow
  const handleFollowToggle = async () => {
    try {
      const url = isFollowing ? "/user/unfollow" : "/user/follow";
      const requestData = isFollowing
        ? { userId: loggedInUserId, unfollowId: id } // Use `unfollowId` for unfollowing
        : { userId: loggedInUserId, followId: id }; // Use `followId` for following

      await axios.post(url, requestData);

      // Update UI instantly
      setIsFollowing(!isFollowing);
      setUser((prevUser) => ({
        ...prevUser,
        followers: isFollowing
          ? prevUser.followers.filter((fid) => fid !== loggedInUserId) // Remove follower
          : [...prevUser.followers, loggedInUserId], // Add follower
      }));
    } catch (error) {
      console.error("Error updating follow status:", error);
    }
  };

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
            <div className="flex space-x-4 mt-2">
              <span className="font-bold">{posts?.length || 0}</span>{" "}
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

        {/* Show Follow/Unfollow button if NOT viewing own profile */}
        {loggedInUserId !== id && (
          <button
            onClick={handleFollowToggle}
            className={`px-4 py-1 rounded-md ${
              isFollowing
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
        )}
      </div>

      {/* User Posts (Non-editable) */}
      <h3 className="mt-6 text-lg font-semibold">Posts</h3>
      <div className="grid grid-cols-3 gap-2 mt-4">
        {posts?.length > 0 ? (
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
    </div>
  );
};

export default ViewProfile;
