import React from "react";
import { Link } from "react-router-dom";

const CommunityCard = ({
  community,
  isJoined,
  isCreator,
  onJoin,
  onLeave,
  onDelete,
}) => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden border flex flex-col h-full">
      <img
        src={community.image}
        alt={community.name}
        className="w-full h-40 sm:h-48 md:h-56 object-cover"
      />
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-base sm:text-lg font-bold">{community.name}</h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              👥 {community.members?.length || 0}{" "}
              {community.members?.length === 1 ? "member" : "members"}
            </p>
          </div>
          {isCreator && (
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded h-fit">
              Creator
            </span>
          )}
        </div>

        <p className="text-xs sm:text-sm text-gray-700 mb-3 flex-1">
          {community.description}
        </p>

        <div className="flex flex-wrap items-center gap-2 mt-auto">
          {!isJoined ? (
            <button
              onClick={onJoin}
              className="bg-green-500 text-white px-3 py-1 rounded text-xs sm:text-sm"
            >
              Join
            </button>
          ) : !isCreator ? (
            <button
              onClick={onLeave}
              className="bg-yellow-500 text-white px-3 py-1 rounded text-xs sm:text-sm"
            >
              Leave
            </button>
          ) : null}

          {isCreator && (
            <button
              onClick={() => onDelete(community._id)}
              className="bg-red-500 text-white px-3 py-1 rounded text-xs sm:text-sm"
            >
              Delete
            </button>
          )}

          <Link to={`${community._id}`}>
            <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-xs sm:text-sm">
              View
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CommunityCard;
