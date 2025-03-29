import React, { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import axios from "axios";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

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
          ); // Sort by latest
          setPosts(sortedPosts);
        })
        .catch((error) => console.error("Error fetching posts:", error));
    }
  }, [userId]);

  //  Handle Adding a New Post
  const handleAddPost = async (event) => {
    event.preventDefault();
    if (!caption || !image) return alert("Caption and image are required!");

    setLoading(true); // Start loading

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("author", userId);
    formData.append("image", image);

    try {
      const response = await axios.post("/post", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setPosts([response.data.data, ...posts]); // Update UI
      setCaption("");
      setImage(null);
      setShowModal(false); // Close the modal
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  //  Handle Viewing Full Post
  const handleViewPost = (post) => {
    navigate(`${post._id}`, { state: post });
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
        <button
          onClick={() => navigate("edit")}
          className="bg-gray-200 text-black px-4 py-1 rounded-md hover:bg-gray-300"
        >
          Edit Profile
        </button>
      </div>

      {/*  Create Post Button (Opens Modal) */}
      <button
        onClick={() => setShowModal(true)}
        className="bg-green-600 text-white px-4 py-2 rounded mt-6 hover:bg-green-700"
      >
        Create Post
      </button>

      {/*  Post Creation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Create a Post</h2>
            <form onSubmit={handleAddPost}>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Enter caption"
                className="w-full px-4 py-2 border rounded mb-2"
              />
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                accept="image/*"
                className="w-full px-4 py-2 border rounded mb-2"
              />
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  {loading ? "posting..." : "Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Posts (Opens Full Post on Click) */}
      <h3 className="mt-6 text-lg font-semibold">Your Posts</h3>
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

export default ProfilePage;
