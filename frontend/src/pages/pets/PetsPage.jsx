import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

const DEFAULT_PHOTO =
  "https://i.pinimg.com/474x/3c/ae/07/3cae079ca0b9e55ec6bfc1b358c9b1e2.jpg"; // Default pet photo

const PetsPage = () => {
  const [pets, setPets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentPet, setCurrentPet] = useState(null);
  const [previewImage, setPreviewImage] = useState(DEFAULT_PHOTO); // Preview selected image

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  // Fetch pets from backend
  // useEffect(() => {
  //   axios
  //     .get("/pets")
  //     .then((response) => setPets(response.data.data))
  //     .catch((error) => console.error("Error fetching pets:", error));
  // }, []);
  useEffect(() => {
    const userId = localStorage.getItem("id"); // Get logged-in user ID from storage

    if (!userId) {
      console.error("No user ID found, redirecting to login...");
      return;
    }

    axios
      .get(`/pets?owner=${userId}`) // Fetch pets for the specific user
      .then((response) => setPets(response.data.data))
      .catch((error) => console.error("Error fetching pets:", error));
  }, []);

  // Open modal for adding/editing pet
  const openModal = (pet = null) => {
    setEditMode(!!pet);
    setCurrentPet(pet);

    if (pet) {
      setValue("name", pet.name);
      setValue("breed", pet.breed);
      setValue("age", pet.age);
      setValue("weight", pet.weight || "");
      setValue("medicalHistory", pet.medicalHistory || "");
      setPreviewImage(pet.photos.length > 0 ? pet.photos[0] : DEFAULT_PHOTO);
    } else {
      reset();
      setPreviewImage(DEFAULT_PHOTO);
    }

    setShowModal(true);
  };

  // Handle image preview
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file)); // Show selected image preview
    }
  };

  // Handle Add/Edit Pet Submission
  const onSubmit = async (data) => {
    try {
      const userId = localStorage.getItem("id"); // Ensure correct key is used
      if (!userId) {
        console.error("User not logged in!");
        return;
      }
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("breed", data.breed);
      formData.append("age", data.age);
      formData.append("weight", data.weight || "N/A");
      formData.append("medicalHistory", data.medicalHistory || "N/A");
      formData.append("owner", userId); // Ensure owner ID is included

      // Handle file upload
      if (data.image && data.image.length > 0) {
        formData.append("image", data.image[0]); // Append file to FormData
      }

      if (editMode) {
        await axios.put(`/pet/${currentPet._id}`, formData);
        setPets((prevPets) =>
          prevPets.map((pet) =>
            pet._id === currentPet._id ? { ...pet, ...data } : pet
          )
        );
      } else {
        const response = await axios.post("/addPetWithFile", formData);
        setPets([...pets, response.data.data]);
      }

      setShowModal(false);
      reset();
    } catch (error) {
      console.error("Error saving pet:", error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">🐾 My Pets</h1>
      <button
        onClick={() => openModal()}
        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-300 mb-6"
      >
        ➕ Add Pet
      </button>

      {/* Pet List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {pets.length > 0 ? (
          pets.map((pet) => (
            <div
              key={pet._id}
              className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center"
            >
              <img
                src={pet.photos.length > 0 ? pet.photos[0] : DEFAULT_PHOTO}
                alt={pet.name}
                className="w-32 h-32 rounded-full object-cover border"
              />
              <h2 className="text-xl font-bold mt-3">{pet.name}</h2>
              <p className="text-gray-600">{pet.breed}</p>
              <p className="text-gray-500">Age: {pet.age} years</p>
              <p className="text-gray-500">Weight: {pet.weight || "N/A"} kg</p>
              <p className="text-gray-500">
                Medical History: {pet.medicalHistory || "N/A"}
              </p>

              <div className="flex space-x-2 mt-3">
                <button
                  onClick={() => openModal(pet)}
                  className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() =>
                    axios
                      .delete(`/pet/${pet._id}`)
                      .then(() =>
                        setPets(pets.filter((p) => p._id !== pet._id))
                      )
                  }
                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No pets added yet.</p>
        )}
      </div>

      {/* Modal for Adding/Editing Pet */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">
              {editMode ? "Edit Pet" : "Add a New Pet"}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)}>
              <input
                type="text"
                {...register("name", { required: "Pet name is required" })}
                placeholder="Pet Name"
                className="w-full px-4 py-2 border rounded mb-2"
              />
              {errors.name && (
                <p className="text-red-500">{errors.name.message}</p>
              )}

              <input
                type="text"
                {...register("breed", { required: "Breed is required" })}
                placeholder="Breed"
                className="w-full px-4 py-2 border rounded mb-2"
              />
              {errors.breed && (
                <p className="text-red-500">{errors.breed.message}</p>
              )}

              <input
                type="number"
                {...register("age", { required: "Age is required", min: 0 })}
                placeholder="Age"
                className="w-full px-4 py-2 border rounded mb-2"
              />
              {errors.age && (
                <p className="text-red-500">{errors.age.message}</p>
              )}

              <input
                type="number"
                {...register("weight")}
                placeholder="Weight (optional)"
                className="w-full px-4 py-2 border rounded mb-2"
              />
              <input
                type="text"
                {...register("medicalHistory")}
                placeholder="Medical History (optional)"
                className="w-full px-4 py-2 border rounded mb-2"
              />

              {/* Image Upload with Preview */}
              <label className="block font-medium text-gray-700">
                Pet Photo
              </label>
              <input
                type="file"
                {...register("image")}
                accept="image/*"
                className="w-full px-4 py-2 border rounded mb-2"
                onChange={handleImageChange}
              />
              <img
                src={previewImage}
                alt="Preview"
                className="w-32 h-32 object-cover border rounded-md mx-auto mt-2"
              />

              <div className="flex justify-end mt-4 space-x-3">
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
                  {editMode ? "Save Changes" : "Add Pet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetsPage;
