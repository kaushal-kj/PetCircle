import React, { useEffect, useState } from "react";
import axios from "axios";
import ConsultationCard from "./ConsultationCard";

const ConsultationsPage = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const expertId = localStorage.getItem("id"); // Get logged-in expert ID

  useEffect(() => {
    // Fetch consultations assigned to this expert

    axios
      .get(`/expert/${expertId}/consultations`) // ✅ Fetch expert profile including consultations
      .then((response) => {
        setConsultations(response.data.data); // Extract consultations array
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching consultations:", error);
        setError("Failed to load consultations");
        setLoading(false);
      });
  }, [expertId]);

  // ✅ Handle Accept Consultation
  const handleAccept = async (consultationId) => {
    try {
      await axios.post("/consultation/respond", {
        expertId,
        consultationId,
        status: "Accepted",
      });

      setConsultations(
        consultations.map((c) =>
          c._id === consultationId ? { ...c, status: "Accepted" } : c
        )
      );
    } catch (error) {
      console.error("Error accepting consultation:", error);
    }
  };

  // ❌ Handle Decline Consultation
  // const handleDecline = async (consultationId) => {
  //   try {
  //     await axios.post("/consultation/respond", {
  //       expertId,
  //       consultationId,
  //       status: "Declined",
  //     });

  //     setConsultations(
  //       consultations.map((c) =>
  //         c._id === consultationId ? { ...c, status: "Declined" } : c
  //       )
  //     );
  //   } catch (error) {
  //     console.error("Error declining consultation:", error);
  //   }
  // };
  const handleDecline = async (consultationId) => {
    try {
      if (!expertId) {
        console.error("Expert ID is missing");
        return;
      }
      console.log("Expert ID before delete request:", expertId);
      // Make sure the request URL matches the backend route
      const response = await axios.delete(
        `/consultation/${expertId}/${consultationId}`
      );

      if (response.status === 200) {
        // ✅ Remove the consultation from the UI
        setConsultations((prev) =>
          prev.filter((c) => c._id !== consultationId)
        );
      }
    } catch (error) {
      console.error(
        "Error declining consultation:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Consultation Requests
      </h2>
      {/* ✅ Show Loading State */}
      {loading && <p className="text-gray-500">Loading consultations...</p>}

      {/* ❌ Show Error Message */}
      {error && <p className="text-red-500">{error}</p>}

      {consultations?.length > 0
        ? consultations.map((consultation) => (
            <ConsultationCard
              key={consultation._id}
              consultation={consultation}
              onAccept={handleAccept}
              onDecline={handleDecline}
            />
          ))
        : !loading && (
            <p className="text-gray-500">No consultation requests available.</p>
          )}
    </div>
  );
};

export default ConsultationsPage;
