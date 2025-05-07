import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LoaderCircle } from "lucide-react";

const EditExpertProfile = () => {
  const [user, setUser] = useState(null);
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [expertise, setExpertise] = useState("");
  const [expertiseCertificate, setExpertiseCertificate] = useState(null);
  const [isloading, setisloading] = useState(false);
  const userId = localStorage.getItem("id");
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      axios
        .get(`/user/${userId}`)
        .then((response) => {
          setUser(response.data.data);
          setFullName(response.data.data.fullName);
          setBio(response.data.data.bio || "");
          setExpertise(response.data.data.expertise || "");
        })
        .catch((error) => console.error("Error fetching user:", error));
    }
  }, [userId]);

  //  Handle Profile Update
  const handleUpdate = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("bio", bio);
    formData.append("expertise", expertise);

    if (profilePic) formData.append("profilePic", profilePic);
    if (expertiseCertificate)
      formData.append("expertiseCertificate", expertiseCertificate);

    try {
      setisloading(true);
      await axios.put(`/user/update/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setisloading(false);
      navigate("/expert/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (!user)
    return <p className="text-center text-gray-500">Loading profile...</p>;

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-md">
      <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
      <form onSubmit={handleUpdate}>
        {/* Full Name */}
        <label className="block font-semibold">Full Name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Full Name"
          className="w-full px-4 py-2 border rounded mb-2"
        />

        {/* Bio */}
        <label className="block font-semibold">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Bio"
          className="w-full px-4 py-2 border rounded mb-2"
        />

        {/* Expertise */}
        <label className="block font-semibold">Expertise</label>
        <input
          type="text"
          value={expertise}
          onChange={(e) => setExpertise(e.target.value)}
          placeholder="Expertise Field"
          className="w-full px-4 py-2 border rounded mb-2"
        />

        {/* Profile Picture */}
        <label className="block font-semibold">Profile Picture</label>
        <input
          type="file"
          onChange={(e) => setProfilePic(e.target.files[0])}
          className="w-full px-4 py-2 border rounded mb-2"
        />

        {/* Expertise Certificate */}
        <label className="block font-semibold">Expertise Certificate</label>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setExpertiseCertificate(e.target.files[0])}
          className="w-full px-4 py-2 border rounded mb-2"
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {isloading ? (
            <div className="flex items-center">
              <LoaderCircle className="animate-spin size-5" />
              <span className="ml-1.5"> Please wait</span>
            </div>
          ) : (
            "Save Changes"
          )}
        </button>
      </form>
    </div>
  );
};

export default EditExpertProfile;
