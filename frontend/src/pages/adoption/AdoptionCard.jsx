import React from "react";
import { MdDelete } from "react-icons/md";

const AdoptionCard = ({ pet, onDelete }) => {
  const isEmail =
    typeof pet.contactInfo === "string" && pet.contactInfo.includes("@");
  const loggedInUserId = localStorage.getItem("id"); // Get current user ID
  const isOwner = pet.postedBy?._id === loggedInUserId; // Check ownership

  return (
    <div
      className={`bg-white rounded shadow-md p-4 transition-all ${
        isOwner ? "border-l-4 border-blue-500" : ""
      }`}
    >
      <img
        src={pet.pet?.photos || "https://via.placeholder.com/300"}
        alt={pet.pet?.name}
        className="w-full h-48 object-cover rounded"
      />
      <div className="mt-4 space-y-1">
        <div className="flex justify-between items-start">
          <h2 className="text-lg font-bold">{pet.pet?.name}</h2>
          {isOwner && (
            <button
              onClick={onDelete}
              className="text-red-500 hover:text-red-700"
            >
              <MdDelete className="text-2xl cursor-pointer" />
            </button>
          )}
        </div>
        <p>
          <strong>Breed:</strong> {pet.pet?.breed}
        </p>
        <p>
          <strong>Age:</strong> {pet.pet?.age}{" "}
          {pet.pet?.age === 1 ? "year" : "years"}
        </p>
        {pet.pet?.weight && (
          <p>
            <strong>Weight:</strong> {pet.pet?.weight}
          </p>
        )}
        <p className="text-gray-700 mt-2">{pet?.message}</p>
        <p className="text-sm text-gray-500 mt-2">
          Posted by: {pet?.postedBy?.username}
        </p>
        <div className="flex items-center mt-1">
          {isEmail ? (
            <>
              <span>📧</span>
              <a
                href={`mailto:${pet?.contactInfo}`}
                className="ml-1 text-blue-500 underline"
              >
                {pet?.contactInfo}
              </a>
            </>
          ) : (
            <>
              <span>📞</span>
              <a
                href={`tel:${pet?.contactInfo}`}
                className="ml-1 text-blue-500 underline"
              >
                {pet?.contactInfo}
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdoptionCard;
