import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LoaderCircle } from "lucide-react";

const EditProfile = () => {
  const [user, setUser] = useState(null);
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const navigate = useNavigate();
  const [isloading, setisloading] = useState(false);
  const userId = localStorage.getItem("id");

  useEffect(() => {
    axios
      .get(`/user/${userId}`)
      .then((response) => {
        setUser(response.data.data);
        setFullName(response.data.data.fullName);
        setBio(response.data.data.bio);
        setPreviewImage(response.data.data.profilePic);
      })
      .catch((error) => console.error("Error fetching user:", error));
  }, [userId]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setProfilePic(file);
    setPreviewImage(URL.createObjectURL(file)); // Preview before upload
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("bio", bio);
    if (profilePic) formData.append("profilePic", profilePic);

    setisloading(true);
    try {
      await axios.put(`/user/update/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/main/profile"); // Redirect to profile page after update
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setisloading(false);
    }
  };

  return user ? (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="flex justify-center mb-4">
          <img
            src={previewImage}
            alt="Profile Preview"
            className="w-24 h-24 rounded-full border"
          />
        </div>
        <label className="block font-semibold">Profile Picture</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full px-2 py-1 border rounded mb-3"
        />

        <label className="block font-semibold">Full Name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full px-2 py-1 border rounded mb-3"
        />

        <label className="block font-semibold">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full px-2 py-1 border rounded mb-3"
        ></textarea>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md w-full"
        >
          {isloading ? (
            <div className="flex items-center justify-center">
              <LoaderCircle className="animate-spin size-5" />
              <span className="ml-1.5"> Please wait</span>
            </div>
          ) : (
            "Save Changes"
          )}
        </button>
      </form>
    </div>
  ) : (
    <p className="text-center">Loading...</p>
  );
};

export default EditProfile;
