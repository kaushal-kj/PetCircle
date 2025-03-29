import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import AddCommunityForm from "./AddCommunityForm";

const CommunitiesPage = () => {
  const [communities, setCommunities] = useState({ joined: [], unjoined: [] });
  const [showAddModal, setShowAddModal] = useState(false);
  const userId = localStorage.getItem("id");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const response = await axios.get("/communities");
        const allCommunities = response.data.data;

        const joined = allCommunities.filter((c) =>
          c.members.some((m) => m._id === userId)
        );
        const unjoined = allCommunities.filter(
          (c) => !c.members.some((m) => m._id === userId)
        );

        setCommunities({ joined, unjoined });
      } catch (error) {
        toast.error("Error fetching communities");
      }
    };
    fetchCommunities();
  }, [userId]);

  // ✅ Join Community
  const handleJoin = async (communityId) => {
    try {
      await axios.put(`/community/${communityId}/join`, { userId });
      toast.success("Joined Community!");
      setCommunities((prev) => ({
        joined: [
          ...prev.joined,
          prev.unjoined.find((c) => c._id === communityId),
        ],
        unjoined: prev.unjoined.filter((c) => c._id !== communityId),
      }));
    } catch (error) {
      toast.error("Error joining community");
    }
  };

  // ✅ Leave Community
  const handleLeave = async (communityId) => {
    try {
      await axios.put(`/community/${communityId}/leave`, { userId });
      toast.success("Left Community!");
      setCommunities((prev) => ({
        joined: prev.joined.filter((c) => c._id !== communityId),
        unjoined: [
          ...prev.unjoined,
          prev.joined.find((c) => c._id === communityId),
        ],
      }));
    } catch (error) {
      toast.error("Error leaving community");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* 🔹 Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Communities</h2>
        <button
          className="bg-blue-500 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-600 transition-all"
          onClick={() => setShowAddModal(true)}
        >
          Create Community
        </button>
      </div>

      {/* 🔹 Joined Communities */}
      {communities.joined.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Joined Communities
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {communities.joined.map((community) => (
              <div
                key={community._id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                {community.image && (
                  <img
                    src={community.image}
                    alt={community.name}
                    className="w-full h-32 object-cover rounded-t-lg"
                  />
                )}
                <div className="p-4">
                  <h4 className="font-bold text-gray-900">{community.name}</h4>
                  <p className="text-sm text-gray-500">
                    {community.description}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-all"
                      onClick={() => handleLeave(community._id)}
                    >
                      Leave
                    </button>
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-all"
                      onClick={() => navigate(`${community._id}`)}
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🔹 Other Communities */}
      <h3 className="text-lg font-semibold text-gray-800 mt-8 mb-4">
        Discover New Communities
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {communities.unjoined.map((community) => (
          <div
            key={community._id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            {community.image && (
              <img
                src={community.image}
                alt={community.name}
                className="w-full h-32 object-cover rounded-t-lg"
              />
            )}
            <div className="p-4">
              <h4 className="font-bold text-gray-900">{community.name}</h4>
              <p className="text-sm text-gray-500">{community.description}</p>
              <div className="mt-3 flex gap-2">
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition-all"
                  onClick={() => handleJoin(community._id)}
                >
                  Join
                </button>
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-all"
                  onClick={() => navigate(`${community._id}`)}
                >
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 🔹 Add Community Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Create Community
            </h3>
            <AddCommunityForm onClose={() => setShowAddModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunitiesPage;
