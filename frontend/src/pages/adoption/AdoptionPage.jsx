import React, { useEffect, useState } from "react";
import AdoptionCard from "./AdoptionCard";
import PostAdoptionModal from "./PostAdoptionModal";
import axios from "axios";

const AdoptionPage = () => {
  const [adoptions, setAdoptions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userId = localStorage.getItem("id");
  const username = localStorage.getItem("username"); // used for postedBy

  // Fetch adoptions from backend
  useEffect(() => {
    fetchAdoptions();
  }, []);

  const fetchAdoptions = async () => {
    try {
      const res = await axios.get("/adoptions"); // adjust if needed
      console.log(res.data.data);
      setAdoptions(res.data.data); // assuming response contains { data: [...] }
    } catch (error) {
      console.error("Error fetching adoptions:", error);
    }
  };

  const handleAddPet = async (data) => {
    try {
      const res = await axios.post("/adoption/create", data);
      setAdoptions((prev) => [...prev, res.data.data]);
      setIsModalOpen(false);
      fetchAdoptions();
    } catch (error) {
      console.error("Error posting adoption:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/adoption/${id}`);
      setAdoptions((prev) => prev.filter((pet) => pet._id !== id));
    } catch (error) {
      console.error("Error deleting adoption:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Pet Adoptions</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Post for Adoption
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-10">
        <section>
          <h2 className="text-2xl font-bold mb-4 border-b pb-2">
            My Adoptions
          </h2>
          {adoptions.filter((pet) => pet.postedBy?._id === userId).length >
          0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {adoptions
                .filter((pet) => pet.postedBy?._id === userId)
                .map((pet) => (
                  <AdoptionCard
                    key={pet._id}
                    pet={pet}
                    onDelete={() => handleDelete(pet._id)}
                    isOwner
                  />
                ))}
            </div>
          ) : (
            <div className="bg-gray-100 p-6 text-center rounded">
              <p className="text-gray-600">
                You haven't posted any pets for adoption yet.
              </p>
            </div>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 border-b pb-2">
            Available Pet Adoptions
          </h2>
          {adoptions.filter((pet) => pet.postedBy?._id !== userId).length >
          0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {adoptions
                .filter((pet) => pet.postedBy?._id !== userId)
                .map((pet) => (
                  <AdoptionCard key={pet._id} pet={pet} />
                ))}
            </div>
          ) : (
            <div className="bg-gray-100 p-6 text-center rounded">
              <p className="text-gray-600">
                No pets are currently available for adoption.
              </p>
            </div>
          )}
        </section>
      </main>

      {isModalOpen && (
        <PostAdoptionModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddPet}
        />
      )}
    </div>
  );
};

export default AdoptionPage;
