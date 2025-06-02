// import React, { useEffect, useState } from "react";
// import { useNavigate, Outlet, useParams } from "react-router-dom";
// import axios from "axios";
// import VerifiedIcon from "@mui/icons-material/Verified";

// const ViewExpertProfile = () => {
//   const { expertId } = useParams();
//   const [expert, setExpert] = useState(null);
//   const [posts, setPosts] = useState([]);
//   const [isFollowing, setIsFollowing] = useState(false);
//   const [showCertificateModal, setShowCertificateModal] = useState(false);
//   const loggedInUserId = localStorage.getItem("id"); // Current logged-in user ID

//   //followers followings list
//   const [showListModal, setShowListModal] = useState(false);
//   const [listType, setListType] = useState(""); // "followers" or "following"
//   const [listData, setListData] = useState([]);

//   //user pets detail
//   const [userPets, setUserPets] = useState([]);
//   const [selectedPet, setSelectedPet] = useState(null);
//   const [showPetModal, setShowPetModal] = useState(false);

//   const fetchList = async (type) => {
//     try {
//       const response = await axios.get(
//         `/user/${expert.user._id}/${type}` // e.g., /user/123/followers
//       );
//       setListType(type);
//       setListData(response.data[type]);
//       setShowListModal(true);
//     } catch (err) {
//       console.error("Error fetching", type, err);
//     }
//   };
//   const loggedInUserRole = localStorage.getItem("role"); // Get logged-in user's role
//   const userId = localStorage.getItem("id");

//   const handleProfileClick = (profileId, role, expertId) => {
//     if (profileId === userId) {
//       // Navigate to the logged-in user's profile based on their role
//       if (role === "expert") {
//         navigate("/expert/profile");
//       } else {
//         navigate("/main/profile");
//       }
//     } else if (role === "expert" && expertId) {
//       // If clicking an expert's profile, navigate correctly based on the logged-in user's role
//       if (loggedInUserRole === "expert") {
//         navigate(`/expert/experts/${expertId}`); // Expert viewing another expert
//       } else {
//         navigate(`/main/experts/${expertId}`); // Pet owner viewing an expert
//       }
//     } else {
//       // If clicking on a pet owner, navigate based on the logged-in user's role
//       if (loggedInUserRole === "expert") {
//         navigate(`/expert/feeds/${profileId}`);
//       } else {
//         navigate(`/main/feeds/${profileId}`);
//       }
//     }
//   };

//   // const userId = localStorage.getItem("id"); // Get logged-in expert ID
//   const navigate = useNavigate();
//   const handleMessage = () => {
//     const role = localStorage.getItem("role"); // "petOwner" or "expert"

//     if (role === "expert") {
//       navigate(`/expert/messages/${expert?.user?._id}`);
//     } else {
//       navigate(`/main/messages/${expert?.user?._id}`);
//     }
//   };

//   useEffect(() => {
//     if (expertId) {
//       // Fetch Expert Details
//       axios
//         .get(`/expert/${expertId}`)
//         .then((response) => {
//           setExpert(response.data.data); // Store expert data

//           // Check if logged-in user follows this expert
//           if (response.data.data.user.followers.includes(loggedInUserId)) {
//             setIsFollowing(true);
//           }
//         })
//         .catch((error) => console.error("Error fetching expert:", error));
//     }
//   }, [expertId]);

//   useEffect(() => {
//     if (expert && expert.user) {
//       axios
//         .get(`/posts`)
//         .then((response) => {
//           //  Filter posts where author._id matches expert.user._id
//           const expertPosts = response.data.data.filter(
//             (post) =>
//               post.author._id === expert.user._id &&
//               post.author.role === "expert"
//           );

//           //  Sort posts by newest first
//           const sortedPosts = expertPosts.sort(
//             (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//           );

//           setPosts(sortedPosts);
//         })
//         .catch((error) => console.error("Error fetching posts:", error));

//       axios
//         .get(`/pets?owner=${expert.user._id}`)
//         .then((res) => {
//           const filteredPets = res.data.data.filter((pet) => !pet.isRehomed);
//           setUserPets(filteredPets);
//         })
//         .catch((err) => console.error("Error fetching pets:", err));
//     }
//   }, [expert]);

