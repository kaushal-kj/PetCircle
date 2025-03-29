import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AddCommunityForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "dog",
    location: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/community", formData);
      toast.success("Community Created!");
      onClose();
    } catch (error) {
      toast.error("Error creating community");
    }
  };

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Community Name"
          className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <select
          name="type"
          className="border p-3 w-full rounded-lg focus:outline-none"
          value={formData.type}
          onChange={handleChange}
        >
          <option value="dog">Dog</option>
          <option value="cat">Cat</option>
          <option value="bird">Bird</option>
          <option value="exotic">Exotic</option>
        </select>
        <input
          type="text"
          name="location"
          placeholder="Location (Optional)"
          className="border p-3 w-full rounded-lg focus:outline-none"
          value={formData.location}
          onChange={handleChange}
        />
        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded-lg"
          >
            Create
          </button>
          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-4 py-2 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCommunityForm;
