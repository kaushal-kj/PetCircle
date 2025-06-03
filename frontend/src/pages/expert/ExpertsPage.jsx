// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const ExpertsPage = () => {
//   const [experts, setExperts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchExperts = async () => {
//       try {
//         const response = await axios.get("/experts");
//         setExperts(response.data.data || []);
//       } catch (err) {
//         console.error("Error fetching experts:", err);
//         setError("Failed to load experts. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchExperts();
//   }, []);

//   if (loading)
//     return (
//       <p className="text-center text-lg text-blue-500">Loading experts...</p>
//     );
//   if (error)
//     return <p className="text-center text-red-500 font-semibold">{error}</p>;
//   if (experts.length === 0)
//     return (
//       <p className="text-center text-gray-500 italic">No experts found.</p>
//     );

//   return (
//     <div className="container mx-auto px-2 sm:px-6 py-6">
//       <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-gray-800 mb-6 sm:mb-8">
//         Meet Our Experts
//       </h2>
//       <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
//         {experts.map((expert) => {
//           const expertName = expert.user?.fullName || "Unknown Expert";
//           const profilePic = expert.user?.profilePic || "/default-avatar.png";
//           const specialization = expert.expertise || "Not specified";
//           const isVerified = expert.isVerified;

//           return (
//             <div
//               key={expert._id}
//               className="bg-white border rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105 cursor-pointer flex flex-col h-full"
//               onClick={() => navigate(`${expert._id}`)}
//             >
//               <div className="relative">
//                 <img
//                   src={profilePic}
//                   alt={expertName}
//                   className="w-full aspect-[1/1] object-cover"
//                 />
//               </div>
//               <div className="p-4 text-center flex-1 flex flex-col justify-between">
//                 <h3 className="text-base sm:text-lg font-semibold text-gray-900">
//                   {expertName}
//                 </h3>
//                 <p className="text-xs sm:text-sm text-gray-600 mt-1">
//                   {specialization}
//                 </p>
//               </div>
//               <div className="bg-gray-100 p-3 text-center">
//                 <button className="w-full py-2 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-800 transition">
//                   View Profile
//                 </button>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default ExpertsPage;



import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ExpertsPage = () => {
  const [experts, setExperts] = useState([]);
  const [filteredExperts, setFilteredExperts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const response = await axios.get("/experts");
        setExperts(response.data.data || []);
        setFilteredExperts(response.data.data || []);
      } catch (err) {
        console.error("Error fetching experts:", err);
        setError("Failed to load experts. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchExperts();
  }, []);

  useEffect(() => {
    if (!search) {
      setFilteredExperts(experts);
    } else {
      setFilteredExperts(
        experts.filter((expert) => {
          const name = expert.user?.fullName?.toLowerCase() || "";
          const expertise = expert.expertise?.toLowerCase() || "";
          return (
            name.includes(search.toLowerCase()) ||
            expertise.includes(search.toLowerCase())
          );
        })
      );
    }
  }, [search, experts]);

  if (loading)
    return (
      <p className="text-center text-lg text-blue-500">Loading experts...</p>
    );
  if (error)
    return <p className="text-center text-red-500 font-semibold">{error}</p>;
  if (filteredExperts.length === 0)
    return (
      <div className="container mx-auto px-2 sm:px-6 py-6">
        <div className="max-w-md mx-auto mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search experts by name or expertise..."
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
          />
        </div>
        <p className="text-center text-gray-500 italic">No experts found.</p>
      </div>
    );

  return (
    <div className="container mx-auto px-2 sm:px-6 py-6">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-gray-800 mb-6 sm:mb-8">
        Meet Our Experts
      </h2>
      <div className="max-w-md mx-auto mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search experts by name or expertise..."
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
        />
      </div>
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
        {filteredExperts.map((expert) => {
          const expertName = expert.user?.fullName || "Unknown Expert";
          const profilePic = expert.user?.profilePic || "/default-avatar.png";
          const specialization = expert.expertise || "Not specified";
          const isVerified = expert.isVerified;

          return (
            <div
              key={expert._id}
              className="bg-white border rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105 cursor-pointer flex flex-col h-full"
              onClick={() => navigate(`${expert._id}`)}
            >
              <div className="relative">
                <img
                  src={profilePic}
                  alt={expertName}
                  className="w-full aspect-[1/1] object-cover"
                />
              </div>
              <div className="p-4 text-center flex-1 flex flex-col justify-between">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  {expertName}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  {specialization}
                </p>
              </div>
              <div className="bg-gray-100 p-3 text-center">
                <button className="w-full py-2 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-800 transition">
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