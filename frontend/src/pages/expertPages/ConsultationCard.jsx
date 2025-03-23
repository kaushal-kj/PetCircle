import React from "react";

const ConsultationCard = ({ consultation, onAccept, onDecline }) => {
  return (
    <div className="bg-white shadow-md p-4 rounded-lg border border-gray-200">
      <h3 className="text-lg font-bold text-gray-800">
        Pet Owner: {consultation.petOwner?.fullName || "Unknown"}
      </h3>
      <p className="text-gray-600">Pet Details: {consultation.petDetails}</p>
      <p className="text-gray-600">Issue: {consultation.issue}</p>
      <p className="text-gray-600">
        Status:
        <span
          className={`ml-2 font-semibold ${
            consultation.status === "Pending"
              ? "text-yellow-500"
              : consultation.status === "Accepted"
              ? "text-green-600"
              : "text-red-500"
          }`}
        >
          {consultation.status}
        </span>
      </p>

      {/* Show buttons only for pending requests */}
      {consultation.status === "Pending" && (
        <div className="mt-4 flex space-x-4">
          <button
            onClick={() => onAccept(consultation._id)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          >
            ✅ Accept
          </button>
          <button
            onClick={() => onDecline(consultation._id)}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            ❌ Decline
          </button>
        </div>
      )}
    </div>
  );
};

export default ConsultationCard;
