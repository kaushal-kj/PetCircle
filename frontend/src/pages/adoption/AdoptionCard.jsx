import React from "react";
import { MdDelete } from "react-icons/md";

const AdoptionCard = ({ pet, onDelete }) => {
  const isEmail =
    typeof pet.contactInfo === "string" && pet.contactInfo.includes("@");
  const loggedInUserId = localStorage.getItem("id");
  const isOwner = pet.postedBy?._id === loggedInUserId;

  return (
    <div
      className={`bg-white rounded shadow-md p-2 sm:p-4 transition-all ${
        isOwner ? "border-l-4 border-blue-500" : ""
      }`}
    >
      <img
        src={pet.pet?.photos || "https://via.placeholder.com/300"}
        alt={pet.pet?.name}
        className="w-full aspect-[4/3] object-cover rounded"
      />
      <div className="mt-3 sm:mt-4 space-y-1">
        <div className="flex justify-between items-start gap-2">
          <h2 className="text-base sm:text-lg font-bold truncate">
            {pet.pet?.name}
          </h2>
          {isOwner && (
            <button
              onClick={onDelete}
              className="text-red-500 hover:text-red-700"
              aria-label="Delete"
            >
              <MdDelete className="text-2xl sm:text-2xl cursor-pointer" />
            </button>
          )}
        </div>
        <p className="text-sm sm:text-base">
          <strong>Breed:</strong> {pet.pet?.breed}
        </p>
        <p className="text-sm sm:text-base">
          <strong>Age:</strong> {pet.pet?.age}{" "}
          {pet.pet?.age === 1 ? "year" : "years"}
        </p>
        {pet.pet?.weight && (
          <p className="text-sm sm:text-base">
            <strong>Weight:</strong> {pet.pet?.weight}
          </p>
        )}
        <p className="text-gray-700 mt-2 text-sm sm:text-base break-words">
          {pet?.message}
        </p>
        <p className="text-xs sm:text-sm text-gray-500 mt-2">
          Posted by: {pet?.postedBy?.username}
        </p>
        <div className="flex items-center mt-1 text-sm sm:text-sm break-all">
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
