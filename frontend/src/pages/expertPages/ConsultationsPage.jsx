import React, { useEffect, useState } from "react";
import axios from "axios";
import ConsultationCard from "./ConsultationCard";

const ConsultationsPage = () => {
  const [consultations, setConsultations] = useState([]);
  const expertId = localStorage.getItem("id"); // Get logged-in expert ID

  useEffect(() => {
    // Fetch consultations assigned to this expert

    axios
      .get(`/expert/${expertId}/consultations`) // ✅ Fetch expert profile including consultations
      .then((response) => {
        const expertData = response.data.data;
        setConsultations(expertData.consultations); // Extract consultations array
      })
      .catch((error) => console.error("Error fetching consultations:", error));
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
  const handleDecline = async (consultationId) => {
    try {
      await axios.post("/consultation/respond", {
        expertId,
        consultationId,
        status: "Declined",
      });

      setConsultations(
        consultations.map((c) =>
          c._id === consultationId ? { ...c, status: "Declined" } : c
        )
      );
    } catch (error) {
      console.error("Error declining consultation:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Consultation Requests
      </h2>

      {consultations && consultations.length > 0 ? (
        consultations.map((consultation) => (
          <ConsultationCard
            key={consultation._id}
            consultation={consultation}
            onAccept={handleAccept}
            onDecline={handleDecline}
          />
        ))
      ) : (
        <p className="text-gray-500">No consultation requests available.</p>
      )}
    </div>
  );
};

export default ConsultationsPage;