//   // Handle Follow/Unfollow
//   const handleFollowToggle = async () => {
//     try {
//       const url = isFollowing ? "/user/unfollow" : "/user/follow";
//       const requestData = isFollowing
//         ? { userId: loggedInUserId, unfollowId: expert?.user?._id } // Unfollow request
//         : { userId: loggedInUserId, followId: expert?.user?._id }; // Follow request

//       await axios.post(url, requestData);

//       // Update UI instantly
//       setIsFollowing(!isFollowing);
//       setExpert((prevExpert) => ({
//         ...prevExpert,
//         user: {
//           ...prevExpert.user,
//           followers: isFollowing
//             ? (prevExpert?.user?.followers || []).filter(
//                 (fid) => fid !== loggedInUserId
//               )
//             : [...(prevExpert?.user?.followers || []), loggedInUserId],
//         },
//       }));
//     } catch (error) {
//       console.error("Error updating follow status:", error);
//     }
//   };

//   //  Handle Viewing Full Post
//   const handleViewPost = (post) => {
//     navigate(`${post._id}`, { state: post });
//   };

//   if (!expert)
//     return <p className="text-center text-gray-500">Loading profile...</p>;

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       {/* Profile Header */}
//       <div className="flex items-center justify-between">
//         <div className="flex items-center space-x-8">
//           <img
//             src={expert?.user?.profilePic || "https://via.placeholder.com/150"}
//             alt="Profile"
//             className="w-24 h-24 rounded-full border"
//           />
//           <div>
//             <div className="flex">
//               <h1 className="text-2xl font-bold">{expert?.user?.fullName}</h1>
//               <p className="text-xl ml-3">
//                 {expert.isVerified ? (
//                   <VerifiedIcon className="text-blue-500" />
//                 ) : (
//                   ""
//                 )}
//               </p>
//             </div>
//             <p className="text-gray-600">@{expert?.user?.username}</p>
//             <p className="text-gray-500">
//               {expert?.user?.bio || "No bio available"}
//             </p>

//             {/* Show Expertise Field */}
//             {expert.expertise && (
//               <p className="text-gray-700 font-semibold">
//                 Expertise: {expert.expertise}
//               </p>
//             )}

//             {/* Certificate Status */}
//             {expert?.expertiseCertificate ? (
//               <>
//                 <span className="text-green-600">✅ Certificate Uploaded</span>{" "}
//                 &nbsp;&nbsp;&nbsp;
//                 <button
//                   onClick={() => setShowCertificateModal(true)}
//                   className="bg-green-600 cursor-pointer text-white px-2 py-1 rounded hover:bg-green-700 mt-2"
//                 >
//                   View Certificate
//                 </button>
//               </>
//             ) : (
//               <p className="text-red-500">❌ Certificate Not Uploaded</p>
//             )}

//             {/* Followers/Following */}
//             <div className="flex space-x-4 mt-2">
//               <span>
//                 <span className="font-bold">{posts.length}</span>&nbsp;&nbsp;
//                 <span>Posts</span>
//               </span>
//               <span
//                 className="cursor-pointer"
//                 onClick={() => fetchList("followers")}
//               >
//                 <span className="font-bold">
//                   {expert.user.followers?.length || 0}
//                 </span>
//                 &nbsp;&nbsp;
//                 <span>Followers</span>
//               </span>
//               <span
//                 className="cursor-pointer"
//                 onClick={() => fetchList("following")}
//               >
//                 <span className="font-bold">
//                   {expert.user.following?.length || 0}
//                 </span>
//                 &nbsp;&nbsp;
//                 <span>Following</span>
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Show Follow/Unfollow button if NOT viewing own profile */}
//         {loggedInUserId !== expert?.user?._id && (
//           <div className="flex space-x-3">
//             <button
//               onClick={handleFollowToggle}
//               className={`px-4 py-1 rounded-md ${
//                 isFollowing
//                   ? "bg-red-500 text-white hover:bg-red-600"
//                   : "bg-blue-500 text-white hover:bg-blue-600"
//               }`}
//             >
//               {isFollowing ? "Unfollow" : "Follow"}
//             </button>
//             <button
//               onClick={handleMessage}
//               className="bg-gray-700 text-white px-4 py-1 rounded-md hover:bg-gray-800"
//             >
//               Message
//             </button>
//           </div>
//         )}
//       </div>

