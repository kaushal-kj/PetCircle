import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ViewProfile = () => {
  const { id } = useParams(); // Get the profile user's ID from URL
  const [user, setUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const loggedInUserId = localStorage.getItem("id"); // Current logged-in user
  const [posts, setPosts] = useState([]);

  //followers followings list
  const [showListModal, setShowListModal] = useState(false);
  const [listType, setListType] = useState(""); // "followers" or "following"
  const [listData, setListData] = useState([]);

  //user pets detail
  const [userPets, setUserPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [showPetModal, setShowPetModal] = useState(false);

  const fetchList = async (type) => {
    try {
      const response = await axios.get(
        `/user/${id}/${type}` // e.g., /user/123/followers
      );
      setListType(type);
      setListData(response.data[type]);
      setShowListModal(true);
    } catch (err) {
      console.error("Error fetching", type, err);
    }
  };

  const loggedInUserRole = localStorage.getItem("role"); // Get logged-in user's role
  const userId = localStorage.getItem("id");

  const handleProfileClick = (profileId, role, expertId) => {
    if (profileId === userId) {
      // Navigate to the logged-in user's profile based on their role
      if (role === "expert") {
        navigate("/expert/profile");
      } else {
        navigate("/main/profile");
      }
    } else if (role === "expert" && expertId) {
      // If clicking an expert's profile, navigate correctly based on the logged-in user's role
      if (loggedInUserRole === "expert") {
        navigate(`/expert/experts/${expertId}`); // Expert viewing another expert
      } else {
        navigate(`/main/experts/${expertId}`); // Pet owner viewing an expert
      }
    } else {
      // If clicking on a pet owner, navigate based on the logged-in user's role
      if (loggedInUserRole === "expert") {
        navigate(`/expert/feeds/${profileId}`);
      } else {
        navigate(`/main/feeds/${profileId}`);
      }
    }
  };

  const navigate = useNavigate();
  const handleMessage = () => {
    const role = localStorage.getItem("role"); // "petOwner" or "expert"

    if (role === "expert") {
      navigate(`/expert/messages/${id}`);
    } else {
      navigate(`/main/messages/${id}`);
    }
    // navigate(`/main/messages/${id}`); // navigate to the chat page with that user
  };

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
          //  Filter posts where author._id matches expert.user._id
          const userPosts = response.data.data.filter(
            (post) =>
              post.author._id === user._id && post.author.role === "petOwner"
          );

          //  Sort posts by newest first
          const sortedPosts = userPosts.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );

          setPosts(sortedPosts);
        })
        .catch((error) => console.error("Error fetching posts:", error));

      axios
        .get(`/pets?owner=${id}`)
        .then((res) => {
          const filteredPets = res.data.data.filter((pet) => !pet.isRehomed);
          setUserPets(filteredPets);
        })
        .catch((err) => console.error("Error fetching pets:", err));
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
            src={user.profilePic}
            alt="Profile"
            className="w-24 h-24 rounded-full border"
          />
          <div>
            <h1 className="text-2xl font-bold">{user.fullName}</h1>
            <p className="text-gray-600">@{user.username}</p>
            <p className="text-gray-500">{user.bio || "No bio available"}</p>
            <div className="flex space-x-4 mt-2">
              <span>
                <span className="font-bold">{posts?.length || 0}</span>
                &nbsp;&nbsp;
                <span>Posts</span>
              </span>
              <span
                className="cursor-pointer"
                onClick={() => fetchList("followers")}
              >
                <span className="font-bold">{user.followers?.length || 0}</span>
                &nbsp;&nbsp;
                <span>Followers</span>
              </span>
              <span
                className="cursor-pointer"
                onClick={() => fetchList("following")}
              >
                <span className="font-bold">{user.following?.length || 0}</span>
                &nbsp;&nbsp;
                <span>Following</span>
              </span>
            </div>
          </div>
        </div>

        {/* Show Follow/Unfollow button if NOT viewing own profile */}
        {loggedInUserId !== id && (
          <div className="flex space-x-3">
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
            <button
              onClick={handleMessage}
              className="bg-gray-700 text-white px-4 py-1 rounded-md hover:bg-gray-800"
            >
              Message
            </button>
          </div>
        )}
      </div>

      {/* show following followers list model */}
      {showListModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-[90%] max-w-md max-h-[80vh] p-6 overflow-hidden">
            <div className="flex flex-col h-full">
              <h2 className="text-2xl font-semibold text-center border-b pb-3 capitalize">
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
                      onClick={() => {
                        handleProfileClick(
                          person._id,
                          person.role,
                          person.expertProfile,
                          loggedInUserRole
                        );
                        setShowListModal(false);
                      }}
                      className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg transition"
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
                        <p className="font-medium text-sm">{person.fullName}</p>
                      </div>
                      {/* You can add follow/unfollow or view profile button here */}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center mt-8">
                    No {listType} yet.
                  </p>
                )}
              </div>

              <button
                onClick={() => setShowListModal(false)}
                className="mt-4 w-full py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* user pets */}
      <h3 className="mt-8 text-lg font-semibold mb-2">My Pets</h3>
      {userPets.length === 0 ? (
        <p className="text-gray-500 text-sm mb-4">No pets added yet.</p>
      ) : (
        <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
          {userPets.map((pet) => (
            <div
              key={pet._id}
              className="flex flex-col items-center cursor-pointer"
              onClick={() => {
                setSelectedPet(pet);
                setShowPetModal(true);
              }}
            >
              <img
                src={pet.photos?.[0] || "https://via.placeholder.com/100"}
                alt={pet.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-500"
              />
              <span className="text-sm mt-1">{pet.name}</span>
            </div>
          ))}
        </div>
      )}
      {/* my pets show full modal */}
      {showPetModal && selectedPet && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-2">{selectedPet.name}</h2>
            <img
              src={selectedPet.photos?.[0] || "https://via.placeholder.com/300"}
              alt={selectedPet.name}
              className="w-full h-64 object-cover rounded mb-4"
            />
            <p>
              <strong>Breed:</strong> {selectedPet.breed}
            </p>
            <p>
              <strong>Age:</strong> {selectedPet.age}
            </p>
            <p>
              <strong>Weight:</strong> {selectedPet.weight || "N/A"} kg
            </p>
            <p>
              <strong>Medical History:</strong>{" "}
              {selectedPet.medicalHistory || "N/A"}
            </p>

            <div className="mt-4 flex justify-end">
              <button
                className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
                onClick={() => setShowPetModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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
