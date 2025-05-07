import React, { useEffect, useState } from "react";
import axios from "axios";
import AddCommunityForm from "./AddCommunityForm";
import CommunityCard from "./CommunityCard";

const CommunitiesPage = () => {
  const [joinedCommunities, setJoinedCommunities] = useState([]);
  const [otherCommunities, setOtherCommunities] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCommunityId, setSelectedCommunityId] = useState(null);

  const userId = localStorage.getItem("id");

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      const [joinedRes, allRes] = await Promise.all([
        axios.get(`/communities/user/${userId}`),
        axios.get("/communities"),
      ]);

      const joinedIds = joinedRes.data.map((c) => c._id);
      const others = allRes.data.filter((c) => !joinedIds.includes(c._id));

      setJoinedCommunities(joinedRes.data);
      setOtherCommunities(others);
    } catch (err) {
      console.error("Error fetching communities", err);
    }
  };

  const handleJoin = async (communityId) => {
    await axios.post(`/communities/join/${communityId}/${userId}`);
    fetchCommunities();
  };

  const handleLeave = async (communityId) => {
    await axios.post(`/communities/leave/${communityId}/${userId}`);
    fetchCommunities();
  };

  const handleDeleteClick = (communityId) => {
    setSelectedCommunityId(communityId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/communities/${selectedCommunityId}/${userId}`);
      setShowDeleteModal(false);
      setSelectedCommunityId(null);
      fetchCommunities();
    } catch (err) {
      console.error("Error deleting community", err);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Communities</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Community
        </button>
      </div>

      {/* Joined */}
      <h2 className="text-lg font-semibold mb-2">Joined Communities</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
        {joinedCommunities.map((community) => (
          <CommunityCard
            key={community._id}
            community={community}
            isJoined={true}
            isCreator={community.creator._id === userId}
            onLeave={() => handleLeave(community._id)}
            onDelete={() => handleDeleteClick(community._id)}
          />
        ))}
      </div>

      {/* Others */}
      <h2 className="text-lg font-semibold mb-2">Explore Other Communities</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {otherCommunities.map((community) => (
          <CommunityCard
            key={community._id}
            community={community}
            isJoined={false}
            isCreator={false}
            onJoin={() => handleJoin(community._id)}
          />
        ))}
      </div>

      {showForm && (
        <AddCommunityForm
          onClose={() => setShowForm(false)}
          onSuccess={fetchCommunities}
        />
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-center text-red-600">
              Confirm Deletion
            </h2>
            <p className="mb-6 text-center text-gray-700">
              Are you sure you want to delete this community? This action cannot
              be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedCommunityId(null);
                }}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunitiesPage;
