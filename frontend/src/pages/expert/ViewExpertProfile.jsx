import React, { useEffect, useState } from "react";
import { useNavigate, Outlet, useParams } from "react-router-dom";
import axios from "axios";

const ViewExpertProfile = () => {
  const { expertId } = useParams();
  const [expert, setExpert] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const loggedInUserId = localStorage.getItem("id"); // Current logged-in user ID

  //followers followings list
  const [showListModal, setShowListModal] = useState(false);
  const [listType, setListType] = useState(""); // "followers" or "following"
  const [listData, setListData] = useState([]);

  const fetchList = async (type) => {
    try {
      const response = await axios.get(
        `/user/${expert.user._id}/${type}` // e.g., /user/123/followers
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

  // const userId = localStorage.getItem("id"); // Get logged-in expert ID
  const navigate = useNavigate();
  const handleMessage = () => {
    const role = localStorage.getItem("role"); // "petOwner" or "expert"

    if (role === "expert") {
      navigate(`/expert/messages/${expert?.user?._id}`);
    } else {
      navigate(`/main/messages/${expert?.user?._id}`);
    }
    // navigate(`/main/messages/${expert?.user?._id}`); // navigate to the chat page with that user
  };

  useEffect(() => {
    if (expertId) {
      // Fetch Expert Details
      axios
        .get(`/expert/${expertId}`)
        .then((response) => {
          // console.log(response.data.data);
          setExpert(response.data.data); // Store expert data

          // Check if logged-in user follows this expert
          if (response.data.data.user.followers.includes(loggedInUserId)) {
            setIsFollowing(true);
          }
        })
        .catch((error) => console.error("Error fetching expert:", error));
    }
  }, [expertId]);

  useEffect(() => {
    if (expert && expert.user) {
      axios
        .get(`/posts`)
        .then((response) => {
          //  Filter posts where author._id matches expert.user._id
          const expertPosts = response.data.data.filter(
            (post) =>
              post.author._id === expert.user._id &&
              post.author.role === "expert"
          );

          //  Sort posts by newest first
          const sortedPosts = expertPosts.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );

          setPosts(sortedPosts);
        })
        .catch((error) => console.error("Error fetching posts:", error));
    }
  }, [expert]);

  // Handle Follow/Unfollow
  const handleFollowToggle = async () => {
    try {
      const url = isFollowing ? "/user/unfollow" : "/user/follow";
      const requestData = isFollowing
        ? { userId: loggedInUserId, unfollowId: expert?.user?._id } // Unfollow request
        : { userId: loggedInUserId, followId: expert?.user?._id }; // Follow request

      await axios.post(url, requestData);

      // Update UI instantly
      setIsFollowing(!isFollowing);
      setExpert((prevExpert) => ({
        ...prevExpert,
        user: {
          ...prevExpert.user,
          followers: isFollowing
            ? (prevExpert?.user?.followers || []).filter(
                (fid) => fid !== loggedInUserId
              )
            : [...(prevExpert?.user?.followers || []), loggedInUserId],
        },
      }));
    } catch (error) {
      console.error("Error updating follow status:", error);
    }
  };

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
              <span>
                <span className="font-bold">{posts.length}</span>&nbsp;&nbsp;
                <span>Posts</span>
              </span>
              <span
                className="cursor-pointer"
                onClick={() => fetchList("followers")}
              >
                <span className="font-bold">
                  {expert.user.followers?.length || 0}
                </span>
                &nbsp;&nbsp;
                <span>Followers</span>
              </span>
              <span
                className="cursor-pointer"
                onClick={() => fetchList("following")}
              >
                <span className="font-bold">
                  {expert.user.following?.length || 0}
                </span>
                &nbsp;&nbsp;
                <span>Following</span>
              </span>
            </div>
          </div>
        </div>

        {/* Show Follow/Unfollow button if NOT viewing own profile */}
        {loggedInUserId !== expert?.user?._id && (
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

      {/*  Modal to View Certificate */}
      {showCertificateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg">
            <h2 className="text-xl font-bold mb-4">Expertise Certificate</h2>
            <object
              data={expert?.expertiseCertificate}
              type="application/pdf"
              width="100%"
              height="500px"
            >
              <p>
                PDF cannot be displayed.{" "}
                <a
                  href={expert?.expertiseCertificate}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Click here to download.
                </a>
              </p>
            </object>
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
