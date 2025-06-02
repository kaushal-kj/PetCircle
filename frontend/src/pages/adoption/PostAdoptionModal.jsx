import React, { useEffect, useState } from "react";
import axios from "axios";
import { LoaderCircle } from "lucide-react";

const PostAdoptionModal = ({ onClose, onSubmit }) => {
  const [step, setStep] = useState("choose");
  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState("");
  const [isloading, setisloading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    breed: "",
    age: "",
    weight: "",
    imageFile: null,
    contactInfo: "",
    message: "",
  });

  const userId = localStorage.getItem("id");

  // Fetch user's pets for "own" option
  useEffect(() => {
    if (step === "own" && userId) {
      axios.get(`/pets?owner=${userId}`).then((res) => {
        const availablePets = (res.data.data || []).filter(
          (pet) => !pet.isAvailableForAdoption
        );
        setPets(availablePets);
      });
    }
  }, [step, userId]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imageFile") {
      setFormData((prev) => ({ ...prev, imageFile: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmitOwn = async (e) => {
    e.preventDefault();
    if (!selectedPetId || !formData.contactInfo) {
      alert("Please fill all required fields.");
      return;
    }

    const payload = {
      petId: selectedPetId,
      postedBy: userId,
      contactInfo: formData.contactInfo,
      message: formData.message,
    };

    onSubmit(payload);
  };

  const handleSubmitRehome = async (e) => {
    e.preventDefault();
    const { name, breed, age, weight, imageFile, contactInfo, message } =
      formData;

    if (!name || !breed || !age || !imageFile || !contactInfo) {
      alert("Please fill all required fields.");
      return;
    }

    const petFormData = new FormData();
    petFormData.append("name", name);
    petFormData.append("breed", breed);
    petFormData.append("age", age);
    petFormData.append("weight", weight);
    petFormData.append("image", imageFile);
    petFormData.append("owner", userId);
    petFormData.append("isRehomed", "true");

    try {
      setisloading(true);
      const petRes = await axios.post("/addPetWithFile", petFormData);
      const petId = petRes.data.data._id;
      setisloading(false);

      const adoptionPayload = {
        petId,
        postedBy: userId,
        contactInfo,
        message,
      };

      onSubmit(adoptionPayload);
    } catch (error) {
      console.error("Error posting rehoming pet:", error);
      alert("Something went wrong while uploading. Try again.");
    }
  };

  // Prevent background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xs sm:max-w-md md:max-w-lg p-4 sm:p-6">
        {/* Step 1: Choose option */}
        {step === "choose" && (
          <div className="space-y-4 text-center">
            <h2 className="text-xl font-semibold mb-4">
              What would you like to do?
            </h2>
            <button
              onClick={() => setStep("own")}
              className="w-full bg-blue-500 text-white py-2 rounded"
            >
              🏡 Post My Pet
            </button>
            <button
              onClick={() => setStep("rehome")}
              className="w-full bg-green-500 text-white py-2 rounded"
            >
              🐶 Post Rehome / Street Pet
            </button>
            <button
              onClick={onClose}
              className="mt-2 text-gray-500 hover:text-black text-sm"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Step 2: My Pet */}
        {step === "own" && (
          <form onSubmit={handleSubmitOwn} className="space-y-4">
            <h2 className="text-lg font-semibold">Select Your Pet</h2>
            <select
              value={selectedPetId}
              onChange={(e) => setSelectedPetId(e.target.value)}
              required
              className="w-full p-2 border rounded"
            >
              <option value="">-- Choose --</option>
              {pets.map((pet) => (
                <option key={pet._id} value={pet._id}>
                  {pet.name} - {pet.breed}
                </option>
              ))}
            </select>

            <input
              name="contactInfo"
              placeholder="Contact Info (Phone or Email)*"
              value={formData.contactInfo}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
            <textarea
              name="message"
              placeholder="Optional Message"
              value={formData.message}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep("choose")}
                className="text-sm text-gray-500 underline"
              >
                ← Back
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                {isloading ? (
                  <div className="flex items-center">
                    <LoaderCircle className="animate-spin size-5" />
                    <span className="ml-1.5"> Please wait</span>
                  </div>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Rehome Pet with File Upload */}
        {step === "rehome" && (
          <form onSubmit={handleSubmitRehome} className="space-y-4">
            <h2 className="text-lg font-semibold">Post Rehoming / Stray Pet</h2>

            <input
              name="name"
              placeholder="Pet Name*"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
            <input
              name="breed"
              placeholder="Breed*"
              value={formData.breed}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
            <input
              name="age"
              type="number"
              placeholder="Age*"
              value={formData.age}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
            <input
              name="weight"
              placeholder="Weight"
              value={formData.weight}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <input
              name="imageFile"
              type="file"
              accept="image/*"
              onChange={handleChange}
              required
              className="w-full"
            />
            <input
              name="contactInfo"
              placeholder="Contact Info (Phone or Email)*"
              value={formData.contactInfo}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
            <textarea
              name="message"
              placeholder="Optional Message"
              value={formData.message}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep("choose")}
                className="text-sm text-gray-500 underline"
              >
                ← Back
              </button>
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                {isloading ? (
                  <div className="flex items-center">
                    <LoaderCircle className="animate-spin size-5" />
                    <span className="ml-1.5"> Please wait</span>
                  </div>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PostAdoptionModal;