//       {/*  Modal to View Certificate */}
//       {showCertificateModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//           <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg">
//             <h2 className="text-xl font-bold mb-4">Expertise Certificate</h2>
//             <object
//               data={expert?.expertiseCertificate}
//               type="application/pdf"
//               width="100%"
//               height="500px"
//             >
//               <p>
//                 PDF cannot be displayed.{" "}
//                 <a
//                   href={expert?.expertiseCertificate}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   Click here to download.
//                 </a>
//               </p>
//             </object>
//             <div className="flex justify-end mt-4">
//               <button
//                 onClick={() => setShowCertificateModal(false)}
//                 className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* show following followers list model */}
//       {showListModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white rounded-xl shadow-2xl w-[90%] max-w-md max-h-[80vh] p-6 overflow-hidden">
//             <div className="flex flex-col h-full">
//               <h2 className="text-2xl font-semibold text-center border-b pb-3 capitalize">
//                 {listType}
//               </h2>

//               <div
//                 className={`flex-1 overflow-y-auto mt-4 space-y-3 ${
//                   listData.length > 6
//                     ? "scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
//                     : ""
//                 }`}
//               >
//                 {listData.length > 0 ? (
//                   listData.map((person) => (
//                     <div
//                       key={person._id}
//                       onClick={() => {
//                         handleProfileClick(
//                           person._id,
//                           person.role,
//                           person.expertProfile,
//                           loggedInUserRole
//                         );
//                         setShowListModal(false);
//                       }}
//                       className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg transition"
//                     >
//                       <div className="flex items-center space-x-3">
//                         <img
//                           src={
//                             person.profilePic ||
//                             "https://via.placeholder.com/50"
//                           }
//                           alt="Profile"
//                           className="w-10 h-10 rounded-full object-cover border"
//                         />
//                         <p className="font-medium text-sm">{person.fullName}</p>
//                       </div>
//                       {/* You can add follow/unfollow or view profile button here */}
//                     </div>
//                   ))
//                 ) : (
//                   <p className="text-gray-500 text-center mt-8">
//                     No {listType} yet.
//                   </p>
//                 )}
//               </div>

//               <button
//                 onClick={() => setShowListModal(false)}
//                 className="mt-4 w-full py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* user pets */}
//       <h3 className="mt-8 text-lg font-semibold mb-2">My Pets</h3>
//       {userPets.length === 0 ? (
//         <p className="text-gray-500 text-sm mb-4">No pets added yet.</p>
//       ) : (
//         <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
//           {userPets.map((pet) => (
//             <div
//               key={pet._id}
//               className="flex flex-col items-center cursor-pointer"
//               onClick={() => {
//                 setSelectedPet(pet);
//                 setShowPetModal(true);
//               }}
//             >
//               <img
//                 src={pet.photos?.[0] || "https://via.placeholder.com/100"}
//                 alt={pet.name}
//                 className="w-20 h-20 rounded-full object-cover border-2 border-gray-500"
//               />
//               <span className="text-sm mt-1">{pet.name}</span>
//             </div>
//           ))}
//         </div>
//       )}
//       {/* my pets show full modal */}
//       {showPetModal && selectedPet && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
//           <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
//             <h2 className="text-xl font-semibold mb-2">{selectedPet.name}</h2>
//             <img
//               src={selectedPet.photos?.[0] || "https://via.placeholder.com/300"}
//               alt={selectedPet.name}
//               className="w-full h-64 object-cover rounded mb-4"
//             />
//             <p>
//               <strong>Breed:</strong> {selectedPet.breed}
//             </p>
//             <p>
//               <strong>Age:</strong> {selectedPet.age}
//             </p>
//             <p>
//               <strong>Weight:</strong> {selectedPet.weight || "N/A"} kg
//             </p>
//             <p>
//               <strong>Medical History:</strong>{" "}
//               {selectedPet.medicalHistory || "N/A"}
//             </p>

