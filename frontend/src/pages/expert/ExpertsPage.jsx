import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ExpertsPage = () => {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const response = await axios.get("/experts");
        setExperts(response.data.data || []);
      } catch (err) {
        console.error("Error fetching experts:", err);
        setError("Failed to load experts. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchExperts();
  }, []);

  if (loading)
    return (
      <p className="text-center text-lg text-blue-500">Loading experts...</p>
    );
  if (error)
    return <p className="text-center text-red-500 font-semibold">{error}</p>;
  if (experts.length === 0)
    return (
      <p className="text-center text-gray-500 italic">No experts found.</p>
    );

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
        Meet Our Experts
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {experts.map((expert) => {
          const expertName = expert.user?.fullName || "Unknown Expert";
          const profilePic = expert.user?.profilePic || "/default-avatar.png";
          const specialization = expert.expertise || "Not specified";
          const isVerified = expert.isVerified;

          return (
            <div
              key={expert._id}
              className="bg-white border rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 cursor-pointer"
              onClick={() => navigate(`${expert._id}`)}
            >
              <div className="relative">
                <img
                  src={profilePic}
                  alt={expertName}
                  className="w-full h-40 object-cover"
                />
                {/* {isVerified && (
                  <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                    Verified ✅
                  </span>
                )} */}
              </div>
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  {expertName}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{specialization}</p>
              </div>
              <div className="bg-gray-100 p-3 text-center">
                <button className="w-full py-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition">
                  View Profile
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExpertsPage;
