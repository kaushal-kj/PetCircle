import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ViewExpertProfile = () => {
  const { id } = useParams();
  const [expert, setExpert] = useState(null);

  useEffect(() => {
    const fetchExpert = async () => {
      try {
        const response = await axios.get(`/expert/${id}`);
        console.log(response.data.data);

        setExpert(response.data.data);
      } catch (error) {
        console.error("Error fetching expert details:", error);
      }
    };
    fetchExpert();
  }, [id]);

  if (!expert) return <p className="text-center text-lg">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Expert Profile Info */}
      <div className="flex flex-col items-center text-center mb-6">
        <img
          src={expert.user?.profilePic || "/default-avatar.png"}
          alt={expert.user?.fullName || "Expert"}
          className="w-32 h-32 rounded-full object-cover"
        />
        <h2 className="text-2xl font-bold mt-4">{expert.user?.fullName}</h2>
        <p className="text-gray-600">{expert.expertise || "Not specified"}</p>
        <p className="mt-2 text-gray-700">
          {expert.user?.bio || "No bio available"}
        </p>
        <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
          Request Consultation
        </button>
      </div>

      {/* Expert's Posts */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">
          Posts by {expert.user?.fullName}
        </h3>
        {expert.posts && expert.posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {expert.posts.map((post) => (
              <div key={post._id} className="border p-4 rounded-lg shadow">
                <h4 className="text-lg font-bold">{post.caption}</h4>
                <p className="text-gray-600">{post.photos}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No posts yet.</p>
        )}
      </div>
    </div>
  );
};

export default ViewExpertProfile;