//             <div className="mt-4 flex justify-end">
//               <button
//                 className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
//                 onClick={() => setShowPetModal(false)}
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* User Posts (Opens Full Post on Click) */}
//       <h3 className="mt-6 text-lg font-semibold">Posts</h3>
//       <div className="grid grid-cols-3 gap-2 mt-4">
//         {posts.length > 0 ? (
//           posts.map((post) => (
//             <div
//               key={post._id}
//               onClick={() => handleViewPost(post)}
//               className="cursor-pointer"
//             >
//               <img
//                 src={
//                   post.photos.length > 0
//                     ? post.photos[0]
//                     : "https://via.placeholder.com/200"
//                 }
//                 alt="Post"
//                 className="w-70 h-70 object-cover rounded-md"
//               />
//             </div>
//           ))
//         ) : (
//           <p className="text-gray-500 col-span-3 text-center">No posts yet.</p>
//         )}
//       </div>

//       <Outlet />
//     </div>
//   );
// };

// export default ViewExpertProfile;

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import VerifiedIcon from "@mui/icons-material/Verified";

const ViewExpertProfile = () => {
  const { expertId } = useParams();
  const [expert, setExpert] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const loggedInUserId = localStorage.getItem("id");

  //followers followings list
  const [showListModal, setShowListModal] = useState(false);
  const [listType, setListType] = useState(""); // "followers" or "following"
  const [listData, setListData] = useState([]);

  //user pets detail
  const [userPets, setUserPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [showPetModal, setShowPetModal] = useState(false);

  // full post modal
  const [showFullPostModal, setShowFullPostModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const isMobile = () => {
    if (typeof navigator === "undefined") return false;
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  };

  // Prevent background scroll when any modal is open
  useEffect(() => {
    if (
      showCertificateModal ||
      showListModal ||
      showPetModal ||
      showFullPostModal
    ) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showCertificateModal, showListModal, showPetModal, showFullPostModal]);

  const fetchList = async (type) => {
    try {
      const response = await axios.get(`/user/${expert.user._id}/${type}`);
      setListType(type);
      setListData(response.data[type]);
      setShowListModal(true);
    } catch (err) {
      console.error("Error fetching", type, err);
    }
  };
  const loggedInUserRole = localStorage.getItem("role");
  const userId = localStorage.getItem("id");

  const navigate = useNavigate();
  const handleProfileClick = (profileId, role, expertId) => {
    if (profileId === userId) {
      if (role === "expert") {
        navigate("/expert/profile");
      } else {
        navigate("/main/profile");
      }
    } else if (role === "expert" && expertId) {
      if (loggedInUserRole === "expert") {
        navigate(`/expert/experts/${expertId}`);
      } else {
        navigate(`/main/experts/${expertId}`);
      }
    } else {
      if (loggedInUserRole === "expert") {
        navigate(`/expert/feeds/${profileId}`);
      } else {
        navigate(`/main/feeds/${profileId}`);
      }
    }
  };

  const handleMessage = () => {
    const role = localStorage.getItem("role");
    if (role === "expert") {
      navigate(`/expert/messages/${expert?.user?._id}`);
    } else {
      navigate(`/main/messages/${expert?.user?._id}`);
    }
  };

  useEffect(() => {
    if (expertId) {
      axios
        .get(`/expert/${expertId}`)
        .then((response) => {
          setExpert(response.data.data);
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
          const expertPosts = response.data.data.filter(
            (post) =>
              post.author._id === expert.user._id &&
              post.author.role === "expert"
          );
          const sortedPosts = expertPosts.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setPosts(sortedPosts);
        })
        .catch((error) => console.error("Error fetching posts:", error));

      axios
        .get(`/pets?owner=${expert.user._id}`)
        .then((res) => {
          const filteredPets = res.data.data.filter((pet) => !pet.isRehomed);
          setUserPets(filteredPets);
        })
        .catch((err) => console.error("Error fetching pets:", err));
    }
  }, [expert]);

  // Handle Follow/Unfollow
  const handleFollowToggle = async () => {
    try {
      const url = isFollowing ? "/user/unfollow" : "/user/follow";
      const requestData = isFollowing
        ? { userId: loggedInUserId, unfollowId: expert?.user?._id }
        : { userId: loggedInUserId, followId: expert?.user?._id };

      await axios.post(url, requestData);

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

  // Handle Viewing Full Post (open modal)
  const handleViewPost = (post) => {
    setSelectedPost(post);
    setShowFullPostModal(true);
  };

  if (!expert)
    return <p className="text-center text-gray-500">Loading profile...</p>;

  return (
    <div className="max-w-4xl mx-auto p-2 sm:p-6">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8 w-full">
          <img
            src={expert?.user?.profilePic || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-24 h-24 rounded-full border"
          />
          <div className="text-center sm:text-left w-full">
            <div className="flex items-center justify-center sm:justify-start">
              <h1 className="text-2xl font-bold">{expert?.user?.fullName}</h1>
              <span className="text-xl ml-3">
                {expert.isVerified ? (
                  <VerifiedIcon className="text-blue-500" />
                ) : (
                  ""
                )}
              </span>
            </div>
            <p className="text-gray-600">@{expert?.user?.username}</p>
            <p className="text-gray-500">
              {expert?.user?.bio || "No bio available"}
            </p>
            {expert.expertise && (
              <p className="text-gray-700 font-semibold">
                Expertise: {expert.expertise}
              </p>
            )}
            {expert?.expertiseCertificate ? (
              <>
                <span className="text-green-600">✅ Certificate Uploaded</span>
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
            <div className="flex flex-wrap justify-center sm:justify-start space-x-4 mt-2">
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
        {loggedInUserId !== expert?.user?._id && (
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={handleFollowToggle}
              className={`px-4 py-1 rounded-md w-full sm:w-auto ${
                isFollowing
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
            <button
              onClick={handleMessage}
              className="bg-gray-700 text-white px-4 py-1 rounded-md hover:bg-gray-800 w-full sm:w-auto"
            >
              Message
            </button>
          </div>
        )}
      </div>

      {/*  Modal to View Certificate */}
      {showCertificateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-2">
          <div className="bg-white p-2 sm:p-6 rounded-lg shadow-lg w-full max-w-xs sm:max-w-lg">
            <h2 className="text-xl font-bold mb-4">Expertise Certificate</h2>
            <div className="w-full h-[60vh] min-h-[300px]">
              {isMobile() ? (
                <iframe
                  src={`https://docs.google.com/gview?embedded=true&url=${expert?.expertiseCertificate}`}
                  className="w-full h-full rounded"
                  frameBorder="0"
                  title="Expertise Certificate"
                ></iframe>
              ) : (
                <object
                  data={expert?.expertiseCertificate}
                  type="application/pdf"
                  className="w-full h-full rounded"
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
              )}
            </div>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-2">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-xs sm:max-w-md max-h-[80vh] p-4 sm:p-6 overflow-hidden">
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
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-2">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg max-w-xs sm:max-w-md w-full">
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

      {/* User Posts (Opens Full Post on Click) */}
      <h3 className="mt-6 text-lg font-semibold">Posts</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
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
                className="w-full aspect-square object-cover rounded-md"
              />
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-2 sm:col-span-3 text-center">
            No posts yet.
          </p>
        )}
      </div>

      {/* Full Post Modal */}
      {showFullPostModal && selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-2">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-xs sm:max-w-md md:max-w-lg">
            <h2 className="text-xl sm:text-2xl font-bold mb-2 break-words">
              {selectedPost.caption}
            </h2>
            <img
              src={selectedPost.photos[0]}
              alt="Post"
              className="w-full aspect-square sm:aspect-[4/3] object-cover rounded-md mb-4"
            />
            <div className="flex flex-col sm:flex-row justify-between gap-2">
              <button
                onClick={() => {
                  setShowFullPostModal(false);
                  setSelectedPost(null);
                }}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 w-full sm:w-auto"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewExpertProfile;
