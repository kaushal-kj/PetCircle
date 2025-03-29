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

  if (loading) return <p className="text-center text-lg">Loading experts...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (experts.length === 0)
    return <p className="text-center text-gray-500">No experts found.</p>;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Our Experts</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {experts.map((expert) => {
          const expertName = expert.user?.fullName || "Unknown Expert";
          const profilePic = expert.user?.profilePic || "/default-avatar.png";
          const specialization = expert.expertise || "Not specified";
          const isVerified = expert.isVerified
            ? "✅ Verified"
            : "❌ Not Verified";

          return (
            <div
              key={expert._id}
              className="border p-4 rounded-lg shadow-lg cursor-pointer hover:bg-gray-100 transition"
              onClick={() => navigate(`${expert._id}`)}
            >
              <img
                src={profilePic}
                alt={expertName}
                className="w-20 h-20 rounded-full mb-3 object-cover mx-auto"
              />
              <h3 className="text-lg font-semibold text-center">
                {expertName}
              </h3>
              <p className="text-gray-600 text-center">{specialization}</p>
              <p className="text-sm text-gray-500 text-center">{isVerified}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExpertsPage;
