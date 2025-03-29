// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";

// const CommunityDetailPage = () => {
//   const { id } = useParams();
//   const [community, setCommunity] = useState(null);

//   useEffect(() => {
//     const fetchCommunity = async () => {
//       try {
//         const response = await axios.get(`/community/${id}`);
//         setCommunity(response.data.data);
//       } catch (error) {
//         toast.error("Error fetching community details");
//       }
//     };
//     fetchCommunity();
//   }, [id]);

//   if (!community) return <p>Loading community details...</p>;

//   return (
//     <div className="p-6">
//       <h2 className="text-xl font-bold">{community.name}</h2>
//       <p className="text-gray-600">Type: {community.type}</p>
//       <p className="text-gray-600">Location: {community.location || "N/A"}</p>

//       <h3 className="text-lg font-semibold mt-4">Members:</h3>
//       <ul>
//         {community.members.map((member) => (
//           <li key={member._id}>
//             {member.username} ({member.email})
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default CommunityDetailPage;

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const CommunityDetailPage = () => {
  const { id } = useParams();
  const [community, setCommunity] = useState(null);

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const response = await axios.get(`/community/${id}`);
        setCommunity(response.data.data);
      } catch (error) {
        toast.error("Error fetching community details");
      }
    };
    fetchCommunity();
  }, [id]);

  if (!community)
    return (
      <p className="text-center text-gray-500 text-lg mt-10">
        Loading community details...
      </p>
    );

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        {community.name}
      </h2>
      <p className="text-gray-600 text-lg">
        <span className="font-semibold">Type:</span> {community.type}
      </p>
      <p className="text-gray-600 text-lg">
        <span className="font-semibold">Location:</span>{" "}
        {community.location || "N/A"}
      </p>

      <h3 className="text-xl font-semibold mt-6 border-b pb-2">Members:</h3>
      <ul className="mt-3 space-y-2">
        {community.members.map((member) => (
          <li
            key={member._id}
            className="flex items-center justify-between bg-gray-100 p-3 rounded-md shadow-sm"
          >
            <span className="text-gray-700 font-medium">{member.username}</span>
            <span className="text-gray-500 text-sm">{member.email}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommunityDetailPage;
